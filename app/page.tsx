import UserAvatar from '@/components/user-avatar'

export default function Home() {
  return (
    <main className="flex h-full items-center justify-center bg-purple-200">
      <div className="fixed right-10 top-10">
        <UserAvatar />
      </div>
    </main>
  )
}
