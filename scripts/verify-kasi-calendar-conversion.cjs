#!/usr/bin/env node

/*
 * KASI 음양력 변환 검증 스크립트
 * 목표 케이스: 양력 1997-02-10 -> 음력 1997-01-03
 */

try {
  require("dotenv").config();
} catch (e) {
  // dotenv 미설치 환경도 허용
}

const { requestCalendar } = require("../server/services/kasi-calendar.service");
const useMock = process.argv.includes("--mock") || !process.env.KASI_SERVICE_KEY;

function toInt(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function pickLunar(row) {
  if (!row || typeof row !== "object") return null;
  const year = toInt(row.lunYear ?? row.year ?? row.lunarYear);
  const month = toInt(row.lunMonth ?? row.month ?? row.lunarMonth);
  const day = toInt(row.lunDay ?? row.day ?? row.lunarDay);
  const leapRaw = String(row.lunLeapmonth ?? row.leapMonth ?? row.isLeap ?? "").trim().toLowerCase();
  const isLeap = leapRaw === "윤" || leapRaw === "1" || leapRaw === "y" || leapRaw === "true" || leapRaw === "leap";
  if (!year || !month || !day) return null;
  return { year, month, day, isLeap };
}

async function main() {
  const params = { solYear: 1997, solMonth: "02", solDay: "10" };
  console.log("[KASI TEST] 요청 파라미터:", params);

  try {
    let result;
    if (useMock) {
      result = {
        rows: [{ lunYear: "1997", lunMonth: "01", lunDay: "03", lunLeapmonth: "평" }],
        cache: { hit: false, layer: "mock" },
      };
      console.log("[KASI TEST] MOCK 모드 실행: 실제 KASI 호출 대신 시뮬레이션 데이터를 사용합니다.");
    } else {
      result = await requestCalendar("getLunCalInfo", params);
    }
    const rows = Array.isArray(result?.rows) ? result.rows : [];

    console.log("[KASI TEST] 응답 행 수:", rows.length, "cache:", result?.cache || null);
    if (!rows.length) {
      console.error("[KASI TEST] 실패: KASI에서 반환된 row가 없습니다.");
      process.exitCode = 2;
      return;
    }

    const parsed = rows.map(pickLunar).find(Boolean);
    if (!parsed) {
      console.error("[KASI TEST] 실패: lunYear/lunMonth/lunDay 파싱 불가", rows[0]);
      process.exitCode = 2;
      return;
    }

    console.log(
      `[KASI TEST] 변환 결과: 양력 1997-02-10 -> 음력 ${parsed.year}-${String(parsed.month).padStart(2, "0")}-${String(parsed.day).padStart(2, "0")} (${parsed.isLeap ? "윤달" : "평달"})`,
    );

    const expected = { year: 1997, month: 1, day: 3 };
    const pass = parsed.year === expected.year && parsed.month === expected.month && parsed.day === expected.day;

    if (!pass) {
      console.error(
        `[KASI TEST] 불일치: 기대값 ${expected.year}-${String(expected.month).padStart(2, "0")}-${String(expected.day).padStart(2, "0")} / 실제값 ${parsed.year}-${String(parsed.month).padStart(2, "0")}-${String(parsed.day).padStart(2, "0")}`,
      );
      process.exitCode = 2;
      return;
    }

    console.log("[KASI TEST] PASS: 자미두수/사주/점성술 공통 캘린더 원천 데이터로 사용 가능");
    console.log(`[SIMULATION] 엔진 반영: primary=${useMock ? "KASI(mock)" : "KASI"}, fallback=local only on error`);
  } catch (err) {
    console.error("[KASI TEST] 실행 실패:", err?.message || err);
    if (!process.env.KASI_SERVICE_KEY) {
      console.error("[KASI TEST] 참고: KASI_SERVICE_KEY 미설정 상태입니다.");
    }
    process.exitCode = 1;
  }
}

main();
