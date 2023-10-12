import React from 'react'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { extractFunctionName } from '@/lib/extractFunctionName'
import { tag } from '@/lib/types/types'

import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function ContractTag({
  tag,
  removeTag,
  editTag,
  setTagOpen,
}: {
  tag: tag
  removeTag?: (key: string) => void
  editTag?: (key: string) => void
  setTagOpen?: (open: boolean) => void
}): JSX.Element {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex !w-4/5 items-center gap-2 overflow-hidden">
        <Popover>
          <PopoverTrigger>
            <Badge className="w-3/10 text-ellipsis rounded-lg bg-orange-200 px-2 py-1 text-xs text-secondary-foreground" variant="secondary">
              <span className="font-mono text-xs font-light">{extractFunctionName(tag.value)}</span>
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Parameters</h4>
                <p className="text-sm text-muted-foreground">These are the parameters that will be passed to the function call.</p>
              </div>
              <div className="grid gap-2">
                {tag.params.map((param) => (
                  <div key={param.name} className="grid grid-cols-3 items-center gap-4">
                    <Label className="overflow-hidden text-ellipsis" htmlFor={param.name}>{`${param.name}`}</Label>
                    <Input disabled className="col-span-2 h-8" defaultValue={param.value} id={param.name} />
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Link className="overflow-hidden text-ellipsis font-mono text-xs font-light" href={`https://etherscan.io/address/${tag.address}`}>
          {tag.address}
        </Link>
      </div>
      <div className="flex !w-1/5 justify-end">{removeTag && <>{ShowMenu({ tag, removeTag, setTagOpen, editTag })}</>}</div>{' '}
    </div>
  )
}
function ShowMenu({ tag, removeTag, setTagOpen, editTag }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="sm" variant="ghost">
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => {
              removeTag(tag.uuid)
            }}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
          {/* add edit */}
          <DropdownMenuItem
            onClick={() => {
              editTag(tag.uuid)
              setTagOpen(true)
            }}>
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
