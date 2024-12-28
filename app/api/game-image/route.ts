import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 })
  }

  try {
    const imageUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.jpg`
    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error('Error fetching game image:', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
} 