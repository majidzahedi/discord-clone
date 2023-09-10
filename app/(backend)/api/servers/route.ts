import { NextRequest, NextResponse } from 'next/server'

// TODO: complete createServer function
const createServer = async (req: NextRequest) => {
  try {
    const body = await req.json() 
    return new NextResponse(body)
  } catch (error) {
    return new NextResponse(`CREATE_SERVER: ${error} `, { status: 500 })
  }
}

export { createServer as POST }
