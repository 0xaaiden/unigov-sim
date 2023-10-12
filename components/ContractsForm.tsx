import React from 'react'

import { PlusCircledIcon } from '@radix-ui/react-icons'
import { formatAbi } from 'abitype'
import { CheckCheckIcon } from 'lucide-react'

import { ContractTag } from '@/components/contractselection/generateParamsUI'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getContractABI } from '@/hooks/useContractAbi'
import { extractFunctionName } from '@/lib/extractFunctionName'
import { ABIStatus } from '@/lib/types/types'

import { ComboboxDemo } from './contractselection/ComboBoxFns'
import FormGen, { FormGenEdit } from './contractselection/formGen'
import FormWrapper from './FormWrapper'
import { renderBtnABI } from '../lib/renderBtnABI'
import { stepProps } from '../lib/types/stepProps'

export const ContractsForm = ({ tags, setTags }: stepProps) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [contractAddress, setContractAddress] = React.useState('')
  const [contractAbi, setContractAbi] = React.useState<any[]>([])

  // const [tags, setTags] = React.useState<Tags>([]);
  const [chosenFnc, setChosenFnc] = React.useState<string>('')
  const [fetchStatus, setFetchStatus] = React.useState<ABIStatus>('idle')
  let frameworks: {
    value: string
    label: string
  }[] = []
  // const [zodSchema, setZodSchema] = React.useState<ZodObjectOrWrapped>();
  // const [fieldConfig, setFieldConfig] = React.useState<{ [k: string]: string }>(
  //   {}
  // );
  const [editingTag, setEditingTag] = React.useState<string>('')
  const [editOpen, setEditOpen] = React.useState(false)

  React.useEffect(() => {
    if (value.length > 1) {
      setChosenFnc(extractFunctionName(value))
    }
  }, [value])

  const renderButtonContent = renderBtnABI(fetchStatus)

  const handleFetchAbi = async () => {
    setFetchStatus('loading')
    try {
      const abi = await getContractABI(contractAddress)
      if (!abi) {
        setContractAbi([])
        setFetchStatus('error')
        return
      }
      setContractAbi(abi)
      setFetchStatus('success')
    } catch (error) {
      console.error('Failed to fetch ABI:', error)
      setFetchStatus('error')
    }
  }

  const removeTag = (uuidNameToRemove: string) => {
    const newTags = tags.filter((tag) => tag.uuid !== uuidNameToRemove)
    setTags(newTags)
  }

  const editTag = (uuidNameToEdit: string) => {
    setEditingTag(uuidNameToEdit)
    setEditOpen(true) // open the edit dialog
  }

  if (contractAbi) {
    const functionAbi = contractAbi.filter((value) => value.type === 'function')
    const functionNames = formatAbi(functionAbi)

    frameworks = functionNames.map((name) => ({
      value: name,
      label: name,
    }))
  }

  return (
    <FormWrapper description="Specify the target addresses and corresponding functions for your proposal" title="Contract Interaction">
      <div className="flex h-full flex-col gap-3 overflow-auto ">
        <div className="flex flex-col gap-2">
          <label htmlFor="selectedGovernanceContract">Target Addresses</label>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className=" border-2  border-dotted border-black/20  p-6  text-black/50
                dark:border-white/0  dark:text-white/50  
                ">
                <PlusCircledIcon
                  height={20}
                  width={20}
                  className="mr-1
                text-black/50
                hover:text-black/80
                dark:text-white
                dark:hover:text-white/80
                "
                />
                Add Contract...
              </Button>
            </DialogTrigger>
            <DialogContent className=" block sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Contract Details</DialogTitle>
                <DialogDescription>Specify the address and function details for the contract you want to interact with.</DialogDescription>
              </DialogHeader>
              <div className="!block  gap-4 py-4">
                <div className="flex flex-col gap-4">
                  <Label className="text-left" htmlFor="contractAddress">
                    Address
                  </Label>

                  <div className="flex w-full space-x-2 whitespace-nowrap">
                    <Input
                      id="contractAddress"
                      placeholder="0x..."
                      onChange={(e) => {
                        setContractAddress(e.target.value)
                      }}
                    />
                    <Button
                      disabled={fetchStatus === 'loading'}
                      type="submit"
                      className={
                        fetchStatus === 'error'
                          ? 'text-red-500 hover:text-red-600'
                          : fetchStatus === 'success'
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : ''
                      }
                      onClick={handleFetchAbi}>
                      {renderButtonContent()}
                    </Button>
                  </div>

                  {contractAbi.length >= 0 && (
                    <div>
                      <HoverCard>
                        <HoverCardTrigger asChild className="flex justify-start gap-1">
                          {contractAbi.length > 0 ? (
                            <Button className="-mt-5 ml-0.5 !pl-0 text-xs text-green-800 hover:text-green-600" variant="link">
                              ABI Verified <CheckCheckIcon className="text-green-500 " color="green" display={'inline'} />
                            </Button>
                          ) : (
                            <Button className="-mt-5 ml-0.5 !pl-0 text-xs text-red-800 hover:text-red-600" variant="link">
                              ABI Not Verified{' '}
                              {/* <XCircleIcon
                            color="red"
                            display={"inline"}
                            className="text-red-500 "
                          /> */}
                            </Button>
                          )}
                        </HoverCardTrigger>
                        <HoverCardContent align="start" className="overflow-auto">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                              <label htmlFor="abi">ABI</label>
                              <textarea
                                readOnly
                                className="h-32 w-full rounded-md bg-gray-100 p-2 text-sm"
                                id="abi"
                                value={JSON.stringify(contractAbi, null, 2)}
                              />
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      <div className="items-left mt-4 flex flex-col gap-4">
                        <Label className="" htmlFor="functionCall">
                          Choose a function
                        </Label>

                        {ComboboxDemo({ frameworks, setValue, value })}
                        {value ? (
                          <div>
                            <FormGen
                              address={contractAddress}
                              chosenFnc={chosenFnc}
                              contractAbi={contractAbi}
                              setOpen={setOpen}
                              setTags={setTags}
                              tags={tags}
                              value={value}
                            />
                            {/* Other JSX elements */}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>{/* You might not need a trigger if the dialog is programmatically controlled */}</DialogTrigger>
            <DialogContent className=" block sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Function Call Details</DialogTitle>
                <DialogDescription>Edit the parameters for the function call.</DialogDescription>
              </DialogHeader>
              <div className="!block  gap-4 py-4">
                <FormGenEdit
                  editingTag={editingTag}
                  setOpen={setEditOpen} // Notice the change here to control this dialog
                  setTags={setTags}
                  tags={tags}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="  w-full rounded-md border">
          <div className="w-full p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Function Calls <span className="text-muted-foreground">{tags.length} of 10</span>
            </h4>
            {tags.map((tag) => (
              <>
                {/*  */}
                <ContractTag key={tag.uuid} editTag={editTag} removeTag={removeTag} setTagOpen={setEditOpen} tag={tag} />
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

export default ContractsForm
