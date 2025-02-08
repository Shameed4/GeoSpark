'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import { Bell, ClipboardList, House, LayoutGrid, Map } from 'lucide-react'
import Link from 'next/link'

const links = [
  { Icon: House, name: "Home", link: "/" },
  { Icon: Map, name: "Map", link: "/map" },
  { Icon: ClipboardList, name: "Generate Report", link: "/report/upload" },
  { Icon: LayoutGrid, name: "Other", link: "/other" },
  { Icon: Bell, name: "Notifications", link: "/notifications" }
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <div className="w-64 flex-shrink-0 text-neutral-500">
      <div className='text-sm mb-3'>NAVIGATION</div>
      <div className="flex flex-col gap-2 text-md">
        {links.map(({ Icon, name, link }) => (
          <Link href={link} key={name}>
            <div
              className={`
                flex p-3 rounded-sm transition-colors duration-300 ease-in-out
                ${link === pathname 
                  ? "bg-gradient-to-r from-white to-#ce4b0c text-black" 
                  : "hover:text-neutral-200"}
              `}
            >
              <Icon className='mr-2' />
              {name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}