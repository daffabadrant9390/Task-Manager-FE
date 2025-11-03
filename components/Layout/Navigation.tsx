import Link from "next/link"

export const Navigation = () => {
  return (
    <nav className="p-3 md:p-4">
      <div className="space-y-1 md:space-y-2">
        {/* TODO: Future improvement feature if needed */}
        {/* <Link
          href="#"
          className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-[#8C9CB8] hover:bg-[#2C333A] transition-colors"
        >
          <div className="w-5 h-5 bg-[#5E6C84] rounded shrink-0" />
          <span className="text-sm md:text-base">Dashboard</span>
        </Link> */}
        {/* TODO: Future improvement feature if needed */}
        {/* <Link
          href="#"
          className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-[#8C9CB8] hover:bg-[#2C333A] transition-colors"
        >
          <div className="w-5 h-5 bg-[#5E6C84] rounded shrink-0" />
          <span className="text-sm md:text-base">Projects</span>
        </Link> */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-[#0052CC] text-white font-medium transition-colors hover:bg-[#0065FF] cursor-pointer"
        >
          <div className="w-5 h-5 bg-white rounded shrink-0" />
          <span className="text-sm md:text-base">Boards</span>
        </Link>
        {/* TODO: Future improvement feature if needed */}
        {/* <Link
          href="#"
          className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-[#8C9CB8] hover:bg-[#2C333A] transition-colors"
        >
          <div className="w-5 h-5 bg-[#5E6C84] rounded shrink-0" />
          <span className="text-sm md:text-base">Calendar</span>
        </Link> */}
      </div>
    </nav>
  )
}