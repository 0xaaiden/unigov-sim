import { tags } from '@/lib/types/types'

import { FormItems } from './types'

export type stepProps = FormItems & {
  updateForm: (fieldToUpdate: Partial<FormItems>) => void
  tags: tags
  setTags: React.Dispatch<React.SetStateAction<tags>>
}
