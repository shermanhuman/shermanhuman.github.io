import { useState, useEffect } from 'react'

export default function LoadingIndicator() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => prevDots.length < 3 ? prevDots + '.' : '')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loading-indicator">
      LOADING{dots}
    </div>
  )
}