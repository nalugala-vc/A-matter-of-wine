import { Link } from 'react-router-dom'
import './StoryCard.css'
import { Story } from '../types'

interface StoryCardProps {
  story: Story
}

function StoryCard({ story }: StoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase()
  }

  return (
    <Link to={`/stories/${story.id}`} className="story-card-link">
      <article className="story-card">
        <div className="story-card-image-wrapper">
          <img src={story.imageUrl} alt={story.title} className="story-card-image" />
        </div>
        <div className="story-card-content">
          <div className="story-card-metadata">
            <span className="story-card-date">{formatDate(story.date)}</span>
            <span className="story-card-dot">•</span>
            <span className="story-card-read-time">{story.readTime} MIN READ</span>
          </div>
          <h3 className="story-card-title">{story.title}</h3>
          <p className="story-card-description">{story.description}</p>
          <div className="story-card-footer">
            <span className="story-card-read-link">READ STORY</span>
            <span className="story-card-author">by {story.authorName}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default StoryCard
