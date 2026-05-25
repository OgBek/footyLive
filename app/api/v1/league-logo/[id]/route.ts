import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400; // Cache for 24 hours

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'https://api.watchfooty.st';
    const response = await fetch(`${apiBase}/api/v1/league-logo/${id}`, {
      next: { revalidate: 86400 } // cache for 24 hours
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch league logo from source API' },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('Content-Type') || 'image/png';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
