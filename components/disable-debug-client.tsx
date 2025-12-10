"use client"

import { useEffect } from 'react'

export default function DisableDebugClient() {
  useEffect(() => {
    try {
      if (process.env.NODE_ENV === 'production') {
        // Silence debug logs in production browser builds
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        console.debug = () => {}
      }
    } catch (e) {
      // no-op
    }
  }, [])
  return null
}
