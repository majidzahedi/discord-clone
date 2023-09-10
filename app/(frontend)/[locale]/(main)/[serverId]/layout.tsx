import Sidebar from '@/components/sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <main className="relative flex h-full flex-1">
      <Sidebar />
      {children}
    </main>
  )
}

export default MainLayout
