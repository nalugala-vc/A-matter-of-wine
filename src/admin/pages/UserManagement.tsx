import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import ConfirmModal from '../components/ConfirmModal'
import { getUsers, updateUser } from '../services/adminApi'
import { AdminUser, AdminUserListResponse } from '../types'
import './UserManagement.css'

function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [modalAction, setModalAction] = useState<'ban' | 'unban' | 'promote' | 'demote' | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [searchQuery, roleFilter])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data: AdminUserListResponse = await getUsers({
        search: searchQuery || undefined,
        role: roleFilter || undefined,
      })
      setUsers(data.users)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedUser || !modalAction) return

    setActionLoading(true)
    try {
      let updateData: { role?: 'user' | 'admin'; is_banned?: boolean } = {}

      switch (modalAction) {
        case 'ban':
          updateData = { is_banned: true }
          break
        case 'unban':
          updateData = { is_banned: false }
          break
        case 'promote':
          updateData = { role: 'admin' }
          break
        case 'demote':
          updateData = { role: 'user' }
          break
      }

      await updateUser(selectedUser.id, updateData)

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, ...updateData } : u
        )
      )
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setActionLoading(false)
      setSelectedUser(null)
      setModalAction(null)
    }
  }

  const getModalConfig = () => {
    switch (modalAction) {
      case 'ban':
        return {
          title: 'Ban User',
          message: `Are you sure you want to ban ${selectedUser?.username}? They will no longer be able to access the platform.`,
          confirmLabel: 'Ban User',
        }
      case 'unban':
        return {
          title: 'Unban User',
          message: `Are you sure you want to unban ${selectedUser?.username}? They will regain access to the platform.`,
          confirmLabel: 'Unban User',
        }
      case 'promote':
        return {
          title: 'Promote to Admin',
          message: `Are you sure you want to promote ${selectedUser?.username} to admin? They will have full administrative access.`,
          confirmLabel: 'Promote',
        }
      case 'demote':
        return {
          title: 'Demote to User',
          message: `Are you sure you want to demote ${selectedUser?.username} to a regular user? They will lose administrative access.`,
          confirmLabel: 'Demote',
        }
      default:
        return { title: '', message: '', confirmLabel: '' }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const columns = [
    {
      key: 'username' as const,
      header: 'User',
      render: (user: AdminUser) => (
        <div className="user-cell">
          <div className="user-avatar">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="user-info">
            <p className="user-name">{user.username}</p>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role' as const,
      header: 'Role',
      width: '100px',
      render: (user: AdminUser) => (
        <span className={`role-badge role-${user.role}`}>{user.role}</span>
      ),
    },
    {
      key: 'is_banned' as const,
      header: 'Status',
      width: '100px',
      render: (user: AdminUser) => (
        <span className={`status-badge ${user.is_banned ? 'banned' : 'active'}`}>
          {user.is_banned ? 'Banned' : 'Active'}
        </span>
      ),
    },
    {
      key: 'created_at' as const,
      header: 'Joined',
      width: '120px',
      render: (user: AdminUser) => formatDate(user.created_at),
    },
    {
      key: 'actions' as const,
      header: 'Actions',
      width: '180px',
      render: (user: AdminUser) => (
        <div className="user-actions">
          {user.is_banned ? (
            <button
              className="action-btn action-btn-unban"
              onClick={() => {
                setSelectedUser(user)
                setModalAction('unban')
              }}
            >
              Unban
            </button>
          ) : (
            <button
              className="action-btn action-btn-ban"
              onClick={() => {
                setSelectedUser(user)
                setModalAction('ban')
              }}
            >
              Ban
            </button>
          )}
          {user.role === 'user' ? (
            <button
              className="action-btn action-btn-promote"
              onClick={() => {
                setSelectedUser(user)
                setModalAction('promote')
              }}
            >
              Promote
            </button>
          ) : (
            <button
              className="action-btn action-btn-demote"
              onClick={() => {
                setSelectedUser(user)
                setModalAction('demote')
              }}
            >
              Demote
            </button>
          )}
        </div>
      ),
    },
  ]

  const modalConfig = getModalConfig()

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>User Management</h1>
        <p>Manage users, roles, and account statuses</p>
      </div>

      <div className="user-management-filters">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {error ? (
        <div className="admin-error-message">
          <p>{error}</p>
          <button onClick={fetchUsers}>Retry</button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="No users found"
        />
      )}

      <ConfirmModal
        isOpen={!!modalAction && !!selectedUser}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        confirmVariant={modalAction === 'ban' ? 'danger' : 'primary'}
        onConfirm={handleAction}
        onCancel={() => {
          setSelectedUser(null)
          setModalAction(null)
        }}
        loading={actionLoading}
      />
    </div>
  )
}

export default UserManagement
