const path = require("path");
const http = require("http");

// Prefer dedicated KASI env file, then fallback to server/.env
try {
  require("dotenv").config({ path: path.resolve(__dirname, ".env.kasi") });
} catch (_) {}
try {
  require("dotenv").config({ path: path.resolve(__dirname, ".env") });
} catch (_) {}

const { requestCalendar, ALLOWED_METHODS } = require("./services/kasi-calendar.service");

const port = Number(process.env.KASI_VIRTUAL_PORT || 4100);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += String(chunk || "");
      if (raw.length > 1024 * 1024) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url || "/";

  if (req.method === "GET" && url === "/api/health") {
    return sendJson(res, 200, { ok: true, service: "kasi-virtual-server", port });
  }

  if (req.method === "GET" && url === "/api/kasi/methods") {
    return sendJson(res, 200, { ok: true, methods: ALLOWED_METHODS });
  }

  if (req.method === "POST" && url === "/api/kasi/calendar") {
    try {
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      const method = body.method;
      const params = body.params || {};
      const result = await requestCalendar(method, params);
      return sendJson(res, 200, {
        ok: true,
        method,
        rows: result.rows,
        cache: result.cache,
      });
    } catch (error) {
      const status = error && Number(error.status) >= 400 ? Number(error.status) : 503;
      return sendJson(res, status, {
        ok: false,
        message: (error && error.message) || "KASI request failed",
        detail: error && error.detail ? error.detail : null,
      });
    }
  }

  return sendJson(res, 404, { ok: false, message: "Not found" });
});

server.listen(port, () => {
  const hasKasi = !!String(process.env.KASI_SERVICE_KEY || "").trim();
  console.log("[KASI-VIRTUAL] listening on http://localhost:" + port);
  console.log("[KASI-VIRTUAL] KASI_SERVICE_KEY loaded: " + hasKasi);
});
