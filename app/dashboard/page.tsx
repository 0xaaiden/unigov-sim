'use client'
import { useState } from 'react'

import { AnimatePresence } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'

import ProposalStep from '@/components/formsteps/ProposalStep'
import {
  Button,
  ContractSelectionForm,
  ContractSimulation,
  ContractSimulationStatus,
  ContractsForm,
  FinalStep,
  SideBar,
  SimulationPreview,
  SuccessMessage,
} from '@/components/index'
import { initialValues } from '@/config/site'
import { useMultiplestepForm } from '@/hooks/useMultiplestepForm'
import { tags as Tags } from '@/lib/types/types'
import { FormItems } from '@/lib/types/types'
import { SimulationConfig } from '@/lib/types/types'
import { generateSimulationConfig } from '@/simulation'

export default function Dashboard() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })
  const [formData, setFormData] = useState(initialValues)
  const [tags, setTags] = useState<Tags>([]) // assuming you've already imported the type Tags.
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>(null as any)
  const [simulationStatus, setSimulationStatus] = useState(false)
  const setProposalText = (proposal: string) => {
    setFormData({ ...formData, proposalText: proposal })
  }
  const setProposalTitle = (proposal: string) => {
    setFormData({ ...formData, proposalTitle: proposal })
  }

  const generateSimulationPreview = () => {
    const simConfig = generateSimulationConfig({
      tags,
      governanceContract: formData.governanceContract.value,
      proposalText: formData.proposalText,
      proposalTitle: formData.proposalTitle,
    })
    setSimulationConfig(simConfig)
  }
  const defaultSize = isTabletOrMobile ? { width: '95%', height: '95%' } : { width: '85%', height: '85%' }

  //if simulationStatus is true, then change step to 3.5

  const [errors, setErrors] = useState<Record<string, string>>({})
  const { previousStep, nextStep, currentStepIndex, isFirstStep, isLastStep, steps, goTo, showSuccessMsg } = useMultiplestepForm(4)
  // console.log("current step oroginal", currentStepIndex);

  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0:
        return <ContractSelectionForm key="step0" errors={errors} formData={formData} updateForm={updateForm} />
      case 1:
        return (
          <ProposalStep
            key="step1"
            {...formData}
            proposalText={formData.proposalText}
            proposalTitle={formData.proposalTitle}
            updateProposal={setProposalText}
            updateProposalTitle={setProposalTitle}
          />
        )
      case 2:
        return <ContractsForm key="step2" {...formData} setTags={setTags} tags={tags} updateForm={updateForm} />
      case 3:
        return simulationStatus ? (
          <ContractSimulationStatus key="step3.5" {...formData} simConfig={simulationConfig} />
        ) : (
          <ContractSimulation key="step3" {...formData} setTags={setTags} tags={tags} updateForm={updateForm} />
        )
      case 4:
        return <FinalStep key="step4" {...formData} goTo={goTo} />
      default:
        return null
    }
  }

  function updateForm(fieldToUpdate: Partial<FormItems>) {
    const { governanceContract, proposalText, proposalTitle, votesChecked, ethereumChecked, loggedInChecked } = fieldToUpdate
    console.log(formData)
    // test if proposal text is empty
    proposalText?.trim().length === 0
      ? setErrors((prevState) => ({
          ...prevState,
          proposalText: 'Please enter a proposal description',
        }))
      : null

    // test if proposal title is empty
    proposalTitle?.trim().length === 0
      ? setErrors((prevState) => ({
          ...prevState,
          proposalTitle: 'Please enter a proposal title',
        }))
      : null

    // test if logged in
    if (loggedInChecked) {
      setErrors((prevState) => ({
        ...prevState,
        loggedInChecked: '',
      }))
    } else if (!loggedInChecked) {
      setErrors((prevState) => ({
        ...prevState,
        loggedInChecked: 'Please log in to Ethereum',
      }))
    }

    // test if network is ethereum checked
    if (ethereumChecked) {
      setErrors((prevState) => ({
        ...prevState,
        ethereumChecked: '',
      }))
    } else if (!ethereumChecked) {
      setErrors((prevState) => ({
        ...prevState,
        ethereumChecked: 'Please log in to Ethereum',
      }))
    }

    setFormData({ ...formData, ...fieldToUpdate })
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('🚀 ~ file: page.tsx:242 ~ handleOnSubmit ~ errors:', errors)

    if (Object.values(errors).some((error) => error)) {
      return
    }
    nextStep()
  }

  return (
    <>
      {!showSuccessMsg ? <SideBar currentStepIndex={currentStepIndex} goTo={goTo} /> : ''}

      <main className={`${showSuccessMsg ? 'w-full overflow-auto ' : 'w-full  md:mt-5 md:w-[75%]'} no-scrollbar`}>
        {showSuccessMsg ? (
          <AnimatePresence mode="wait">
            <SuccessMessage configSim={simulationConfig} formData={formData} />
          </AnimatePresence>
        ) : (
          <form className="flex h-full w-full flex-col justify-between" onSubmit={handleOnSubmit}>
            <div className="mb-2 h-full overflow-auto px-2">
              <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="">
                <Button
                  type="button"
                  variant="outline"
                  className={`${
                    isFirstStep ? 'invisible' : 'visible' // Changed colors
                  }`}
                  onClick={() => {
                    if (simulationStatus) {
                      goTo(3)
                      setSimulationStatus(false)
                    } else {
                      previousStep()
                    }
                  }}>
                  Go Back
                </Button>
              </div>
              <div className="flex items-center">
                <div className="relative flex items-center after:pointer-events-none after:absolute after:inset-px after:rounded-[11px]">
                  {currentStepIndex === 3 && !simulationStatus && (
                    <div>
                      <SimulationPreview ftc={generateSimulationPreview} setSimulationStatus={setSimulationStatus} simConfig={simulationConfig} />
                    </div>
                  )}
                  {(currentStepIndex !== 3 || (currentStepIndex === 3 && simulationStatus)) && (
                    <Button type="submit">{isLastStep ? 'Confirm' : 'Next Step'}</Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </>
  )
}
