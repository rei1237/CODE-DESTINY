const User = require("../models/User");

function requireSufficientPoints(costPoints, options = {}) {
  const points = Number(costPoints);
  if (!Number.isInteger(points) || points <= 0) {
    throw new Error("requireSufficientPoints에는 1 이상의 정수 포인트가 필요합니다.");
  }

  const message = options.message || "포인트가 부족합니다.";
  const rechargeUrl = options.rechargeUrl || "/points";

  return async function pointGate(req, res, next) {
    try {
      const user = await User.findById(req.auth.userId).select("points").lean();

      if (!user) {
        return res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
      }

      const currentPoints = Number(user.points || 0);

      if (currentPoints < points) {
        return res.status(402).json({
          message,
          requiredPoints: points,
          currentPoints,
          shortagePoints: points - currentPoints,
          rechargeUrl,
        });
      }

      req.pointGate = {
        requiredPoints: points,
        currentPoints,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  requireSufficientPoints,
};
