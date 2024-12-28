import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('API Route received request:', body)

    const response = await fetch('https://hydra-api-us-east-1.losbroxas.org/catalogue/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        title: body.title,
        take: body.take || 20,
        skip: body.skip || 0
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Raw API Response:', JSON.stringify(data, null, 2))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in hydra search:', error)
    return NextResponse.json({ 
      count: 0, 
      edges: [],
      error: 'Failed to fetch data' 
    }, { status: 500 })
  }
} 