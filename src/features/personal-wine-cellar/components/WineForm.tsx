import { useState, ChangeEvent, FormEvent } from 'react'
import { WineFormData, WineCategory } from '../types'
import './WineForm.css'

interface WineFormProps {
  initialData?: Partial<WineFormData>
  onSubmit: (data: WineFormData) => void
  onCancel?: () => void
  submitLabel?: string
}

function WineForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Add Wine',
}: WineFormProps) {
  const [formData, setFormData] = useState<WineFormData>({
    name: initialData?.name || '',
    year: initialData?.year || new Date().getFullYear(),
    region: initialData?.region || '',
    rating: initialData?.rating || 0,
    tastingNotes: initialData?.tastingNotes || '',
    pairingDetails: initialData?.pairingDetails || '',
    category: initialData?.category || 'tried',
    image: undefined,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ? URL.createObjectURL(initialData.image) : null
  )

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'rating' ? Number(value) : value,
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const renderStars = (rating: number, onChange: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        className={`star-input ${i < rating ? 'filled' : ''}`}
        onClick={() => onChange(i + 1)}
        aria-label={`Rate ${i + 1} stars`}
      >
        ★
      </button>
    ))
  }

  return (
    <form className="wine-form" onSubmit={handleSubmit}>
      <div className="wine-form-section">
        <h3 className="wine-form-section-title">Basic Information</h3>

        <div className="wine-form-row">
          <div className="wine-form-group">
            <label htmlFor="name" className="wine-form-label">
              Wine Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="wine-form-input"
              required
              placeholder="e.g., Château Margaux"
            />
          </div>

          <div className="wine-form-group">
            <label htmlFor="year" className="wine-form-label">
              Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="wine-form-input"
              required
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
        </div>

        <div className="wine-form-group">
          <label htmlFor="region" className="wine-form-label">
            Region *
          </label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="wine-form-input"
            required
            placeholder="e.g., Bordeaux, France"
          />
        </div>

        <div className="wine-form-group">
          <label htmlFor="category" className="wine-form-label">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="wine-form-select"
            required
          >
            <option value="tried">Tried</option>
            <option value="wishlist">Wishlist</option>
            <option value="favorite">Favorite</option>
          </select>
        </div>
      </div>

      <div className="wine-form-section">
        <h3 className="wine-form-section-title">Rating</h3>
        <div className="wine-form-rating">
          {renderStars(formData.rating, (rating) =>
            setFormData((prev) => ({ ...prev, rating }))
          )}
          {formData.rating > 0 && (
            <span className="wine-form-rating-value">{formData.rating}/5</span>
          )}
        </div>
      </div>

      <div className="wine-form-section">
        <h3 className="wine-form-section-title">Tasting Notes</h3>
        <div className="wine-form-group">
          <textarea
            id="tastingNotes"
            name="tastingNotes"
            value={formData.tastingNotes}
            onChange={handleChange}
            className="wine-form-textarea"
            rows={4}
            placeholder="Describe the wine's aroma, flavor, body, and finish..."
          />
        </div>
      </div>

      <div className="wine-form-section">
        <h3 className="wine-form-section-title">Pairing Details</h3>
        <div className="wine-form-group">
          <input
            type="text"
            id="pairingDetails"
            name="pairingDetails"
            value={formData.pairingDetails}
            onChange={handleChange}
            className="wine-form-input"
            placeholder="e.g., Grilled steak, aged cheese, dark chocolate"
          />
        </div>
      </div>

      <div className="wine-form-section">
        <h3 className="wine-form-section-title">Bottle Image</h3>
        <div className="wine-form-image-upload">
          {imagePreview ? (
            <div className="wine-form-image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                className="wine-form-image-remove"
                onClick={() => {
                  setImagePreview(null)
                  setFormData((prev) => ({ ...prev, image: undefined }))
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <label htmlFor="image" className="wine-form-image-label">
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
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="wine-form-image-input"
          />
        </div>
      </div>

      <div className="wine-form-actions">
        {onCancel && (
          <button
            type="button"
            className="wine-form-btn wine-form-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="wine-form-btn wine-form-btn-submit">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default WineForm
