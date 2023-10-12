/* eslint-disable react/display-name */
import React from 'react'

import { CheckCheckIcon } from 'lucide-react'

import { loadingSpinner } from '../components/ui/loadingSpinner'

export function renderBtnABI(fetchStatus: string) {
  return () => {
    switch (fetchStatus) {
      case 'loading':
        return loadingSpinner
      case 'success':
        return (
          <>
            <CheckCheckIcon className="mr-1 text-green-500" color="green" display={'inline'} />
            Fetch ABI
          </>
        )
      case 'error':
        return (
          <>
            <span className="mr-1 text-red-500">X</span>
            Retry ABI
          </>
        )
      default:
        return 'Fetch ABI'
    }
  }
}
