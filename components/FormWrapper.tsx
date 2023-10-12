import { ReactNode } from 'react'

import { motion } from 'framer-motion'

import { Separator } from './ui/separator'

type FormWrapperProps = {
  title: string
  description: string
  children: ReactNode
}

const formVariants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      ease: 'easeOut',
    },
  },
}

const FormWrapper = ({ title, description, children }: FormWrapperProps) => {
  return (
    <motion.div animate="visible" className="flex h-[90%] flex-col gap-8" exit="exit" initial="hidden" variants={formVariants}>
      <div className="flex flex-col ">
        <h2 className="text-lg font-bold tracking-tight md:text-xl">{title}</h2>
        <p className="mb-2 text-muted-foreground">{description}</p>
        <Separator />
      </div>
      {children}
    </motion.div>
  )
}

export default FormWrapper
