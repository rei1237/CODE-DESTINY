import { DestinyProfile } from "./types";

const PROFILE_NAMESPACE = "FORTUNE_APP_USER_PROFILES";
const PROFILE_LIST_KEY = `${PROFILE_NAMESPACE}.list`;
const PROFILE_CURRENT_KEY = `${PROFILE_NAMESPACE}.current`;

type AnyProfile = Record<string, unknown>;

interface DestinyProfileChangedDetail {
  profile?: unknown;
}

function toFiniteNumber(value: unknown): number | undefined {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toSafeString(value: unknown, fallback = ""): string {
  const text = String(value ?? fallback).trim();
  return text || fallback;
}

function pickFirstFinite(...values: unknown[]): number | undefined {
  for (const value of values) {
    const parsed = toFiniteNumber(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function parseBirthDateParts(rawDate: unknown): { year: number; month: number; day: number } | null {
  const text = String(rawDate ?? "").trim();
  if (!text) return null;

  const match = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  return { year, month, day };
}

function parseBirthTimeParts(rawTime: unknown): { hour: number; minute: number } | null {
  const text = String(rawTime ?? "").trim();
  if (!text) return null;

  const match = text.match(/^(\d{1,2}):(\d{1,2})$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return { hour, minute };
}

function normalizeProfile(raw: unknown): DestinyProfile | null {
  if (!raw || typeof raw !== "object") return null;

  const source = raw as AnyProfile;
  const birth = (source.birth as AnyProfile | undefined) || {};
  const parsedBirthDate = parseBirthDateParts(source.birthDate ?? birth.date);
  const parsedBirthTime = parseBirthTimeParts(source.birthTime ?? birth.time);

  const year = pickFirstFinite(birth.year, source.birthYear, parsedBirthDate?.year);
  const month = pickFirstFinite(birth.month, source.birthMonth, parsedBirthDate?.month);
  const day = pickFirstFinite(birth.day, source.birthDay, parsedBirthDate?.day);

  if (!year || !month || !day) return null;

  const hour = pickFirstFinite(birth.hour, source.birthHour, parsedBirthTime?.hour);
  const minute = pickFirstFinite(birth.minute, source.birthMinute, parsedBirthTime?.minute);
  const location = (source.location as AnyProfile | undefined) || {};

  return {
    id: toSafeString(source.id, "profile"),
    name: toSafeString(source.name ?? source.profileName, "사용자"),
    gender: toSafeString(source.gender ?? source.sex, "F"),
    birth: {
      year,
      month,
      day,
      hour: hour ?? null,
      minute: minute ?? null,
      calType: toSafeString(birth.calType ?? source.calType, "solar"),
    },
    location: {
      label: toSafeString(location.label ?? source.locationLabel, "출생지 미입력"),
      tz: toSafeString(location.tz ?? source.tz, "Asia/Seoul"),
      lng: pickFirstFinite(location.lng, source.lng),
      lat: pickFirstFinite(location.lat, source.lat),
      tzOffset: pickFirstFinite(location.tzOffset, source.tzOffset),
      baseTzOffset: pickFirstFinite(location.baseTzOffset, source.baseTzOffset),
      dstMinutes: pickFirstFinite(location.dstMinutes, source.dstMinutes),
    },
  };
}

function readProfileFromUserProfileStorage(): DestinyProfile | null {
  try {
    const rawUserProfile = localStorage.getItem("user_profile");
    if (rawUserProfile) {
      const parsed = JSON.parse(rawUserProfile) as unknown;
      const candidates: unknown[] = [
        parsed,
        (parsed as AnyProfile | undefined)?.profile,
        (parsed as AnyProfile | undefined)?.user,
        (parsed as AnyProfile | undefined)?.user_profile,
      ];

      for (const candidate of candidates) {
        const normalized = normalizeProfile(candidate);
        if (normalized) return normalized;
      }
    }

    const rawAuthUser = localStorage.getItem("fortune_auth_user");
    if (rawAuthUser) {
      const parsedAuthUser = JSON.parse(rawAuthUser) as unknown;
      const normalizedAuthUser = normalizeProfile(parsedAuthUser);
      if (normalizedAuthUser) return normalizedAuthUser;
    }

    return null;
  } catch {
    return null;
  }
}

function readProfileFromManager(): DestinyProfile | null {
  try {
    const manager = (window as Window & {
      DestinyProfileManager?: { storage?: { current?: () => unknown; list?: () => unknown } };
    }).DestinyProfileManager;

    const current = manager?.storage?.current?.();
    const normalizedCurrent = normalizeProfile(current);
    if (normalizedCurrent) return normalizedCurrent;

    const list = manager?.storage?.list?.();
    if (Array.isArray(list) && list.length > 0) {
      return normalizeProfile(list[list.length - 1]);
    }

    return null;
  } catch {
    return null;
  }
}

function readProfileFromLocalStorage(): DestinyProfile | null {
  try {
    const currentId = localStorage.getItem(PROFILE_CURRENT_KEY);
    const listRaw = localStorage.getItem(PROFILE_LIST_KEY);
    const list = listRaw ? (JSON.parse(listRaw) as unknown[]) : [];
    if (!Array.isArray(list) || list.length === 0) return null;

    const matched = list.find((item) => {
      if (!item || typeof item !== "object") return false;
      return String((item as AnyProfile).id || "") === currentId;
    });

    // current 포인터가 비어 있거나 깨졌으면 최신 프로필로 폴백
    return normalizeProfile(matched ?? list[list.length - 1]);
  } catch {
    return null;
  }
}

export function getCurrentDestinyProfile(): DestinyProfile | null {
  if (typeof window === "undefined") return null;
  return readProfileFromUserProfileStorage() || readProfileFromManager() || readProfileFromLocalStorage();
}

export function subscribeDestinyProfileChange(
  callback: (profile: DestinyProfile | null) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleProfileSignal = (event?: Event) => {
    const custom = event as CustomEvent<DestinyProfileChangedDetail> | undefined;
    const fromEvent = normalizeProfile(custom?.detail?.profile);
    if (fromEvent) {
      callback(fromEvent);
      return;
    }
    callback(getCurrentDestinyProfile());
  };

  document.addEventListener("destinyProfileChanged", handleProfileSignal as EventListener);
  window.addEventListener("storage", handleProfileSignal);
  document.addEventListener("visibilitychange", handleProfileSignal as EventListener);

  return () => {
    document.removeEventListener("destinyProfileChanged", handleProfileSignal as EventListener);
    window.removeEventListener("storage", handleProfileSignal);
    document.removeEventListener("visibilitychange", handleProfileSignal as EventListener);
  };
}

export function formatProfileBirth(profile: DestinyProfile): string {
  const birth = profile.birth;
  const date = `${birth.year}년 ${birth.month}월 ${birth.day}일`;

  if (typeof birth.hour !== "number" || typeof birth.minute !== "number") {
    return `${date} · 평시(12:00 기준)`;
  }

  const hh = String(birth.hour).padStart(2, "0");
  const mm = String(birth.minute).padStart(2, "0");
  return `${date} · ${hh}:${mm}`;
}
