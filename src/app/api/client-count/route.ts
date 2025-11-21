import { NextResponse } from "next/server";
import { fetchClientCounts } from "@/lib/api/client-count";
import { DEFAULT_SESSION, type Session } from "@/lib/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const sessionParam = searchParams.get("session");
  const limitParam = searchParams.get("limit");

  if (!location) {
    return NextResponse.json(
      {
        status: "error",
        message: "Parameter 'location' wajib disertakan.",
      },
      { status: 400 }
    );
  }

  const session: Session =
    sessionParam === "siang" || sessionParam === "pagi"
      ? (sessionParam as Session)
      : DEFAULT_SESSION;

  try {
    const [result] = await fetchClientCounts({
      locations: [location],
      session,
    });

    if (!result) {
      return NextResponse.json(
        { status: "error", message: "Data tidak ditemukan." },
        { status: 404 }
      );
    }

    const payload = (result.payload ?? {}) as { data?: unknown; clientCount?: unknown };
    const payloadData =
      (payload?.data as { clientCount?: unknown }) ?? payload;

    let clientCount = Array.isArray(payloadData?.clientCount)
      ? payloadData.clientCount
      : Array.isArray(payloadData)
        ? payloadData
        : [];

    if (limitParam && limitParam !== "all") {
      const limitValue = Number(limitParam);
      if (!Number.isNaN(limitValue) && limitValue > 0) {
        clientCount = clientCount.slice(-limitValue);
      }
    }

    return NextResponse.json({
      status: "success",
      data: {
        location: result.location,
        session: result.session,
        clientCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Terjadi kesalahan tak terduga.",
      },
      { status: 502 }
    );
  }
}


