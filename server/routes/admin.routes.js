const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth, requireAdmin);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get("/users", async (req, res, next) => {
  try {
    const rawSearch = String(req.query.search || "").trim();
    const filter = rawSearch
      ? {
        $or: [
          { name: { $regex: escapeRegex(rawSearch), $options: "i" } },
          { email: { $regex: escapeRegex(rawSearch), $options: "i" } },
        ],
      }
      : {};

    const [totalCount, users] = await Promise.all([
      User.countDocuments({}),
      User.find(filter, { passwordHash: 0, __v: 0 })
        .sort({ joinedAt: -1, createdAt: -1 })
        .lean(),
    ]);

    return res.status(200).json({
      totalCount,
      count: users.length,
      search: rawSearch,
      users,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/users/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "유효하지 않은 사용자 ID입니다." });
    }

    if (String(req.auth.userId) === String(userId)) {
      return res.status(400).json({ message: "본인 계정은 관리자 API로 삭제할 수 없습니다." });
    }

    const deleted = await User.findByIdAndDelete(userId).lean();

    if (!deleted) {
      return res.status(404).json({ message: "삭제할 사용자를 찾지 못했습니다." });
    }

    return res.status(200).json({
      message: "사용자를 삭제했습니다.",
      userId,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
