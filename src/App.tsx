import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import heroImage1 from './assets/images/WhatsApp Image 2026-01-21 at 00.05.13.jpeg'
import heroImage2 from './assets/images/pexels-mlkbnl-9299260.jpg'
import heroImage3 from './assets/images/pexels-marketingtuig-87224.jpg'
import heroImage4 from './assets/images/ChatGPT Image Jan 25, 2026, 06_56_39 PM.png'
import personalCellarImage from './assets/features/personal_wine_cellar_2.png'
import vibrantCommImage from './assets/features/vibrant_comm_2.png'
import eventsMeetupsImage from './assets/features/events_meetups_2.png'
import aiSommelierImage from './assets/features/ai_sommlier_2.png'
import leftGrapevine from './assets/images/left_purple.png'
import rightGrapevine from './assets/images/right_purple.png'
import Login from './auth/Login'
import Signup from './auth/Signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

function Home() {
  const featureItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px',
      }
    )

    featureItemsRef.current.forEach((item) => {
      if (item) {
        observer.observe(item)
      }
    })

    return () => {
      featureItemsRef.current.forEach((item) => {
        if (item) {
          observer.unobserve(item)
        }
      })
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="app">
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
            <a href="#events" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#sommelier" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Sommelier</a>
            <a href="#stories" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Stories</a>
            <Link to="/login" className="nav-button nav-button-mobile" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          </div>
          <Link to="/login" className="nav-button nav-button-desktop" style={{ textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-carousel">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            >
              {(index === 1 || index === 2 || index === 3) && (
                <div className="hero-text-overlay">
                  <p className="hero-chalk-text">
                    sometimes its just a matter of{' '}
                    <span className="hero-crossed-out">time</span>
                    <span className="hero-wine-text">wine</span>
                  </p>
                </div>
              )}
            </div>
          ))}
          
          <button className="hero-nav hero-nav-prev" onClick={prevSlide} aria-label="Previous slide">
            ←
          </button>
          <button className="hero-nav hero-nav-next" onClick={nextSlide} aria-label="Next slide">
            →
          </button>

          <div className="hero-dots">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Discover Your Wine Journey</h2>
            <p className="features-subtitle">
              Join a community where passion meets expertise, and every bottle tells a story
            </p>
          </div>
          
          <div className="features-list">
            <div 
              className="feature-item feature-item-left"
              ref={(el) => (featureItemsRef.current[0] = el)}
            >
              <div className="feature-content">
                <h3 className="feature-title">Personal Wine Cellar</h3>
                <p className="feature-description">
                  Build and manage your digital wine collection. Log and rate wines you've tasted—including name, year, region, tasting notes, and pairing details. Each user's "cellar" acts as a digital portfolio of their wine journey. Upload bottle images, share tasting experiences, and organize wines into "Tried / Wishlist / Favorite" categories for easy tracking.
                </p>
              </div>
              <div className="feature-image-wrapper">
                <img src={personalCellarImage} alt="Personal Wine Cellar" className="feature-image" />
              </div>
            </div>

            <div 
              className="feature-item feature-item-right"
              ref={(el) => (featureItemsRef.current[1] = el)}
            >
              <div className="feature-image-wrapper">
                <img src={vibrantCommImage} alt="Vibrant Community" className="feature-image" />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Vibrant Community</h3>
                <p className="feature-description">
                  Connect with fellow wine enthusiasts through our social timeline. Share wines you're tasting, photos, recommendations, and reviews. Engage with commenting, liking, and following functionalities. Your "wine moments" posts can be public or friends-only, creating a personalized social experience centered around your passion for wine.
                </p>
              </div>
            </div>

            <div 
              className="feature-item feature-item-left"
              ref={(el) => (featureItemsRef.current[2] = el)}
            >
              <div className="feature-content">
                <h3 className="feature-title">Events & Meetups</h3>
                <p className="feature-description">
                  Create and join wine tastings, vineyard tours, and exclusive events. Express interest, RSVP, or join events with integrated event chat and reminders. Venue partners can host official events and tastings, bringing the community together for real-world wine experiences and connections.
                </p>
              </div>
              <div className="feature-image-wrapper">
                <img src={eventsMeetupsImage} alt="Events & Meetups" className="feature-image" />
              </div>
            </div>

            <div 
              className="feature-item feature-item-right"
              ref={(el) => (featureItemsRef.current[3] = el)}
            >
              <div className="feature-image-wrapper">
                <img src={aiSommelierImage} alt="AI Sommelier" className="feature-image" />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">AI Sommelier</h3>
                <p className="feature-description">
                  Get personalized wine recommendations powered by artificial intelligence. Our AI learns from your taste logs and preferences, suggesting wines based on flavor profiles, occasions, and meal pairings. Chat with our AI assistant to ask "What wine pairs with sushi?" or "What's similar to this Merlot?" Discover your perfect match through intelligent, personalized suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="articles">
        <div className="articles-container">
          <div className="articles-main">
            <div className="articles-grid">
              <article className="article-card">
                <div className="article-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop" alt="Wine Tasting" className="article-image" />
                </div>
                <div className="article-content">
                  <p className="article-date">April.07.2021</p>
                  <h3 className="article-title">Is there a perfect moment to serve Port wine?</h3>
                  <p className="article-description">
                    Discover the optimal timing for serving Port wine to enhance its flavors and create the perfect tasting experience. Learn about the ideal moments and occasions that complement this rich, fortified wine.
                  </p>
                  <a href="#" className="article-explore">EXPLORE MORE →</a>
                </div>
              </article>

              <article className="article-card">
                <div className="article-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=600&fit=crop" alt="Wine Pairing" className="article-image" />
                </div>
                <div className="article-content">
                  <p className="article-date">June.12.2021</p>
                  <h3 className="article-title">At what temperature should Port wine be served?</h3>
                  <p className="article-description">
                    Master the art of serving Port wine at the perfect temperature. Understanding the ideal serving temperature can dramatically enhance the wine's aromas, flavors, and overall tasting experience.
                  </p>
                  <a href="#" className="article-explore">EXPLORE MORE →</a>
                </div>
              </article>
            </div>
          </div>

          <aside className="articles-sidebar">
            <h3 className="sidebar-title">RECENT ARTICLES</h3>
            <div className="sidebar-divider"></div>
            <ul className="sidebar-list">
              <li className="sidebar-item">
                <span className="sidebar-icon">+</span>
                <span className="sidebar-text">From Vineyards To Cellars: A Complete Guide To Wine Storage</span>
              </li>
              <li className="sidebar-item">
                <span className="sidebar-icon">+</span>
                <span className="sidebar-text">Three Ways To Discover New Wine Regions</span>
              </li>
              <li className="sidebar-item">
                <span className="sidebar-icon">+</span>
                <span className="sidebar-text">Get Ready For Summer Wine Tasting Events</span>
              </li>
              <li className="sidebar-item">
                <span className="sidebar-icon">+</span>
                <span className="sidebar-text">Understanding Wine Labels: A Beginner's Guide</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="testimonials-container">
          <h2 className="testimonials-title">
            What Our Community<br />
            Says About Us
          </h2>
          
          <div className="testimonials-carousel">
            <button className="testimonial-nav testimonial-nav-left">←</button>
            
            <div className="testimonials-wrapper">
              <div className="testimonial-card testimonial-card-1">
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-text">
                  I was amazed at the quality of Winesta. The community recommendations led me to discover wines I never would have tried. Thank you for creating such an incredible platform!
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">Alex Parkinson</h4>
                    <p className="testimonial-role">Wine Enthusiast, Bordeaux</p>
                  </div>
                  <div className="testimonial-image-wrapper">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Alex Parkinson" className="testimonial-image" />
                  </div>
                </div>
              </div>

              <div className="testimonial-card testimonial-card-2">
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-text">
                  Keep up the excellent work! Winesta should be nominated for community platform of the year. The AI sommelier recommendations are spot-on. You won't regret joining!
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">Alberto Donko</h4>
                    <p className="testimonial-role">Sommelier, Tuscany</p>
                  </div>
                  <div className="testimonial-image-wrapper">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" alt="Alberto Donko" className="testimonial-image" />
                  </div>
                </div>
              </div>

              <div className="testimonial-card testimonial-card-3">
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-text">
                  Winesta is the most valuable wine resource we have ever discovered. The personal wine cellar feature has transformed how I track and organize my collection. I would be lost without it.
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">Sarah Chen</h4>
                    <p className="testimonial-role">Wine Collector, Napa Valley</p>
                  </div>
                  <div className="testimonial-image-wrapper">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" alt="Sarah Chen" className="testimonial-image" />
                  </div>
                </div>
              </div>
            </div>

            <button className="testimonial-nav testimonial-nav-right">→</button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="newsletter">
        <div className="newsletter-container">
          <div className="newsletter-illustration newsletter-left">
            <img src={leftGrapevine} alt="Grapevine" className="grapevine-image" />
          </div>
          
          <div className="newsletter-content">
            <h2 className="newsletter-title">SUBSCRIBE OUR NEWSLETTER</h2>
            <p className="newsletter-description">
              Stay connected with the latest wine discoveries, exclusive events, and community stories. Join our newsletter to never miss a moment of your wine journey.
            </p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter Your Email Here" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-submit">Submit</button>
            </form>
          </div>

          <div className="newsletter-illustration newsletter-right">
            <img src={rightGrapevine} alt="Grapevine" className="grapevine-image" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="footer-logo">Winesta</h3>
              <p className="footer-tagline">
                Connecting wine enthusiasts worldwide through shared passion, discovery, and community.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">Facebook</a>
                <a href="#" className="social-link" aria-label="Instagram">Instagram</a>
                <a href="#" className="social-link" aria-label="Twitter">Twitter</a>
                <a href="#" className="social-link" aria-label="LinkedIn">LinkedIn</a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-heading">Platform</h4>
                <ul className="footer-list">
                  <li><a href="#" className="footer-link">Personal Cellar</a></li>
                  <li><a href="#" className="footer-link">Community Feed</a></li>
                  <li><a href="#" className="footer-link">Events & Meetups</a></li>
                  <li><a href="#" className="footer-link">AI Sommelier</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <ul className="footer-list">
                  <li><a href="#" className="footer-link">About Us</a></li>
                  <li><a href="#" className="footer-link">Our Story</a></li>
                  <li><a href="#" className="footer-link">Careers</a></li>
                  <li><a href="#" className="footer-link">Contact</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Resources</h4>
                <ul className="footer-list">
                  <li><a href="#" className="footer-link">Blog</a></li>
                  <li><a href="#" className="footer-link">Wine Guides</a></li>
                  <li><a href="#" className="footer-link">Pairing Tips</a></li>
                  <li><a href="#" className="footer-link">Help Center</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Legal</h4>
                <ul className="footer-list">
                  <li><a href="#" className="footer-link">Privacy Policy</a></li>
                  <li><a href="#" className="footer-link">Terms of Service</a></li>
                  <li><a href="#" className="footer-link">Cookie Policy</a></li>
                  <li><a href="#" className="footer-link">Accessibility</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Winesta. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy</a>
              <span className="footer-separator">•</span>
              <a href="#" className="footer-bottom-link">Terms</a>
              <span className="footer-separator">•</span>
              <a href="#" className="footer-bottom-link">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
