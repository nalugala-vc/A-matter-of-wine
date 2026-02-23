import Navbar from '../../../components/Navbar'
import './Stories.css'
import StoryCard from '../components/StoryCard'
import { useStories } from '../hooks'

function Stories() {
  const { stories, loading, error } = useStories()

  return (
    <div className="stories-page">
      <Navbar />

      <div className="stories-container">
        <header className="stories-header">
          <p className="stories-journal-label">JOURNAL</p>
          <h1 className="stories-title">Stories</h1>
          <p className="stories-subtitle">
            In-depth articles, winemaker interviews, and travel journals from the world of wine.
          </p>
        </header>

        <div className="stories-grid">
          {loading ? (
            <div className="stories-loading">Loading stories...</div>
          ) : error ? (
            <div className="stories-error">
              <p>Unable to load stories. Please try again later.</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="stories-empty">
              <p>No stories available yet. Check back soon!</p>
            </div>
          ) : (
            stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Stories
