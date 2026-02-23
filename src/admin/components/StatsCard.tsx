import './StatsCard.css'

interface StatsCardProps {
  title: string
  value: number | string
  icon: 'users' | 'wines' | 'events' | 'stories' | 'conversations'
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'users':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )
      case 'wines':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 22h8M12 11v11M6 2L4 6c0 2.2 3.6 4 8 4s8-1.8 8-4l-2-4H6z" />
          </svg>
        )
      case 'events':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )
      case 'stories':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )
      case 'conversations':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )
    }
  }

  return (
    <div className="stats-card">
      <div className="stats-card-icon">{getIcon()}</div>
      <div className="stats-card-content">
        <h3 className="stats-card-title">{title}</h3>
        <p className="stats-card-value">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {trend && (
          <p className={`stats-card-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
    </div>
  )
}

export default StatsCard
