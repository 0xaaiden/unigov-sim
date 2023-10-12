'use client'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'

export function Menu() {
  return (
    <Menubar className="!border-b-1 rounded-none border-x-0 border-t-0  px-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">UniGov</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <a href="https://unigov.live">About UniGov</a>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <a href="https://github.com/0xaaiden/unigov-sim">Github</a>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <a href="https://unigov.live">Quit Unigov</a>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative">Proposals</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <a href="https://app.uniswap.org/vote">All Proposals</a>
          </MenubarItem>
          <MenubarItem>
            <a href="https://app.uniswap.org/vote/create-proposal">New Proposal</a>
          </MenubarItem>
          <MenubarItem>
            <a href="https://snapshot.org/#/uniswap">Vote on Proposals</a>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Governance</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <a href="https://gov.uniswap.org">Uniswap Governance</a>
          </MenubarItem>
          <MenubarItem>
            <a href="https://snapshot.org/#/uniswap">Snapshot</a>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
