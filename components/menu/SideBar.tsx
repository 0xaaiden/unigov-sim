import React from 'react'

import {
  LightningBoltIcon,
  PaperPlaneIcon,
  Pencil2Icon,
  StackIcon,
  TokensIcon,
  // FileText,
  // CheckSquare,
} from '@radix-ui/react-icons'
interface NavProps {
  currentStepIndex: number
  goTo: (step: number) => void
}

const steps = [
  {
    title: 'Governance',
    icon: <TokensIcon height={20} width={20} />,
    description: 'Select the Governance Contract',
  },
  {
    title: 'Proposal',
    icon: <Pencil2Icon height={20} width={20} />,
    description: 'Describe your proposal',
  },
  {
    title: 'Contracts',
    icon: <StackIcon height={20} width={20} />,
    description: 'Function calls to submit',
  },
  {
    title: 'Simulation',
    icon: <LightningBoltIcon height={20} width={20} />,
    description: 'Simulate execution on the blockchain',
  },
  {
    title: 'Confirmation',
    icon: <PaperPlaneIcon height={20} width={20} />,
    description: 'Prepare and submit the proposal',
  },
]

const SideBar: React.FC<NavProps> = ({ currentStepIndex, goTo }: NavProps) => {
  return (
    <div className="left-0  mr-4 mt-5 hidden overflow-auto pl-4 md:relative md:left-0 md:top-0 md:flex  md:max-w-[25%] ">
      <ol className="relative h-fit border-l border-neutral-200 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`ml-6 cursor-pointer ${index === steps.length - 1 ? '' : 'mb-10'}`}
            onClick={() => {
              if (index <= currentStepIndex) {
                goTo(index)
              }
            }}>
            <span
              className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900 ${
                index == currentStepIndex ? 'bg-green-200 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
              {step.icon}
            </span>
            <h3 className="font-medium leading-tight">{step.title}</h3>
            <p className="text-sm">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default SideBar
