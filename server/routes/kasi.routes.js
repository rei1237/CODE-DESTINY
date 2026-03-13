const express = require("express");

const { requestCalendar, ALLOWED_METHODS } = require("../services/kasi-calendar.service");

const router = express.Router();

router.get("/methods", (req, res) => {
  res.status(200).json({ ok: true, methods: ALLOWED_METHODS });
});

router.post("/calendar", async (req, res) => {
  const method = req.body?.method;
  const params = req.body?.params || {};

  try {
    const result = await requestCalendar(method, params);
    return res.status(200).json({
      ok: true,
      method,
      rows: result.rows,
      cache: result.cache,
    });
  } catch (error) {
    const status = error?.status && Number(error.status) >= 400 ? Number(error.status) : 503;
    const isUpstreamIssue = status >= 500;
    const message = isUpstreamIssue
      ? "한국천문연 API 서버 점검 중입니다. 잠시 후 다시 시도해 주세요."
      : (error?.message || "KASI 요청 파라미터를 확인해 주세요.");

    console.error(
      `[KASI][Route] method=${String(method || "")}`,
      {
        status,
        message: error?.message || null,
        detail: error?.detail || null,
        resultCode: error?.resultCode || null,
      },
    );

    return res.status(status).json({
      ok: false,
      maintenance: isUpstreamIssue,
      fallbackRecommended: isUpstreamIssue,
      message,
      detail: error?.message || null,
    });
  }
});

module.exports = router;
