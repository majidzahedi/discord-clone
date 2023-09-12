import NavigationSideBar from '@/components/navigation/navigations-sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-30 hidden h-full w-[77px] flex-col md:flex">
        <NavigationSideBar />
      </div>
      <main className="h-full md:pl-[72px]">{children}</main>
    </div>
  )
}

export default MainLayout
