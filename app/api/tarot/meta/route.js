import { NextResponse } from "next/server";

const { getEngineMeta } = require("../../../../server/services/tarot-engine.service");

export async function GET() {
  try {
    const engine = getEngineMeta();
    return NextResponse.json({ ok: true, engine });
  } catch (error) {
    console.error("[tarot/meta]", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
