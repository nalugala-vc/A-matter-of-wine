import { useState } from 'react'
import { Wine, WineCategory, WineFormData } from '../types'
import CategoryFilter from '../components/CategoryFilter'
import WineGrid from '../components/WineGrid'
import WineForm from '../components/WineForm'
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
    imageUrl: undefined,
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
    imageUrl: undefined,
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
    imageUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function PersonalWineCellar() {
  const [wines, setWines] = useState<Wine[]>(mockWines)
  const [activeCategory, setActiveCategory] = useState<WineCategory | 'all'>(
    'all'
  )
  const [showForm, setShowForm] = useState(false)
  const [editingWine, setEditingWine] = useState<Wine | null>(null)

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
    setEditingWine(null)
    setShowForm(true)
  }

  const handleEditWine = (wine: Wine) => {
    setEditingWine(wine)
    setShowForm(true)
  }

  const handleDeleteWine = (wineId: string) => {
    if (window.confirm('Are you sure you want to delete this wine?')) {
      setWines((prev) => prev.filter((w) => w.id !== wineId))
    }
  }

  const handleFormSubmit = (formData: WineFormData) => {
    if (editingWine) {
      // Update existing wine
      setWines((prev) =>
        prev.map((w) =>
          w.id === editingWine.id
            ? {
                ...w,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : w
        )
      )
    } else {
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
    }
    setShowForm(false)
    setEditingWine(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingWine(null)
  }

  return (
    <div className="personal-wine-cellar">
      <div className="personal-wine-cellar-container">
        <div className="personal-wine-cellar-header">
          <div>
            <h1 className="personal-wine-cellar-title">My Wine Cellar</h1>
            <p className="personal-wine-cellar-subtitle">
              Build and manage your digital wine collection. Log and rate wines
              you've tasted, and organize them into categories.
            </p>
          </div>
          <button
            className="personal-wine-cellar-add-btn"
            onClick={handleAddWine}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Wine
          </button>
        </div>

        {showForm ? (
          <div className="personal-wine-cellar-form-wrapper">
            <WineForm
              initialData={editingWine}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              submitLabel={editingWine ? 'Update Wine' : 'Add Wine'}
            />
          </div>
        ) : (
          <>
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              counts={categoryCounts}
            />

            <WineGrid
              wines={filteredWines}
              onEdit={handleEditWine}
              onDelete={handleDeleteWine}
              emptyMessage={
                activeCategory === 'all'
                  ? 'No wines in your cellar yet. Start building your collection!'
                  : `No wines in the ${activeCategory} category.`
              }
            />
          </>
        )}
      </div>
    </div>
  )
}

export default PersonalWineCellar
