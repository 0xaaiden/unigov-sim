import React from 'react'

export const loadingSpinner = (
  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 01-8-8H0c0 6.627 5.373 12 12 12v-4zm3-5.291A7.962 7.962 0 0116 12h4c0 3.042-1.135 5.824-3 7.938l-3-2.647z"
      fill="currentColor"></path>
  </svg>
)
