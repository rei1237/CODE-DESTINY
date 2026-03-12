const DEFAULT_PORTONE_BASE_URL = "https://api.iamport.kr";

function getPortOneBaseUrl() {
  return String(process.env.PORTONE_API_BASE_URL || DEFAULT_PORTONE_BASE_URL).replace(/\/+$/, "");
}

async function requestJson(url, options, errorPrefix) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const remoteMessage = payload?.message || payload?.code || response.statusText;
    throw new Error(`${errorPrefix}: ${remoteMessage}`);
  }

  return payload;
}

async function getPortOneAccessToken() {
  const apiKey = process.env.PORTONE_API_KEY;
  const apiSecret = process.env.PORTONE_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("PORTONE_API_KEY 및 PORTONE_API_SECRET 환경변수가 필요합니다.");
  }

  const baseUrl = getPortOneBaseUrl();
  const payload = await requestJson(
    `${baseUrl}/users/getToken`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imp_key: apiKey,
        imp_secret: apiSecret,
      }),
    },
    "포트원 토큰 발급 실패",
  );

  const token = payload?.response?.access_token;
  if (!token) {
    throw new Error("포트원 토큰 응답에 access_token이 없습니다.");
  }

  return token;
}

async function fetchPortOnePayment(impUid) {
  if (!impUid) {
    throw new Error("impUid가 필요합니다.");
  }

  const token = await getPortOneAccessToken();
  const baseUrl = getPortOneBaseUrl();

  const payload = await requestJson(
    `${baseUrl}/payments/${encodeURIComponent(impUid)}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    },
    "포트원 결제 조회 실패",
  );

  const payment = payload?.response;
  if (!payment) {
    throw new Error("포트원 결제 응답이 비어있습니다.");
  }

  return payment;
}

module.exports = {
  fetchPortOnePayment,
};
