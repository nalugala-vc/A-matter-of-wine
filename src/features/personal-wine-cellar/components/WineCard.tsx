import { Wine } from '../types'
import './WineCard.css'

interface WineCardProps {
  wine: Wine
  onClick?: (wine: Wine) => void
}

function WineCard({ wine, onClick }: WineCardProps) {
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`star ${i < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ))
  }

  return (
    <div className="wine-card" onClick={() => onClick?.(wine)}>
      <div className="wine-card-image-wrapper">
        {wine.imageUrl ? (
          <img src={wine.imageUrl} alt={wine.name} className="wine-card-image" />
        ) : (
          <div className="wine-card-placeholder">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
        )}
        <div className="wine-card-category-badge">
          {getCategoryLabel(wine.category)}
        </div>
      </div>

      <div className="wine-card-content">
        <div className="wine-card-header">
          <h3 className="wine-card-name">{wine.name}</h3>
          <div className="wine-card-rating">{renderStars(wine.rating)}</div>
        </div>

        <div className="wine-card-meta">
          <span className="wine-card-year">{wine.year}</span>
          <span className="wine-card-separator">•</span>
          <span className="wine-card-region">{wine.region}</span>
        </div>

        {wine.tastingNotes && (
          <p className="wine-card-notes">{wine.tastingNotes}</p>
        )}

        {wine.pairingDetails && (
          <div className="wine-card-pairing">
            <span className="wine-card-pairing-label">Pairs with:</span>
            <span className="wine-card-pairing-text">{wine.pairingDetails}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default WineCard
