import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const KEEPALIVE_KEY = "system:kv:keepalive";
const KEEPALIVE_TTL_SECONDS = 60 * 60 * 24 * 30;

export async function GET(req: Request) {
  const authorization = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured." },
      { status: 500 }
    );
  }

  if (authorization !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = Date.now();
    await kv.set(KEEPALIVE_KEY, now, { ex: KEEPALIVE_TTL_SECONDS });
    const latest = await kv.get<number>(KEEPALIVE_KEY);

    return NextResponse.json({
      ok: true,
      key: KEEPALIVE_KEY,
      timestamp: latest ?? now,
    });
  } catch (error) {
    console.error("KV keepalive failed:", error);
    return NextResponse.json(
      { ok: false, error: "KV keepalive failed." },
      { status: 500 }
    );
  }
}
