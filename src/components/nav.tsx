'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import { ClipboardList, House, Sparkles, Map } from 'lucide-react'
import Link from 'next/link'

const links = [
  { Icon: House, name: "Home", link: "/" },
  { Icon: Map, name: "Map", link: "/map" },
  { Icon: ClipboardList, name: "Generate Report", link: "/report/upload" },
  { Icon: Sparkles, name: "Ask AI", link: "/askai" },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <div className="w-64 flex-shrink-0 text-neutral-500 z-[15]">
      <div className='text-sm mb-3'>NAVIGATION</div>
      <div className="flex flex-col gap-2 text-md">
        {links.map(({ Icon, name, link }) => (
          <Link href={link} key={name}>
            {link === pathname ? (<div
              className="relative flex p-3 rounded-sm transition-colors duration-300 ease-in-out bg-gradient-to-r from-white to-#ce4b0c text-black"
            >
              <div className='absolute h-full w-full left-0 top-0 bg-[#0E1018] animate-grow-width'></div>
              <Icon className='z-20 mr-2' />
              <div className='z-20'>{name}</div>
            </div>) : (<div className="flex p-3 rounded-sm transition-colors duration-300 ease-in-out hover:text-neutral-200">
              <Icon className='mr-2' />
              {name}
            </div>)}
          </Link>
        ))}
      </div>
    </div>
  )
}