'use client'

import * as React from 'react'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { ScrollArea } from '../ui/scroll-area'

type Framework = {
  value: string
  label: string
}

export function ComboboxDemo({
  frameworks,
  setValue,
  value,
}: {
  frameworks: Framework[]
  setValue: (value: string) => void
  value: string
}): JSX.Element {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="justify-between whitespace-nowrap " role="combobox" variant="outline">
          <div
            className=" truncate
            ">
            {value
              ? frameworks.find((framework) => {
                  return framework.value == value
                })?.label
              : 'Select a function...'}
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="!w-full p-0 ">
        <Command className="">
          <CommandInput className="h-9" placeholder="Search functions..." />
          <CommandEmpty>No functions found.</CommandEmpty>
          <CommandGroup className="">
            <ScrollArea className="flex max-h-[200px] max-w-md flex-col" type="always">
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  onSelect={(currentValue) => {
                    // search for current value

                    setValue(framework.value === value ? '' : framework.value)
                    setOpen(false)
                  }}>
                  {framework.label}
                  <CheckIcon className={cn('ml-auto h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
