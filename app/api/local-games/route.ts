import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json([]) // Return empty array since we're not using local games anymore
  } catch (error) {
    console.error('Error fetching local games:', error)
    return NextResponse.json({ error: 'Failed to fetch local games' }, { status: 500 })
  }
} 