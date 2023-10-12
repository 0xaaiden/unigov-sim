import FormWrapper from '../FormWrapper'

import React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), { ssr: false })

export const ProposalStep = ({
  proposalText,
  updateProposal,
  proposalTitle,
  updateProposalTitle,
}: {
  proposalText: string
  updateProposal: (proposal: string) => void
  proposalTitle: string
  updateProposalTitle: (proposal: string) => void
}) => {
  return (
    <FormWrapper description="Add the details of your proposal" title="Proposal Details">
      <div className="flex h-full flex-col gap-3 overflow-auto ">
        {/* <ScrollArea className="rounded-md border w-full"> */}
        <div className="w-full p-1 h-full">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <p className="text-[0.8rem] text-muted-foreground">Title of the proposal</p>
            <Input required id="title" placeholder="Title" type="text" value={proposalTitle} onChange={(e) => updateProposalTitle(e.target.value)} />
          </div>
          <div className="mt-5 gap-1.5 h-[60%]">
            <Label htmlFor="description">Description</Label>
            {/* smaller description */}
            <p className="text-[0.8rem] text-muted-foreground">Proposal description can be written as plain text or formatted with Markdown</p>
            <MDEditor
              aria-required={true}
              className="rounded-md border p-2"
              height={'100%'}
              value={proposalText}
              onChange={(value) => updateProposal(value || '')}
            />
          </div>
        </div>
        {/* </ScrollArea> */}
        {/* Continue for other function arguments, values, etc. */}
      </div>
    </FormWrapper>
  )
}

export default ProposalStep
