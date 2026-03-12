const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./config/db");

const port = Number(process.env.API_PORT || process.env.PORT || 4000);

async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`[API] listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("[API] failed to start:", error.message);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) => {
  console.error("[API] unhandledRejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[API] uncaughtException:", error);
  process.exit(1);
});

startServer();
