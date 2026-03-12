const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI 환경변수가 필요합니다.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || undefined,
  });

  console.log("[DB] connected");
}

module.exports = connectDB;
