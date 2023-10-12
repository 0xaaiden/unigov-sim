'use client'
import { forwardRef } from 'react'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export const DatePicker = forwardRef<
  HTMLDivElement,
  {
    date?: Date
    setDate: (date?: Date) => void
  }
>(function DatePickerCmp({ date, setDate }, ref) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')} variant={'outline'}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent ref={ref} className="w-auto p-0">
        <Calendar initialFocus mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
})
