import { NextRequest, NextResponse } from "next/server";
import { getList, SORTS } from "@/lib/anilist";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const tab = SORTS[sp.get("tab") ?? "newest"] ?? SORTS.newest;
  const page = Math.min(Math.max(Number(sp.get("page")) || 1, 1), 50);

  try {
    const data = await getList({ sort: tab.sort, status: tab.status, page, perPage: 18 });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load anime" }, { status: 502 });
  }
}
