const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI 환경변수가 필요합니다. server/.env 파일을 확인하세요.");
  }

  if (mongoUri.includes("<db_password>")) {
    throw new Error(
      "MONGO_URI의 <db_password>를 MongoDB Atlas 실제 비밀번호로 교체하세요. " +
      "비밀번호에 @, #, % 등 특수문자가 있으면 URL 인코딩(encodeURIComponent)이 필요합니다."
    );
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || undefined,
  });

  console.log("[DB] MongoDB 연결됨");
}

module.exports = connectDB;
