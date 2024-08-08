import LiveBlocks_Provider from "@/components/liveblocks-provider"

const PageLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <LiveBlocks_Provider>
        {children}
    </LiveBlocks_Provider>
  )
}
export default PageLayout