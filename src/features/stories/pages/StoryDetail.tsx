import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import { useStory } from '../hooks'
import './StoryDetail.css'

function StoryDetail() {
  const { storyId } = useParams<{ storyId: string }>()
  const navigate = useNavigate()
  const { story, loading, error } = useStory(storyId || null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const renderContent = (content: string) => {
    // Split by double newlines for paragraphs, handle single newlines as line breaks
    const paragraphs = content.split(/\n\s*\n/)
    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim()
      if (!trimmed) return null

      // Check if it looks like a heading (starts with # in markdown)
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} className="story-detail-h3">{trimmed.replace(/^### /, '')}</h3>
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={index} className="story-detail-h2">{trimmed.replace(/^## /, '')}</h2>
      }
      if (trimmed.startsWith('# ')) {
        return <h2 key={index} className="story-detail-h2">{trimmed.replace(/^# /, '')}</h2>
      }

      // Check if it looks like a blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={index} className="story-detail-blockquote">
            {trimmed.replace(/^> /gm, '')}
          </blockquote>
        )
      }

      // Regular paragraph - preserve single line breaks
      const lines = trimmed.split('\n')
      return (
        <p key={index} className="story-detail-paragraph">
          {lines.map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 && <br />}
              {renderInlineFormatting(line)}
            </span>
          ))}
        </p>
      )
    })
  }

  const renderInlineFormatting = (text: string) => {
    // Handle **bold** and *italic* inline formatting
    const parts: (string | JSX.Element)[] = []
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
      // Bold: **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
      // Italic: *text*
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/)

      const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : -1
      const italicIndex = italicMatch ? remaining.indexOf(italicMatch[0]) : -1

      if (boldIndex !== -1 && (italicIndex === -1 || boldIndex <= italicIndex)) {
        if (boldIndex > 0) {
          parts.push(remaining.substring(0, boldIndex))
        }
        parts.push(<strong key={key++}>{boldMatch![1]}</strong>)
        remaining = remaining.substring(boldIndex + boldMatch![0].length)
      } else if (italicIndex !== -1) {
        if (italicIndex > 0) {
          parts.push(remaining.substring(0, italicIndex))
        }
        parts.push(<em key={key++}>{italicMatch![1]}</em>)
        remaining = remaining.substring(italicIndex + italicMatch![0].length)
      } else {
        parts.push(remaining)
        remaining = ''
      }
    }

    return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>
  }

  if (loading) {
    return (
      <div className="story-detail-page">
        <Navbar />
        <div className="story-detail-loading">
          <div className="story-detail-loading-spinner" />
          <p>Loading story...</p>
        </div>
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="story-detail-page">
        <Navbar />
        <div className="story-detail-error">
          <h2>Story not found</h2>
          <p>The story you're looking for doesn't exist or has been removed.</p>
          <Link to="/stories" className="story-detail-back-btn">
            Back to Stories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="story-detail-page">
      <Navbar />

      {/* Hero Banner */}
      <div className="story-detail-hero">
        <div className="story-detail-hero-image-wrapper">
          <img src={story.imageUrl} alt={story.title} className="story-detail-hero-image" />
          <div className="story-detail-hero-overlay" />
        </div>
        <div className="story-detail-hero-content">
          <div className="story-detail-hero-meta">
            <span className="story-detail-hero-date">{formatDate(story.date)}</span>
            <span className="story-detail-hero-dot" />
            <span className="story-detail-hero-read-time">{story.readTime} min read</span>
          </div>
          <h1 className="story-detail-hero-title">{story.title}</h1>
          <p className="story-detail-hero-author">by {story.authorName}</p>
        </div>
      </div>

      {/* Article Body */}
      <article className="story-detail-article">
        <div className="story-detail-article-container">
          {/* Lead / Description */}
          <p className="story-detail-lead">{story.description}</p>

          <div className="story-detail-divider" />

          {/* Content */}
          <div className="story-detail-content">
            {renderContent(story.content)}
          </div>
        </div>
      </article>

      {/* Footer nav */}
      <div className="story-detail-footer-nav">
        <button onClick={() => navigate(-1)} className="story-detail-nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Go Back
        </button>
        <Link to="/stories" className="story-detail-nav-link">
          All Stories
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default StoryDetail
