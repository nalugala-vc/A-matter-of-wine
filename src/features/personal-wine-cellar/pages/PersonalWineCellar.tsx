import { useState } from 'react'
import { Wine, WineCategory, WineFormData } from '../types'
import WineGrid from '../components/WineGrid'
import WineDetailPanel from '../components/WineDetailPanel'
import coverImage from '../../../assets/images/pexels-helvel-19584152.jpg'
import wineImage1 from '../../../assets/images/pexels-mlkbnl-9299260.jpg'
import wineImage2 from '../../../assets/images/pexels-marketingtuig-87224.jpg'
import wineImage3 from '../../../assets/images/ChatGPT Image Jan 25, 2026, 06_56_39 PM.png'
import './PersonalWineCellar.css'

// Mock data for UI development
const mockWines: Wine[] = [
  {
    id: '1',
    name: 'Château Margaux',
    year: 2015,
    region: 'Bordeaux, France',
    rating: 5,
    tastingNotes:
      'Elegant and refined with notes of blackcurrant, cedar, and violets. Silky tannins and a long, complex finish.',
    pairingDetails: 'Grilled steak, lamb, aged cheese',
    category: 'favorite',
    imageUrl: wineImage1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Dom Pérignon',
    year: 2012,
    region: 'Champagne, France',
    rating: 5,
    tastingNotes:
      'Crisp and refreshing with citrus and white flower notes. Fine bubbles and a creamy texture.',
    pairingDetails: 'Oysters, caviar, sushi',
    category: 'tried',
    imageUrl: wineImage2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Opus One',
    year: 2018,
    region: 'Napa Valley, USA',
    rating: 4,
    tastingNotes:
      'Bold and rich with dark fruit flavors, spice, and oak. Full-bodied with firm tannins.',
    pairingDetails: 'Ribeye steak, dark chocolate',
    category: 'wishlist',
    imageUrl: wineImage3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function PersonalWineCellar() {
  const [wines, setWines] = useState<Wine[]>(mockWines)
  const [activeCategory, setActiveCategory] = useState<WineCategory | 'all'>(
    'all'
  )
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)

  const filteredWines =
    activeCategory === 'all'
      ? wines
      : wines.filter((wine) => wine.category === activeCategory)

  const categoryCounts = {
    all: wines.length,
    tried: wines.filter((w) => w.category === 'tried').length,
    wishlist: wines.filter((w) => w.category === 'wishlist').length,
    favorite: wines.filter((w) => w.category === 'favorite').length,
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

  const handleSaveWine = (wineId: string | null, formData: WineFormData) => {
    if (wineId === null) {
      // Add new wine
      const newWine: Wine = {
        id: Date.now().toString(),
        ...formData,
        imageUrl: formData.image
          ? URL.createObjectURL(formData.image)
          : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setWines((prev) => [...prev, newWine])
    } else {
      // Update existing wine
      setWines((prev) =>
        prev.map((w) =>
          w.id === wineId
            ? {
                ...w,
                ...formData,
                imageUrl: formData.image
                  ? URL.createObjectURL(formData.image)
                  : w.imageUrl,
                updatedAt: new Date().toISOString(),
              }
            : w
        )
      )
    }
  }

  const handleDeleteWine = (wineId: string) => {
    setWines((prev) => prev.filter((w) => w.id !== wineId))
  }

  const tabs = [
    { value: 'all' as const, label: 'All Wines', count: categoryCounts.all },
    { value: 'tried' as const, label: 'Tried', count: categoryCounts.tried },
    { value: 'wishlist' as const, label: 'Wishlist', count: categoryCounts.wishlist },
    { value: 'favorite' as const, label: 'Favorite', count: categoryCounts.favorite },
  ]

  return (
    <div className="personal-wine-cellar">
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
                  onClick={() => setActiveCategory(tab.value)}
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
        <WineGrid
          wines={filteredWines}
          emptyMessage={
            activeCategory === 'all'
              ? 'No wines in your cellar yet. Start building your collection!'
              : `No wines in the ${activeCategory} category.`
          }
          onWineClick={handleWineClick}
        />
        <WineDetailPanel
          wine={selectedWine}
          isOpen={isDetailPanelOpen}
          onClose={handleCloseDetailPanel}
          onSave={handleSaveWine}
          onDelete={handleDeleteWine}
        />
      </div>
    </div>
  )
}

export default PersonalWineCellar
