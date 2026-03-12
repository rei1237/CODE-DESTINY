const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const Payment = require("../models/Payment");
const PointHistory = require("../models/PointHistory");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  validatePointChargePayload,
  resolveChargePointsByAmount,
} = require("../utils/validation");
const { fetchPortOnePayment } = require("../services/portone.service");

const router = express.Router();

function toDateFromUnixSeconds(value) {
  const unixSeconds = Number(value);
  if (!Number.isFinite(unixSeconds) || unixSeconds <= 0) return new Date();
  return new Date(unixSeconds * 1000);
}

function normalizePaymentMethod(value) {
  const method = String(value || "unknown").trim();
  return method ? method.slice(0, 32) : "unknown";
}

function buildMerchantUid(userId) {
  const userTag = String(userId || "guest").replace(/[^a-zA-Z0-9]/g, "").slice(-8) || "guest";
  const randomTag = Math.random().toString(36).slice(2, 8);
  return `md_${Date.now()}_${userTag}_${randomTag}`;
}

function parseCustomDataUserId(customData) {
  if (!customData) return null;

  let parsed = customData;
  if (typeof customData === "string") {
    try {
      parsed = JSON.parse(customData);
    } catch (error) {
      return null;
    }
  }

  const userId = String(parsed?.userId || parsed?.uid || "").trim();
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return null;
  return userId;
}

function formatPaymentResponse(payment) {
  if (!payment) return null;

  return {
    id: String(payment._id),
    impUid: payment.impUid,
    merchantUid: payment.merchantUid,
    paymentAmount: Number(payment.paymentAmount || 0),
    chargedPoints: Number(payment.chargedPoints || 0),
    paymentMethod: payment.paymentMethod,
    status: payment.status,
    paidAt: payment.paidAt,
  };
}

async function getUserPoints(userId) {
  const user = await User.findById(userId).select("points").lean();
  return Number(user?.points || 0);
}

async function markPaymentFailure(paymentRecord, patch = {}) {
  if (!paymentRecord?._id) return;

  await Payment.findByIdAndUpdate(paymentRecord._id, {
    $set: {
      status: patch.status || "failed",
      paymentMethod: patch.paymentMethod || paymentRecord.paymentMethod || "unknown",
      rawPortOne: patch.rawPortOne,
    },
  }).catch(() => {});
}

async function findPaymentRecord(impUid, merchantUid) {
  if (impUid) {
    const byImp = await Payment.findOne({ impUid }).lean();
    if (byImp) return byImp;
  }

  if (merchantUid) {
    const byMerchant = await Payment.findOne({ merchantUid }).lean();
    if (byMerchant) return byMerchant;
  }

  return null;
}

async function ensurePaymentRecord({
  existing,
  userId,
  impUid,
  merchantUid,
  paymentAmount,
  expectedChargedPoints,
  paymentMethod,
  source,
}) {
  if (existing) return existing;

  const created = await Payment.create({
    userId,
    impUid,
    merchantUid: merchantUid || undefined,
    paymentAmount,
    expectedChargedPoints,
    chargedPoints: 0,
    paymentMethod,
    status: "pending",
    source,
  });

  return created.toObject();
}

async function settlePaymentByImpUid({
  impUid,
  requestedUserId,
  requestedAmount,
  requestedChargePoints,
  requestedPaymentMethod,
  merchantUidHint,
  source,
  strictAmountMatch,
}) {
  const portOnePayment = await fetchPortOnePayment(impUid);
  const portOneStatus = String(portOnePayment.status || "").toLowerCase();
  const portOneAmount = Number(portOnePayment.amount);
  const merchantUid = String(portOnePayment.merchant_uid || merchantUidHint || "").trim();
  const paymentMethod = normalizePaymentMethod(portOnePayment.pay_method || requestedPaymentMethod);

  let paymentRecord = await findPaymentRecord(impUid, merchantUid);

  const customDataUserId = parseCustomDataUserId(portOnePayment.custom_data);
  const ownerUserId = paymentRecord?.userId
    ? String(paymentRecord.userId)
    : (requestedUserId ? String(requestedUserId) : customDataUserId);

  if (!ownerUserId || !mongoose.Types.ObjectId.isValid(ownerUserId)) {
    return {
      ok: false,
      status: 400,
      message: "결제 소유 사용자 정보를 확인할 수 없습니다.",
    };
  }

  if (requestedUserId && String(requestedUserId) !== ownerUserId) {
    return {
      ok: false,
      status: 403,
      message: "본인 결제 건만 처리할 수 있습니다.",
    };
  }

  const expectedAmount = Number.isInteger(Number(requestedAmount))
    ? Number(requestedAmount)
    : Number(paymentRecord?.paymentAmount || 0);

  const expectedChargedPoints = Number.isInteger(Number(requestedChargePoints))
    ? Number(requestedChargePoints)
    : Number(paymentRecord?.expectedChargedPoints || 0);

  paymentRecord = await ensurePaymentRecord({
    existing: paymentRecord,
    userId: ownerUserId,
    impUid,
    merchantUid,
    paymentAmount: expectedAmount > 0 ? expectedAmount : Math.max(Number(portOneAmount) || 0, 0),
    expectedChargedPoints,
    paymentMethod,
    source,
  });

  if (paymentRecord.status === "success") {
    return {
      ok: true,
      idempotent: true,
      user: {
        id: ownerUserId,
        points: await getUserPoints(ownerUserId),
      },
      payment: formatPaymentResponse(paymentRecord),
    };
  }

  if (!Number.isInteger(portOneAmount) || portOneAmount <= 0) {
    await markPaymentFailure(paymentRecord, {
      status: "failed",
      paymentMethod,
      rawPortOne: portOnePayment,
    });

    return {
      ok: false,
      status: 400,
      message: "포트원 결제 금액 정보가 올바르지 않습니다.",
    };
  }

  if (
    strictAmountMatch
    && requestedAmount !== undefined
    && requestedAmount !== null
    && Number(requestedAmount) !== portOneAmount
  ) {
    await markPaymentFailure(paymentRecord, {
      status: "failed",
      paymentMethod,
      rawPortOne: portOnePayment,
    });

    return {
      ok: false,
      status: 400,
      message: "결제 위변조가 감지되었습니다. 금액이 일치하지 않습니다.",
      clientAmount: Number(requestedAmount),
      portOneAmount,
    };
  }

  if (Number(paymentRecord.paymentAmount || 0) > 0 && Number(paymentRecord.paymentAmount) !== portOneAmount) {
    await markPaymentFailure(paymentRecord, {
      status: "failed",
      paymentMethod,
      rawPortOne: portOnePayment,
    });

    return {
      ok: false,
      status: 400,
      message: "서버 주문 금액과 실제 결제 금액이 일치하지 않습니다.",
      expectedAmount: Number(paymentRecord.paymentAmount),
      portOneAmount,
    };
  }

  if (portOneStatus !== "paid") {
    const failedStatus = portOneStatus === "cancelled" ? "cancelled" : "failed";

    await markPaymentFailure(paymentRecord, {
      status: failedStatus,
      paymentMethod,
      rawPortOne: portOnePayment,
    });

    return {
      ok: false,
      status: 400,
      message: "결제가 완료되지 않은 상태입니다.",
      portOneStatus: portOneStatus || "unknown",
    };
  }

  let chargedPoints;
  try {
    const pointsForPolicy = expectedChargedPoints > 0 ? expectedChargedPoints : undefined;
    chargedPoints = resolveChargePointsByAmount(portOneAmount, pointsForPolicy);
  } catch (error) {
    await markPaymentFailure(paymentRecord, {
      status: "failed",
      paymentMethod,
      rawPortOne: portOnePayment,
    });

    return {
      ok: false,
      status: 400,
      message: error.message || "충전 포인트 정책 검증에 실패했습니다.",
    };
  }

  const paidAt = toDateFromUnixSeconds(portOnePayment.paid_at);

  const finalizedPayment = await Payment.findOneAndUpdate(
    {
      _id: paymentRecord._id,
      status: { $ne: "success" },
    },
    {
      $set: {
        userId: ownerUserId,
        impUid,
        merchantUid: merchantUid || paymentRecord.merchantUid || undefined,
        paymentAmount: portOneAmount,
        expectedChargedPoints: chargedPoints,
        chargedPoints,
        paymentMethod,
        status: "success",
        paidAt,
        source,
        rawPortOne: portOnePayment,
      },
    },
    { new: true },
  ).lean();

  if (!finalizedPayment) {
    const latestPayment = await Payment.findById(paymentRecord._id).lean();
    return {
      ok: true,
      idempotent: true,
      user: {
        id: ownerUserId,
        points: await getUserPoints(ownerUserId),
      },
      payment: formatPaymentResponse(latestPayment),
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    ownerUserId,
    { $inc: { points: chargedPoints } },
    { new: true, projection: { points: 1 } },
  ).lean();

  if (!updatedUser) {
    await Payment.findByIdAndUpdate(finalizedPayment._id, {
      $set: { status: "failed" },
    }).catch(() => {});

    return {
      ok: false,
      status: 404,
      message: "포인트를 충전할 사용자를 찾을 수 없습니다.",
    };
  }

  await PointHistory.create({
    userId: ownerUserId,
    kind: "charge",
    delta: chargedPoints,
    balanceAfter: Number(updatedUser.points || 0),
    reason: "포인트 충전",
    paymentId: finalizedPayment._id,
    impUid,
    merchantUid: finalizedPayment.merchantUid,
    metadata: {
      source,
      paymentAmount: portOneAmount,
      paymentMethod,
    },
  }).catch(() => {});

  return {
    ok: true,
    idempotent: false,
    user: {
      id: ownerUserId,
      points: Number(updatedUser.points || 0),
    },
    payment: formatPaymentResponse(finalizedPayment),
  };
}

router.post("/webhook", async (req, res, next) => {
  try {
    const impUid = String(
      req.body?.imp_uid
      || req.body?.impUid
      || req.body?.data?.imp_uid
      || "",
    ).trim();

    const merchantUid = String(
      req.body?.merchant_uid
      || req.body?.merchantUid
      || req.body?.data?.merchant_uid
      || "",
    ).trim();

    if (!impUid) {
      return res.status(400).json({ message: "웹훅 본문에 imp_uid가 필요합니다." });
    }

    const settled = await settlePaymentByImpUid({
      impUid,
      merchantUidHint: merchantUid || undefined,
      source: "webhook",
      strictAmountMatch: false,
    });

    if (!settled.ok) {
      return res.status(200).json({
        ok: false,
        message: settled.message,
      });
    }

    return res.status(200).json({
      ok: true,
      idempotent: Boolean(settled.idempotent),
      payment: settled.payment,
    });
  } catch (error) {
    return next(error);
  }
});

router.use(requireAuth);

router.post("/prepare", async (req, res, next) => {
  try {
    const paymentAmount = Number(req.body?.paymentAmount ?? req.body?.amount);
    const requestedChargePoints = req.body?.chargePoints === undefined || req.body?.chargePoints === null
      ? undefined
      : Number(req.body?.chargePoints);

    if (!Number.isInteger(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ message: "결제 금액(paymentAmount)은 양의 정수여야 합니다." });
    }

    if (
      requestedChargePoints !== undefined
      && (!Number.isInteger(requestedChargePoints) || requestedChargePoints <= 0)
    ) {
      return res.status(400).json({ message: "충전 포인트(chargePoints)는 양의 정수여야 합니다." });
    }

    const chargedPoints = resolveChargePointsByAmount(paymentAmount, requestedChargePoints);
    const paymentMethod = normalizePaymentMethod(req.body?.paymentMethod);

    const rawProductName = String(req.body?.productName || `${chargedPoints.toLocaleString("ko-KR")} 포인트 충전`).trim();
    const productName = rawProductName.slice(0, 80) || `${chargedPoints.toLocaleString("ko-KR")} 포인트 충전`;

    const merchantUid = buildMerchantUid(req.auth.userId);

    await Payment.create({
      userId: req.auth.userId,
      merchantUid,
      paymentAmount,
      expectedChargedPoints: chargedPoints,
      chargedPoints: 0,
      paymentMethod,
      status: "pending",
      source: "prepare",
    });

    return res.status(201).json({
      message: "결제 준비가 완료되었습니다.",
      order: {
        merchantUid,
        paymentAmount,
        chargePoints: chargedPoints,
        productName,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/confirm", async (req, res, next) => {
  try {
    const hasMinimalRedirectPayload = Boolean(
      (req.body?.impUid || req.body?.paymentId)
      && (req.body?.merchantUid || req.body?.merchant_uid)
      && (req.body?.paymentAmount === undefined && req.body?.amount === undefined),
    );

    let isValid = false;
    let errors = [];
    let sanitized = null;

    if (hasMinimalRedirectPayload) {
      sanitized = {
        impUid: String(req.body?.impUid || req.body?.paymentId || "").trim(),
        merchantUid: String(req.body?.merchantUid || req.body?.merchant_uid || "").trim() || undefined,
        paymentAmount: undefined,
        chargePoints: undefined,
        paymentMethod: String(req.body?.paymentMethod || "").trim() || undefined,
      };
      isValid = Boolean(sanitized.impUid);
      if (!isValid) {
        errors = ["결제 고유 ID(impUid)가 필요합니다."];
      }
    } else {
      const validated = validatePointChargePayload(req.body);
      isValid = validated.isValid;
      errors = validated.errors;
      sanitized = validated.sanitized;
    }

    if (!isValid) {
      return res.status(400).json({
        message: "결제 요청 형식이 올바르지 않습니다.",
        errors,
      });
    }

    const settled = await settlePaymentByImpUid({
      impUid: sanitized.impUid,
      requestedUserId: req.auth.userId,
      requestedAmount: sanitized.paymentAmount,
      requestedChargePoints: sanitized.chargePoints,
      requestedPaymentMethod: sanitized.paymentMethod,
      merchantUidHint: sanitized.merchantUid,
      source: "confirm",
      strictAmountMatch: true,
    });

    if (!settled.ok) {
      return res.status(settled.status || 400).json({
        message: settled.message,
        ...(settled.clientAmount !== undefined ? { clientAmount: settled.clientAmount } : {}),
        ...(settled.portOneAmount !== undefined ? { portOneAmount: settled.portOneAmount } : {}),
        ...(settled.expectedAmount !== undefined ? { expectedAmount: settled.expectedAmount } : {}),
        ...(settled.portOneStatus ? { status: settled.portOneStatus } : {}),
      });
    }

    return res.status(200).json({
      message: settled.idempotent
        ? "이미 처리된 결제입니다."
        : "포인트 충전이 완료되었습니다.",
      idempotent: Boolean(settled.idempotent),
      user: settled.user,
      payment: settled.payment,
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "이미 등록된 주문번호 또는 결제 고유 ID입니다." });
    }

    return next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId)
      .select("name email points")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
    }

    const [recentPayments, pointHistories] = await Promise.all([
      Payment.find({ userId: req.auth.userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      PointHistory.find({ userId: req.auth.userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ]);

    return res.status(200).json({
      user: {
        id: String(req.auth.userId),
        name: user.name,
        email: user.email,
        points: Number(user.points || 0),
      },
      payments: recentPayments.map((payment) => formatPaymentResponse(payment)),
      pointHistories: pointHistories.map((entry) => ({
        id: String(entry._id),
        kind: entry.kind,
        delta: Number(entry.delta || 0),
        balanceAfter: Number(entry.balanceAfter || 0),
        reason: entry.reason,
        featureKey: entry.featureKey,
        createdAt: entry.createdAt,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
