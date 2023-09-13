import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/dist/server/api-utils'

interface InviteCodePage{
  params:{
    inviteCode: string
  }
}



async function InviteCodePage({params}:InviteCodePage) {

  const profile = currentProfile()

  if(!profile){
    return redirect('/login')
  }
  
  const server = db.server.findFirst({
    where:{
      inviteCode:
    }
  })

  return redirect()
}

export default InviteCodePage
