'use client'

import FormWrapper from '@/components/FormWrapper'
import { Separator } from '@/components/ui/separator'
import { FormItems } from '@/lib/types/types'

type StepProps = FormItems & {
  goTo: (index: number) => void
}

const FinalStep = ({ yearly, plan, addOns, goTo }: StepProps) => {
  let planPrice = 0
  switch (plan) {
    case 'arcade':
      planPrice = 9
      break
    case 'advanced':
      planPrice = 12
      break
    case 'pro':
      planPrice = 15
      break
    default:
      planPrice = 0
      break
  }

  const filteredAddOns = addOns.filter((addOn) => addOn.checked === true)

  const totalAddOnsPrice = filteredAddOns?.reduce((acc, obj) => acc + obj.price, 0)
  console.log(totalAddOnsPrice)

  return (
    <FormWrapper description="Double-check everything looks OK before confirming." title="Finishing Up">
      <div className="">
        <div className="mt-2 rounded-md border border-neutral-300 bg-neutral-100 p-4">
          {' '}
          {/* Adjusted colors */}
          <div className="flex items-center justify-between">
            <div className="">
              <h4 className="font-semibold text-black md:text-lg">
                {`${plan.charAt(0).toUpperCase() + plan.slice(1)} (${yearly ? 'Yearly' : 'Monthly'})`}
              </h4>
              <button className="text-sm text-[#6fe79f]" onClick={() => goTo(1)}>
                Change
              </button>
            </div>
            <p className="font-semibold text-black">{`$${yearly ? planPrice * 10 : planPrice}${yearly ? '/yr' : '/mo'}`}</p>
          </div>
          {filteredAddOns.length > 0 && <Separator className="my-4" />}
          {filteredAddOns?.map((addOn) => (
            <div key={addOn.id} className="my-2 flex items-center justify-between">
              <p className="text-neutral-600">{addOn.title}</p> {/* Adjusted color */}
              <p className="">{`$${yearly ? addOn.price * 10 : addOn.price}${yearly ? '/yr' : '/mo'}`}</p>
            </div>
          ))}
        </div>
        <div className="my-4 flex items-center justify-between px-4">
          <p className="text-neutral-600">Total (per {yearly ? 'year' : 'month'})</p>
          <p className="font-semibold text-[#6fe79f] md:text-lg">
            +$
            {yearly ? planPrice * 10 + totalAddOnsPrice * 10 : planPrice + totalAddOnsPrice}/{yearly ? 'yr' : 'mo'}
          </p>
        </div>
      </div>
    </FormWrapper>
  )
}

export default FinalStep
