import { DestinyProfile } from "./types";

const PROFILE_NAMESPACE = "FORTUNE_APP_USER_PROFILES";
const PROFILE_LIST_KEY = `${PROFILE_NAMESPACE}.list`;
const PROFILE_CURRENT_KEY = `${PROFILE_NAMESPACE}.current`;

type AnyProfile = Record<string, unknown>;

function toFiniteNumber(value: unknown): number | undefined {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toSafeString(value: unknown, fallback = ""): string {
  const text = String(value ?? fallback).trim();
  return text || fallback;
}

function normalizeProfile(raw: unknown): DestinyProfile | null {
  if (!raw || typeof raw !== "object") return null;

  const source = raw as AnyProfile;
  const birth = source.birth as AnyProfile | undefined;
  if (!birth) return null;

  const year = toFiniteNumber(birth.year);
  const month = toFiniteNumber(birth.month);
  const day = toFiniteNumber(birth.day);

  if (!year || !month || !day) return null;

  const hour = toFiniteNumber(birth.hour);
  const minute = toFiniteNumber(birth.minute);
  const location = (source.location as AnyProfile | undefined) || {};

  return {
    id: toSafeString(source.id, "profile"),
    name: toSafeString(source.name, "사용자"),
    gender: toSafeString(source.gender, "F"),
    birth: {
      year,
      month,
      day,
      hour: hour ?? null,
      minute: minute ?? null,
      calType: toSafeString(birth.calType, "solar"),
    },
    location: {
      label: toSafeString(location.label, "출생지 미입력"),
      tz: toSafeString(location.tz, "Asia/Seoul"),
      lng: toFiniteNumber(location.lng),
      lat: toFiniteNumber(location.lat),
      tzOffset: toFiniteNumber(location.tzOffset),
      baseTzOffset: toFiniteNumber(location.baseTzOffset),
      dstMinutes: toFiniteNumber(location.dstMinutes),
    },
  };
}

function readProfileFromManager(): DestinyProfile | null {
  try {
    const manager = (window as Window & {
      DestinyProfileManager?: { storage?: { current?: () => unknown } };
    }).DestinyProfileManager;

    const current = manager?.storage?.current?.();
    return normalizeProfile(current);
  } catch {
    return null;
  }
}

function readProfileFromLocalStorage(): DestinyProfile | null {
  try {
    const currentId = localStorage.getItem(PROFILE_CURRENT_KEY);
    if (!currentId) return null;

    const listRaw = localStorage.getItem(PROFILE_LIST_KEY);
    const list = listRaw ? (JSON.parse(listRaw) as unknown[]) : [];
    const matched = list.find((item) => {
      if (!item || typeof item !== "object") return false;
      return String((item as AnyProfile).id || "") === currentId;
    });

    return normalizeProfile(matched);
  } catch {
    return null;
  }
}

export function getCurrentDestinyProfile(): DestinyProfile | null {
  if (typeof window === "undefined") return null;
  return readProfileFromManager() || readProfileFromLocalStorage();
}

export function subscribeDestinyProfileChange(
  callback: (profile: DestinyProfile | null) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleProfileSignal = () => callback(getCurrentDestinyProfile());

  document.addEventListener("destinyProfileChanged", handleProfileSignal as EventListener);
  window.addEventListener("storage", handleProfileSignal);

  return () => {
    document.removeEventListener("destinyProfileChanged", handleProfileSignal as EventListener);
    window.removeEventListener("storage", handleProfileSignal);
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
