import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingIndicator from './LoadingIndicator'

interface BlogPost {
  id: string
  title: string
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/blog/posts.json')
        const data = await response.json()
        setPosts(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setSelectedPost(prev => (prev > 0 ? prev - 1 : prev))
          break
        case 'ArrowDown':
          setSelectedPost(prev => (prev < posts.length - 1 ? prev + 1 : prev))
          break
        case 'Enter':
          navigate(`/blog/${posts[selectedPost].id}`)
          break
        case 'Escape':
          navigate('/')
          break
        default:
          if (/^[1-9]$/.test(e.key)) {
            const index = parseInt(e.key) - 1
            if (index < posts.length) {
              setSelectedPost(index)
              navigate(`/blog/${posts[index].id}`)
            }
          }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPost, navigate, posts])

  if (loading) {
    return <LoadingIndicator />
  }

  return (
    <div className="blog-list">
      <h1>BLOG POSTS</h1>
      <ul className="post-list" role="menu">
        {posts.map((post, index) => (
          <li
            key={post.id}
            className={`menu-item ${index === selectedPost ? 'selected' : ''}`}
            onClick={() => navigate(`/blog/${post.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/blog/${post.id}`)
              }
            }}
            role="menuitem"
            tabIndex={0}
            aria-selected={index === selectedPost}
          >
            {`${index + 1}. ${post.title}`}
          </li>
        ))}
      </ul>
      <button className="menu-item" onClick={() => navigate('/')} aria-label="Return to main menu">
        RETURN TO MAIN MENU
      </button>
    </div>
  )
}