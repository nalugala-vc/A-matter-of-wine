import { useState } from 'react'
import { Wine, WineCategory, WineFormData } from '../types'
import WineGrid from '../components/WineGrid'
import WineDetailPanel from '../components/WineDetailPanel'
import Navbar from '../../../components/Navbar'
import { useWines, useWineStats } from '../hooks'
const coverImage = 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600&h=600&fit=crop&q=80'
import './PersonalWineCellar.css'

function PersonalWineCellar() {
  const [activeCategory, setActiveCategory] = useState<WineCategory | 'all'>('all')
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const { 
    wines, 
    loading, 
    error, 
    filterByCategory, 
    addWine, 
    editWine, 
    removeWine 
  } = useWines({ 
    category: activeCategory === 'all' ? undefined : activeCategory 
  })
  
  const { stats, refetch: refetchStats } = useWineStats()

  const handleCategoryChange = (category: WineCategory | 'all') => {
    setActiveCategory(category)
    filterByCategory(category === 'all' ? undefined : category)
  }

  const categoryCounts = {
    all: stats?.total ?? 0,
    tried: stats?.tried ?? 0,
    wishlist: stats?.wishlist ?? 0,
    favorite: stats?.favorite ?? 0,
  }

  const handleAddWine = () => {
    setSelectedWine(null) // null means add mode
    setIsDetailPanelOpen(true)
  }

  const handleWineClick = (wine: Wine) => {
    setSelectedWine(wine)
    setIsDetailPanelOpen(true)
  }

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false)
    setTimeout(() => {
      setSelectedWine(null)
    }, 400) // Wait for animation to complete
  }

  const handleSaveWine = async (wineId: string | null, formData: WineFormData) => {
    setSaving(true)
    try {
      if (wineId === null) {
        // Add new wine
        await addWine(formData)
      } else {
        // Update existing wine
        await editWine(wineId, formData)
      }
      refetchStats() // Update stats after save
      handleCloseDetailPanel()
    } catch (err) {
      console.error('Failed to save wine:', err)
      alert('Failed to save wine. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteWine = async (wineId: string) => {
    try {
      await removeWine(wineId)
      refetchStats() // Update stats after delete
      handleCloseDetailPanel()
    } catch (err) {
      console.error('Failed to delete wine:', err)
      alert('Failed to delete wine. Please try again.')
    }
  }

  const tabs = [
    { value: 'all' as const, label: 'All Wines', count: categoryCounts.all },
    { value: 'tried' as const, label: 'Tried', count: categoryCounts.tried },
    { value: 'wishlist' as const, label: 'Wishlist', count: categoryCounts.wishlist },
    { value: 'favorite' as const, label: 'Favorite', count: categoryCounts.favorite },
  ]

  return (
    <div className="personal-wine-cellar">
      <Navbar />

      {/* Cover Photo Section */}
      <div className="cellar-cover-section">
        <div className="cellar-cover-photo">
          <img src={coverImage} alt="Wine Cellar Cover" />
          <h1 className="cellar-cover-title">My Wine Cellar</h1>
          <button className="cellar-edit-cover-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Edit Cover
          </button>
        </div>

        {/* Profile Section */}
        <div className="cellar-profile-section">
          <div className="cellar-profile-picture">
            <div className="cellar-profile-avatar">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>

          <div className="cellar-profile-info">
            {/* Navigation Tabs */}
            <div className="cellar-nav-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  className={`cellar-nav-tab ${activeCategory === tab.value ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(tab.value)}
                >
                  <span className="cellar-tab-label">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="cellar-tab-count">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
            <button
              className="cellar-add-wine-btn"
              onClick={handleAddWine}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Wine
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="personal-wine-cellar-container">
        {loading ? (
          <div className="cellar-loading">Loading your wine collection...</div>
        ) : error ? (
          <div className="cellar-error">
            <p>Unable to load your wines. Please try again later.</p>
          </div>
        ) : (
          <WineGrid
            wines={wines}
            emptyMessage={
              activeCategory === 'all'
                ? 'No wines in your cellar yet. Start building your collection!'
                : `No wines in the ${activeCategory} category.`
            }
            onWineClick={handleWineClick}
          />
        )}
        <WineDetailPanel
          wine={selectedWine}
          isOpen={isDetailPanelOpen}
          onClose={handleCloseDetailPanel}
          onSave={handleSaveWine}
          onDelete={handleDeleteWine}
          saving={saving}
        />
      </div>
    </div>
  )
}

export default PersonalWineCellar
