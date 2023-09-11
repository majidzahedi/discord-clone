import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'
import {db} from '@/lib/db'
import cuid from 'cuid'
import { getServerSession } from 'next-auth'


const requestBody = z.object({
  name: z.string({required_error:"name is required"}),
  imageUrl: z.string({required_error:'imageUrl is required'})
})


// TODO: Refactor to have a better errors, check the hole function again
const createServer = async (req: NextRequest) => {
  try {
    const body = requestBody.parse(await req.json()) 
    const session = await getServerSession()

    if(!session){
    return new NextResponse(`Unautorized`, { status: 400 })
    }

    console.log(session)
    const user = await db.profile.findFirst({
      where:{
        email: session.user.email
      }
    })

    if(!user?.userId){
    return new NextResponse(`no user found`, { status: 400 })
    }
    
    
    const newServer = await db.server.create({
      data:{
        name:body.name,
        imageUrl: body.imageUrl,
        inviteCode: cuid(),
        profile:{
          connect:{
            userId: user?.userId
          }
        }
      }
    })
    
    return new NextResponse(newServer)
  } catch (error) {
    return new NextResponse(`CREATE_SERVER: ${error} `, { status: 500 })
  }
}

export { createServer as POST }
