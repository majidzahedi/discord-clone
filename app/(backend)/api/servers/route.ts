import { NextRequest, NextResponse } from 'next/server'

const createServer = async (req: NextRequest) => {
  const body = await req.json()

  console.log(body)
  return new NextResponse('hello')
}

export { createServer as POST }
