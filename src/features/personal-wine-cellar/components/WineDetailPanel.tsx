import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Wine, WineFormData } from '../types'
import './WineDetailPanel.css'

interface WineDetailPanelProps {
  wine: Wine | null
  isOpen: boolean
  onClose: () => void
  onSave: (wineId: string | null, formData: WineFormData) => void
  onDelete?: (wineId: string) => void
}

function WineDetailPanel({ wine, isOpen, onClose, onSave, onDelete }: WineDetailPanelProps) {
  const [formData, setFormData] = useState<WineFormData | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const isAddMode = wine === null

  // Initialize form data when wine changes or when opening for add
  useEffect(() => {
    if (isAddMode) {
      // Initialize empty form for adding new wine
      setFormData({
        name: '',
        year: new Date().getFullYear(),
        region: '',
        rating: 0,
        tastingNotes: '',
        pairingDetails: '',
        category: 'tried',
      })
      setImagePreview(null)
    } else if (wine) {
      // Initialize form with existing wine data
      setFormData({
        name: wine.name,
        year: wine.year,
        region: wine.region,
        rating: wine.rating,
        tastingNotes: wine.tastingNotes,
        pairingDetails: wine.pairingDetails,
        category: wine.category,
      })
      setImagePreview(wine.imageUrl || null)
    }
  }, [wine, isAddMode])

  if (!formData) return null

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev!,
      [name]: name === 'year' || name === 'rating' ? Number(value) : value,
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev!, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const wineId = isAddMode ? null : wine!.id
    onSave(wineId, formData)
    onClose()
  }

  const handleDelete = () => {
    if (wine && window.confirm('Are you sure you want to delete this wine?')) {
      onDelete?.(wine.id)
      onClose()
    }
  }

  const renderStars = (rating: number, onChange: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        className={`detail-star-input ${i < rating ? 'filled' : ''}`}
        onClick={() => onChange(i + 1)}
        aria-label={`Rate ${i + 1} stars`}
      >
        ★
      </button>
    ))
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tried':
        return 'Tried'
      case 'wishlist':
        return 'Wishlist'
      case 'favorite':
        return 'Favorite'
      default:
        return category
    }
  }

  return (
    <>
      <div className={`wine-detail-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`wine-detail-panel ${isOpen ? 'open' : ''}`}>
        <button className="wine-detail-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <form className="wine-detail-content" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="wine-detail-image-section">
            {imagePreview ? (
              <div className="wine-detail-image-wrapper">
                <img src={imagePreview} alt={formData.name || 'Wine'} className="wine-detail-image" />
                <label htmlFor="wine-detail-image-input" className="wine-detail-image-edit-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Change Image
                </label>
              </div>
            ) : (
              <label htmlFor="wine-detail-image-input" className="wine-detail-image-upload-label">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Upload Image</span>
              </label>
            )}
            <input
              type="file"
              id="wine-detail-image-input"
              accept="image/*"
              onChange={handleImageChange}
              className="wine-detail-image-input"
            />
          </div>

          {/* Basic Information */}
          <div className="wine-detail-section">
            <h3 className="wine-detail-section-title">Basic Information</h3>
            
            <div className="wine-detail-form-group">
              <label className="wine-detail-label">Wine Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="wine-detail-input"
                required
              />
            </div>

            <div className="wine-detail-form-row">
              <div className="wine-detail-form-group">
                <label className="wine-detail-label">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="wine-detail-input"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div className="wine-detail-form-group">
                <label className="wine-detail-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="wine-detail-select"
                  required
                >
                  <option value="tried">Tried</option>
                  <option value="wishlist">Wishlist</option>
                  <option value="favorite">Favorite</option>
                </select>
              </div>
            </div>

            <div className="wine-detail-form-group">
              <label className="wine-detail-label">Region</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="wine-detail-input"
                required
              />
            </div>

            <div className="wine-detail-form-group">
              <label className="wine-detail-label">Rating</label>
              <div className="wine-detail-rating-input">
                {renderStars(formData.rating, (rating) =>
                  setFormData((prev) => ({ ...prev!, rating }))
                )}
                <span className="wine-detail-rating-value">{formData.rating}/5</span>
              </div>
            </div>
          </div>

          {/* Tasting Notes */}
          <div className="wine-detail-section">
            <h3 className="wine-detail-section-title">Tasting Notes</h3>
            <div className="wine-detail-form-group">
              <textarea
                name="tastingNotes"
                value={formData.tastingNotes}
                onChange={handleChange}
                className="wine-detail-textarea"
                rows={4}
                placeholder="Describe the wine's aroma, flavor, body, and finish..."
              />
            </div>
          </div>

          {/* Pairing Details */}
          <div className="wine-detail-section">
            <h3 className="wine-detail-section-title">Pairing Details</h3>
            <div className="wine-detail-form-group">
              <input
                type="text"
                name="pairingDetails"
                value={formData.pairingDetails}
                onChange={handleChange}
                className="wine-detail-input"
                placeholder="e.g., Grilled steak, aged cheese, dark chocolate"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="wine-detail-actions">
            {!isAddMode && onDelete && (
              <button
                type="button"
                className="wine-detail-delete-btn"
                onClick={handleDelete}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            )}
            <button type="submit" className="wine-detail-save-btn">
              {isAddMode ? 'Add Wine' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default WineDetailPanel
