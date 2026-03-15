# API 서버 (타로 엔진 포함)

## MongoDB Atlas 연동

1. `server/.env` 파일에서 `MONGO_URI`의 **`<db_password>`** 를 MongoDB Atlas 실제 비밀번호로 교체하세요.

   ```
   MONGO_URI=mongodb+srv://Neo:여기에실제비밀번호@neo.crlavp6.mongodb.net/?retryWrites=true&w=majority&appName=Neo
   ```

2. 비밀번호에 `@`, `#`, `%` 등 특수문자가 있으면 [URL 인코딩](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)이 필요합니다.

3. MongoDB Atlas에서 Network Access에 `0.0.0.0/0` (모든 IP) 또는 개발 PC IP가 허용되어 있는지 확인하세요.

## 실행 방법

프로젝트 루트에서:

```bash
# 터미널 1: API 서버 (포트 4000)
npm run api

# 터미널 2: Next.js 프론트엔드 (포트 3000)
npm run dev
```

브라우저에서 http://localhost:3000 접속 후 타로 기능을 사용하세요.
