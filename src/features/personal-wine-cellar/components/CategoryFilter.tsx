import { WineCategory } from '../types'
import './CategoryFilter.css'

interface CategoryFilterProps {
  activeCategory: WineCategory | 'all'
  onCategoryChange: (category: WineCategory | 'all') => void
  counts: {
    all: number
    tried: number
    wishlist: number
    favorite: number
  }
}

function CategoryFilter({
  activeCategory,
  onCategoryChange,
  counts,
}: CategoryFilterProps) {
  const categories: Array<{ value: WineCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Wines' },
    { value: 'tried', label: 'Tried' },
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'favorite', label: 'Favorite' },
  ]

  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category.value}
          className={`category-filter-btn ${
            activeCategory === category.value ? 'active' : ''
          }`}
          onClick={() => onCategoryChange(category.value)}
        >
          <span className="category-filter-label">{category.label}</span>
          <span className="category-filter-count">
            {counts[category.value]}
          </span>
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
