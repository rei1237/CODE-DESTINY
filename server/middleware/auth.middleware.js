const jwt = require("jsonwebtoken");

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 필요합니다." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.auth = {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않거나 만료된 토큰입니다." });
  }
}

function requireAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== "admin") {
    return res.status(403).json({ message: "관리자 권한이 필요합니다." });
  }
  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
