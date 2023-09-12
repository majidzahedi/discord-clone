import NavigationSideBar from '@/components/navigation/navigation-sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex">
        <NavigationSideBar />
      </div>
      <main className="h-full ltr:md:pl-[72px] rtl:md:pr-[72px]">{children}</main>
    </div>
  )
}

export default MainLayout
