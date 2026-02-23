import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { useAdminAuth } from '../hooks/useAdminAuth'
import './AdminLayout.css'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoading, isAdmin } = useAdminAuth()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="admin-layout-loading">
        <div className="admin-layout-spinner" />
        <p>Verifying admin access...</p>
      </div>
    )
  }

  // If not admin, useAdminAuth will redirect - show nothing
  if (!isAdmin) {
    return null
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <header className="admin-header">
          <button
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="admin-header-right">
            <div className="admin-header-user">
              <div className="admin-header-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="admin-header-username">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
