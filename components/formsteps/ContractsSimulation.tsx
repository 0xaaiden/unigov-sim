import React from 'react'

import { ContractTag } from '@/components/contractselection/generateParamsUI'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/router'

import { stepProps } from '../../lib/types/stepProps'
import FormWrapper from '../FormWrapper'

export const ContractSimulation = ({ tags, setTags }: stepProps) => {
  return (
    <FormWrapper description="Simulate the execution of a function on a smart contract." title="Contracts Simulations">
      <div className="flex h-full flex-col gap-3 overflow-auto ">
        <ScrollArea className="w-full rounded-md border">
          <div className="w-full p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Function Calls <span className="text-muted-foreground">{tags.length} of 10</span>
            </h4>
            {tags.map((tag) => (
              <>
                <ContractTag key={tag.uuid} tag={tag} />
                <Separator className="my-2" />
              </>
            ))}
          </div>
        </ScrollArea>
        {/* Continue for other function arguments, values, etc. */}
      </div>
    </FormWrapper>
  )
}

export default ContractSimulation
