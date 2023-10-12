import React, { ReactNode } from 'react'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function popOverFns(
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  values: string[]
): ReactNode {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className=" justify-between" role="combobox" variant="outline">
          {value
            ? values.find((framework) => {
                return framework == value
              })
            : 'Select a function...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="!w-full p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search functions..." />
          <CommandEmpty>No functions found.</CommandEmpty>
          <CommandGroup>
            {values.map((framework) => (
              <CommandItem
                key={framework}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  setOpen(false)
                }}>
                {framework}
                <CheckIcon className={cn('ml-auto h-4 w-4', value === framework ? 'opacity-100' : 'opacity-0')} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
