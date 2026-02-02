import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Stories.css'
import StoryCard from '../components/StoryCard'
import { Story } from '../types'

function Stories() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const stories: Story[] = [
    {
      id: '1',
      title: 'The Renaissance of Tuscan Reds',
      description: 'Exploring how a new generation of winemakers is redefining the classic Chianti profile while honoring centuries of tradition.',
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
      date: '2024-10-12',
      readTime: '5',
      author: 'Marco V.',
    },
    {
      id: '2',
      title: 'Biodynamic Viticulture Explained',
      description: 'Beyond organic: understanding the holistic approach to vineyard management that views the farm as a self-sustaining organism.',
      imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=600&fit=crop',
      date: '2024-10-08',
      readTime: '8',
      author: 'Sarah J.',
    },
    {
      id: '3',
      title: 'Hidden Gems of South Africa',
      description: 'From Stellenbosch to Swartland, discover the regions producing some of the most exciting and value-driven wines today.',
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
      date: '2024-09-28',
      readTime: '6',
      author: 'David K.',
    },
  ]

  return (
    <div className="stories-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2>Winesta</h2>
            </Link>
          </div>
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          {mobileMenuOpen && (
            <div 
              className="mobile-menu-overlay" 
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/cellar" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Cellar</Link>
            <Link to="/events" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Events</Link>
            <Link to="/sommelier" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Sommelier</Link>
            <Link to="/stories" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Stories</Link>
            <Link to="/login" className="nav-button nav-button-mobile" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          </div>
          <Link to="/login" className="nav-button nav-button-desktop" style={{ textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </nav>

      <div className="stories-container">
        <header className="stories-header">
          <p className="stories-journal-label">JOURNAL</p>
          <h1 className="stories-title">Stories</h1>
          <p className="stories-subtitle">
            In-depth articles, winemaker interviews, and travel journals from the world of wine.
          </p>
        </header>

        <div className="stories-grid">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stories
