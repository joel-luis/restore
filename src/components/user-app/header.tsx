'use client'

import { UserNav } from '@/components/common/user-nav'

export function UserAppHeader() {
  return (
    <header>
      <nav className="flex justify-between items-center m-4">
        <span className="font-extrabold">
          res<span className="font-extralight">Store</span>
        </span>
        <UserNav />
      </nav>
    </header>
  )
}
