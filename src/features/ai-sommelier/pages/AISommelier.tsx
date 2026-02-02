import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AISommelier.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
}

function AISommelier() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m analyzing your request and will provide personalized wine recommendations based on your preferences. Let me suggest some excellent options for you...',
        sender: 'ai',
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleRegenerate = (messageId: string) => {
    // Find the message and regenerate
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex > -1 && messages[messageIndex].sender === 'ai') {
      // Simulate regeneration
      const regeneratedMessage: Message = {
        id: Date.now().toString(),
        text: messages[messageIndex].text + ' (Regenerated)',
        sender: 'ai',
      }
      const newMessages = [...messages]
      newMessages[messageIndex] = regeneratedMessage
      setMessages(newMessages)
    }
  }

  return (
    <div className="ai-sommelier-page">
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

      {/* Main Content Area */}
      <main className="ai-sommelier-main">

        <div className="ai-sommelier-content">
          {messages.length === 0 ? (
            <div className="ai-sommelier-welcome">
              <div className="ai-sommelier-welcome-bubble-container">
                <div className="ai-sommelier-welcome-bubble-wrapper">
                  <div className="ai-sommelier-welcome-bubble-glow"></div>
                  <div className="ai-sommelier-welcome-bubble-inner">
                  </div>
                </div>
              </div>
              <h2 className="ai-sommelier-welcome-title">
                Good Morning, Wine Lover
              </h2>
              <p className="ai-sommelier-welcome-subtitle">
                How Can I <span className="ai-sommelier-highlight">Assist</span> You Today?
              </p>
            </div>
          ) : (
            <div className="ai-sommelier-messages">
              {messages.map((message, index) => (
                <div key={message.id} className="ai-sommelier-message-wrapper">
                  {message.sender === 'ai' ? (
                    <div className="ai-sommelier-message ai-sommelier-message-ai">
                      <div className="ai-sommelier-avatar ai-sommelier-avatar-ai">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      </div>
                      <div className="ai-sommelier-message-content-wrapper">
                        <div className="ai-sommelier-message-content">
                          {message.text}
                        </div>
                        <div className="ai-sommelier-message-actions">
                          <button className="ai-sommelier-feedback-btn" aria-label="Thumbs up">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M7 10v12M7 10l-4-4v4h4zM7 10h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7" />
                            </svg>
                          </button>
                          <button className="ai-sommelier-feedback-btn" aria-label="Thumbs down">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 14V2M17 14l4 4v-4h-4zM17 14h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4" />
                            </svg>
                          </button>
                          <button className="ai-sommelier-action-text-btn" onClick={() => handleCopy(message.text)}>
                            Copy
                          </button>
                          <button className="ai-sommelier-action-text-btn">
                            Add to Editor
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="ai-sommelier-message ai-sommelier-message-user">
                      <div className="ai-sommelier-avatar ai-sommelier-avatar-user">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div className="ai-sommelier-message-content">
                        {message.text}
                      </div>
                    </div>
                  )}
                  {message.sender === 'ai' && index === messages.length - 1 && (
                    <div className="ai-sommelier-regenerate-wrapper">
                      <button className="ai-sommelier-regenerate-btn" onClick={() => handleRegenerate(message.id)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                          <path d="M3 21v-5h5" />
                        </svg>
                        Regenerate Response
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="ai-sommelier-input-container">
            <input
              type="text"
              placeholder="Ask or search anything"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="ai-sommelier-input"
            />
            <div className="ai-sommelier-input-footer">
              <div className="ai-sommelier-input-footer-left">
                <button className="ai-sommelier-footer-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Browse Prompts
                </button>
                <button className="ai-sommelier-footer-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                  No Brand Voice
                </button>
              </div>
              <div className="ai-sommelier-input-footer-right">
                <button className="ai-sommelier-footer-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Improve
                </button>
                <button
                  className="ai-sommelier-send-btn"
                  onClick={handleSendMessage}
                  aria-label="Send message"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AISommelier
