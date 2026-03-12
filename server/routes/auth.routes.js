const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { validateRegisterPayload, validateLoginPayload } = require("../utils/validation");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "dev-secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      issuer: "code-destiny-api",
    },
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const { isValid, errors, sanitized } = validateRegisterPayload(req.body);

    if (!isValid) {
      return res.status(400).json({
        message: "입력값 유효성 검증에 실패했습니다.",
        errors,
      });
    }

    const existing = await User.findOne({ email: sanitized.email }).lean();
    if (existing) {
      return res.status(409).json({ message: "이미 가입된 이메일입니다." });
    }

    const passwordHash = await bcrypt.hash(sanitized.password, 12);

    const created = await User.create({
      name: sanitized.name,
      email: sanitized.email,
      passwordHash,
      birthDate: sanitized.birthDate,
      birthTime: sanitized.birthTime,
      gender: sanitized.gender,
      role: "user",
      joinedAt: new Date(),
    });

    const token = signToken(created);

    return res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      token,
      user: {
        id: String(created._id),
        name: created.name,
        email: created.email,
        birthDate: created.birthDate,
        birthTime: created.birthTime,
        gender: created.gender,
        role: created.role,
        points: created.points,
        joinedAt: created.joinedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { isValid, errors, sanitized } = validateLoginPayload(req.body);

    if (!isValid) {
      return res.status(400).json({
        message: "입력값 유효성 검증에 실패했습니다.",
        errors,
      });
    }

    const user = await User.findOne({ email: sanitized.email })
      .select("+passwordHash")
      .lean();

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const isPasswordValid = await bcrypt.compare(sanitized.password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const token = signToken(user);

    return res.status(200).json({
      message: "로그인에 성공했습니다.",
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        gender: user.gender,
        role: user.role,
        points: user.points,
        joinedAt: user.joinedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
