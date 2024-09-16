import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MainMenu() {
  const [selectedOption, setSelectedOption] = useState(0)
  const navigate = useNavigate()

  const options = [
    { label: "VIEW RESUME", path: "/resume" },
    { label: "VIEW BLOG", path: "/blog" }
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setSelectedOption(prev => (prev > 0 ? prev - 1 : prev))
          break
        case 'ArrowDown':
          setSelectedOption(prev => (prev < options.length - 1 ? prev + 1 : prev))
          break
        case 'Enter':
          navigate(options[selectedOption].path)
          break
        default:
          if (/^[1-9]$/.test(e.key)) {
            const index = parseInt(e.key) - 1
            if (index < options.length) {
              setSelectedOption(index)
              navigate(options[index].path)
            }
          }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedOption, navigate, options])

  return (
    <div className="main-menu">
      <h1>SHERMAN BOYD</h1>
      <h2>MAIN MENU</h2>
      <ul className="menu-list" role="menu">
        {options.map((option, index) => (
          <li
            key={index}
            className={`menu-item ${index === selectedOption ? 'selected' : ''}`}
            onClick={() => navigate(option.path)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(option.path)
              }
            }}
            role="menuitem"
            tabIndex={0}
            aria-selected={index === selectedOption}
          >
            {`${index + 1}. ${option.label}`}
          </li>
        ))}
      </ul>
      <p className="instructions">
        USE ARROW KEYS TO NAVIGATE, ENTER TO SELECT, OR PRESS THE NUMBER KEY
      </p>
    </div>
  )
}