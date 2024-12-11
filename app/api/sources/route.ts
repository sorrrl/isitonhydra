import { NextResponse } from 'next/server';
import { jsonSources } from '@/app/config/sources';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceName = searchParams.get('source');

  try {
    const source = jsonSources.find(s => s.name === sourceName);
    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    const response = await fetch(source.url, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching source ${sourceName}:`, error);
    return NextResponse.json({ downloads: [] });
  }
} 