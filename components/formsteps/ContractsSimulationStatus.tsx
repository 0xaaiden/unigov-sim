import React, { useEffect } from 'react'

import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import FormWrapper from '@/components/FormWrapper'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SimulationConfig } from '@/lib/types/types'
import { AllCheckResults } from '@/simulation/types'
import { useQueryState } from 'next-usequerystate'
import { useChat } from 'ai/react'
import ApiCaller from '../providers/api-caller'
import { Wand } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

const STATUS_ITEMS = [
  { key: 'checkStateChanges', text: 'Report State Changes' },
  {
    key: 'checkDecodeCalldata',
    text: 'Decoded Target Calldata',
  },
  {
    key: 'checkLogs',
    text: 'Report Events Emitted',
  },
  {
    key: 'checkTargetsVerifiedEtherscan',
    text: 'Report Target Contracts are Verified',
  },
]

const countDoneLabels = (labels: string[]) => labels.filter((label) => label === 'Done').length

const AccordionStatusItem = ({ label, text, content }: any): JSX.Element => {
  let labelClass

  switch (label) {
    case PENDING_LABEL:
      labelClass = 'bg-orange-800 text-white animate-pulse' // Orange background, white text
      break
    case DONE_LABEL:
      labelClass = 'bg-green-800 text-white' // Dark green background, white text
      break
    case ERROR_LABEL:
      labelClass = 'bg-red-500 text-white' // Red background, white text
      break
    case DONE_BLACK_LABEL:
      labelClass = 'bg-black text-white' // Black background, white text
      break

    default:
      labelClass = 'bg-orange-800 text-whiten animate-pulse' // Default to orange background, white text
  }

  return (
    <AccordionItem value={text}>
      <AccordionTrigger>
        <p className="text-sm font-medium leading-none">
          <span className={`mr-2 rounded-lg px-2 py-1 text-xs ${labelClass}`}>{label}</span>
          <span className="text-muted-foreground">{text}</span>
        </p>
      </AccordionTrigger>
      <AccordionContent className=" overflow-auto ">
        <Markdown className="" rehypePlugins={[rehypeRaw]}>
          {content}
        </Markdown>
      </AccordionContent>
    </AccordionItem>
  )
}

const PENDING_LABEL = 'Pending'
const DONE_LABEL = 'Done'
const DONE_BLACK_LABEL = 'None'
const ERROR_LABEL = 'Error'

const getStatusAndContent = (resultItem: {
  errors: string[]
  warnings: string[]
  info: string[]
}): {
  status: string
  content: string
} => {
  if (resultItem.errors && resultItem.errors.length > 0) {
    return {
      status: ERROR_LABEL,
      content: resultItem.errors.join(' <br/> '),
    }
  } else if (resultItem.warnings && resultItem.warnings.length > 0) {
    return {
      status: DONE_LABEL,
      content: resultItem.warnings.join(' <br/> '),
    } // Keeping the label as Done but showing warnings
  } else if (resultItem.info && resultItem.info.length > 0) {
    return { status: DONE_LABEL, content: resultItem.info.join(' <br/> ') } // Keeping the label as Done but showing info
  } else {
    return { status: DONE_BLACK_LABEL, content: '' }
  }
}

const ContractSimulationStatus = ({ simConfig }: { simConfig: SimulationConfig }) => {
  const [simulationResults, setSimulationResults] = React.useState<AllCheckResults>({
    checkStateChanges: {
      name: '',
      result: { info: [], errors: [], warnings: [] },
    },
    checkDecodeCalldata: {
      name: '',
      result: { info: [], errors: [], warnings: [] },
    },
    checkTargetsVerifiedEtherscan: {
      name: '',
      result: { info: [], errors: [], warnings: [] },
    },
    checkLogs: {
      name: '',
      result: { info: [], errors: [], warnings: [] },
    },
  })
  const { messages, append, input, setInput, handleInputChange, handleSubmit, error, data, setMessages } = useChat({})
  const [status, setStatus] = useQueryState('status', {
    defaultValue: 'pending',
  })

  const [pendingAPI, setPendingAPI] = React.useState<boolean>(true)
  const [pendingState, setPendingState] = React.useState<any>({
    label: PENDING_LABEL,
    text: ['Simulation in Progress'],
    info: ['Please wait while we simulate your proposal.'],
  })

  React.useEffect(() => {
    ApiCaller(simConfig).then(
      (results) => {
        setSimulationResults(results)
        setPendingAPI(false)
      },
      (err) => {
        setPendingState({
          label: ERROR_LABEL,
          text: ['Simulation Failed'],
          info: ['Please try again later. \n Error Message: ', err],
        })
      }
    )
    setMessages([
      {
        id: '1',
        role: 'user',
        content:
          'You are a web3 technical expert from the Uniswap Community. We need your help to  understand on chain blockchain data.\
        We have simulated the execution of a proposal to be submitted to the Uniswap Governance.\n\
        Can you please review the results and explain what happened to someone not technical (ignore `proposals` key changes in your summary). Format the response nicely in markdown format and highlight important points. \n',
      },
    ])
  }, [simConfig])

  React.useEffect(() => {
    // count if any of the labels is Errors
    const countErrors = Object.values(simulationResults)
      .map((item) => item.result)
      .map((result) => getStatusAndContent(result).status)
      .filter((status: any) => status === ERROR_LABEL).length
    const countWarnings = Object.values(simulationResults)
      .map((item) => item.result)
      .map((result) => getStatusAndContent(result).status)
      .filter((status: any) => status === DONE_LABEL).length

    if (countErrors === 0 && pendingAPI === false) {
      setStatus('done')
    }
  }, [simulationResults])

  return (
    <FormWrapper description="Simulate the execution of a function on a smart contract." title="Contracts Simulations">
      <div className="flex h-full flex-col gap-3 overflow-auto">
        <div className="w-full rounded-md border-0 w-full overflow-auto">
          <div className="w-full">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Proposal Simulation Status{' '}
              <span className="text-muted-foreground">
                {countDoneLabels(
                  Object.values(simulationResults)
                    .map((item) => item.result)
                    .map((result) => getStatusAndContent(result).status)
                )}{' '}
                of {Object.values(simulationResults).length}{' '}
              </span>
              <Button
                className="float-right mr-2"
                variant={'outline'}
                onClick={(e) => {
                  e.preventDefault()
                  setInput(JSON.stringify(simulationResults))
                  append({ role: 'user', content: JSON.stringify(simulationResults) })
                }}
                disabled={pendingAPI}>
                <Wand className="mr-2" size={16} /> Generate AI Summary
              </Button>
            </h4>{' '}
            <div className="w-full overflow-auto max-h-52">
              {messages.map((m) => (
                <div key={m.id} className="w-full overflow-auto">
                  {/* only print if role isnot user */}
                  {m.role === 'user' ? null : (
                    <p className="text-sm font-medium leading-none">
                      <Badge
                        variant={'outline'}
                        className="
                      bg-yellow-700 text-white animate-pulse mb-2">
                        AI Summary
                      </Badge>

                      <span
                        className="
                        text-sm  text-muted-foreground
                      ">
                        {
                          <Markdown className="" rehypePlugins={[rehypeRaw]}>
                            {m.content}
                          </Markdown>
                        }
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Accordion collapsible className="w-full" type="single">
              {pendingAPI ? (
                <AccordionStatusItem content={pendingState.info.join(', ')} label={pendingState.label} text={pendingState.text.join(', ')} />
              ) : (
                <>
                  {STATUS_ITEMS.map((item, index) => {
                    const { status, content } = getStatusAndContent(simulationResults[item.key].result)
                    return <AccordionStatusItem key={item.key} content={content} label={status} text={item.text} />
                  })}
                </>
              )}
            </Accordion>
          </div>
        </div>
      </div>{' '}
    </FormWrapper>
  )
}

export default ContractSimulationStatus
