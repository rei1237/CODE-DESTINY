import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type JwtPayloadLike = {
  role?: string;
};

function decodeJwtPayload(token: string): JwtPayloadLike | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payloadJson = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("fortune_auth_token")?.value;
  const roleFromCookie = cookieStore.get("fortune_auth_role")?.value;
  const roleFromToken = token ? decodeJwtPayload(token)?.role : undefined;
  const role = roleFromCookie || roleFromToken;

  if (!token || role !== "admin") {
    redirect("/login?next=%2Fadmin");
  }

  return <>{children}</>;
}
