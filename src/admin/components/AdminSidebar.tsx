import { Link, useLocation } from 'react-router-dom'
import './AdminSidebar.css'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation()

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/users', label: 'Users', icon: 'users' },
    { path: '/admin/events', label: 'Events', icon: 'events' },
    { path: '/admin/tickets/scan', label: 'Ticket Scanner', icon: 'tickets' },
    { path: '/admin/stories', label: 'Stories', icon: 'stories' },
    { path: '/admin/invite', label: 'Invite Admin', icon: 'invite' },
  ]

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'dashboard':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        )
      case 'users':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )
      case 'events':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )
      case 'stories':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        )
      case 'tickets':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="3" height="3" />
            <rect x="18" y="14" width="3" height="3" />
            <rect x="14" y="18" width="3" height="3" />
            <rect x="18" y="18" width="3" height="3" />
          </svg>
        )
      case 'invite':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <>
      {isOpen && <div className="admin-sidebar-overlay" onClick={onClose} />}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-logo">
            <h2>Ethnovino</h2>
            <span className="admin-badge">Admin</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={onClose}
            >
              {getIcon(item.icon)}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-divider" />
          <Link to="/" className="admin-sidebar-link admin-sidebar-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
