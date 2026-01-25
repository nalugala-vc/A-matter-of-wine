import { Wine } from '../types'
import WineCard from './WineCard'
import './WineGrid.css'

interface WineGridProps {
  wines: Wine[]
  emptyMessage?: string
  onWineClick?: (wine: Wine) => void
}

function WineGrid({
  wines,
  emptyMessage = 'No wines found. Start building your collection!',
  onWineClick,
}: WineGridProps) {
  if (wines.length === 0) {
    return (
      <div className="wine-grid-empty">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v20M2 12h20" />
        </svg>
        <p className="wine-grid-empty-text">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="wine-grid">
      {wines.map((wine) => (
        <WineCard
          key={wine.id}
          wine={wine}
          onClick={onWineClick}
        />
      ))}
    </div>
  )
}

export default WineGrid
