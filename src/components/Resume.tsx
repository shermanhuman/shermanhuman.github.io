import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import LoadingIndicator from './LoadingIndicator'

export default function Resume() {
  const [resumeContent, setResumeContent] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch('/resume.md')
        const text = await response.text()
        setResumeContent(text)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching resume:', error)
        setLoading(false)
      }
    }

    fetchResume()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  if (loading) {
    return <LoadingIndicator />
  }

  return (
    <div className="resume">
      <h1>RESUME</h1>
      <div className="resume-content">
        <ReactMarkdown>{resumeContent}</ReactMarkdown>
      </div>
      <button className="menu-item" onClick={() => navigate('/')} aria-label="Return to main menu">
        RETURN TO MAIN MENU
      </button>
    </div>
  )
}