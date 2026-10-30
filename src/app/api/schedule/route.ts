import { NextRequest, NextResponse } from "next/server";
import { getSchedule } from "@/lib/anilist";

export const revalidate = 600;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const start = Number(sp.get("start"));
  const end = Number(sp.get("end"));

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || end - start > 90_000) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  try {
    // Round to the minute so near-identical requests share one cache entry.
    const entries = await getSchedule(Math.floor(start / 60) * 60, Math.floor(end / 60) * 60);
    return NextResponse.json(
      { entries },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" } },
    );
  } catch {
    return NextResponse.json({ error: "Failed to load schedule" }, { status: 502 });
  }
}
