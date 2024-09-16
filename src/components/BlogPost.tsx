import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import LoadingIndicator from './LoadingIndicator'

export default function BlogPost() {
  const [postContent, setPostContent] = useState('')
  const [loading, setLoading] = useState(true)
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/blog/${postId}.md`)
        const text = await response.text()
        setPostContent(text)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching blog post:', error)
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/blog')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  if (loading) {
    return <LoadingIndicator />
  }

  return (
    <div className="blog-post">
      <div className="post-content">
        <ReactMarkdown>{postContent}</ReactMarkdown>
      </div>
      <button className="menu-item" onClick={() => navigate('/blog')} aria-label="Return to blog list">
        RETURN TO BLOG LIST
      </button>
    </div>
  )
}