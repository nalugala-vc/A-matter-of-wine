import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import ConfirmModal from '../components/ConfirmModal'
import { getAdminEvents, toggleEventFeatured, deleteEvent, createEvent, uploadEventImage } from '../services/adminApi'
import { AdminEvent, AdminEventListResponse } from '../types'
import './EventManagement.css'

interface CreateEventForm {
  title: string
  description: string
  location: string
  date: string
  start_time: string
  end_time: string
  price: string
  category: string
  max_attendees: string
  image: File | null
}

const initialEventForm: CreateEventForm = {
  title: '',
  description: '',
  location: '',
  date: '',
  start_time: '',
  end_time: '',
  price: '',
  category: '',
  max_attendees: '',
  image: null,
}

function EventManagement() {
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState<string>('')
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState<CreateEventForm>(initialEventForm)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [searchQuery, featuredFilter])

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const data: AdminEventListResponse = await getAdminEvents({
        search: searchQuery || undefined,
        featured: featuredFilter === '' ? undefined : featuredFilter === 'true',
      })
      setEvents(data.events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatured = async (event: AdminEvent) => {
    try {
      await toggleEventFeatured(event.id)
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, is_featured: !e.is_featured } : e
        )
      )
    } catch (error) {
      console.error('Failed to toggle featured:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedEvent) return

    setActionLoading(true)
    try {
      await deleteEvent(selectedEvent.id)
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id))
    } catch (error) {
      console.error('Failed to delete event:', error)
    } finally {
      setActionLoading(false)
      setShowDeleteModal(false)
      setSelectedEvent(null)
    }
  }

  const handleCreateFormChange = (field: keyof CreateEventForm, value: string | File | null) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError(null)

    try {
      const priceValue: number | 'Free' =
        createForm.price === '' || createForm.price.toLowerCase() === 'free'
          ? 'Free'
          : parseFloat(createForm.price)

      const newEvent = await createEvent({
        title: createForm.title,
        description: createForm.description,
        location: createForm.location,
        date: createForm.date,
        start_time: createForm.start_time,
        end_time: createForm.end_time,
        price: priceValue,
        category: createForm.category || undefined,
        max_attendees: createForm.max_attendees ? parseInt(createForm.max_attendees) : undefined,
      })

      if (createForm.image && newEvent.id) {
        try {
          await uploadEventImage(newEvent.id, createForm.image)
        } catch {
          // Image upload failed but event was created
          console.error('Image upload failed')
        }
      }

      setShowCreateModal(false)
      setCreateForm(initialEventForm)
      fetchEvents()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create event')
    } finally {
      setCreateLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatPrice = (price: number | 'Free') => {
    if (price === 'Free') return 'Free'
    return `$${price}`
  }

  const columns = [
    {
      key: 'title' as const,
      header: 'Event',
      render: (event: AdminEvent) => (
        <div className="event-cell">
          <div className="event-image">
            {event.image_url ? (
              <img src={event.image_url} alt={event.title} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            )}
          </div>
          <div className="event-info">
            <p className="event-title">{event.title}</p>
            <p className="event-location">{event.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date' as const,
      header: 'Date',
      width: '120px',
      render: (event: AdminEvent) => formatDate(event.date),
    },
    {
      key: 'price' as const,
      header: 'Price',
      width: '80px',
      render: (event: AdminEvent) => formatPrice(event.price),
    },
    {
      key: 'attendee_count' as const,
      header: 'Attendees',
      width: '100px',
      render: (event: AdminEvent) => (
        <span>
          {event.attendee_count}
          {event.max_attendees && `/${event.max_attendees}`}
        </span>
      ),
    },
    {
      key: 'is_featured' as const,
      header: 'Featured',
      width: '100px',
      render: (event: AdminEvent) => (
        <button
          className={`featured-toggle ${event.is_featured ? 'active' : ''}`}
          onClick={() => handleToggleFeatured(event)}
        >
          {event.is_featured ? 'Yes' : 'No'}
        </button>
      ),
    },
    {
      key: 'actions' as const,
      header: 'Actions',
      width: '120px',
      render: (event: AdminEvent) => (
        <div className="event-actions">
          <button className="action-btn action-btn-edit">Edit</button>
          <button
            className="action-btn action-btn-delete"
            onClick={() => {
              setSelectedEvent(event)
              setShowDeleteModal(true)
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="event-management">
      <div className="event-management-header">
        <div>
          <h1>Event Management</h1>
          <p>Create and manage wine events</p>
        </div>
        <button className="create-btn" onClick={() => setShowCreateModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Event
        </button>
      </div>

      <div className="event-management-filters">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Events</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>
      </div>

      {error ? (
        <div className="admin-error-message">
          <p>{error}</p>
          <button onClick={fetchEvents}>Retry</button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={events}
          loading={loading}
          emptyMessage="No events found"
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Event"
        message={`Are you sure you want to delete "${selectedEvent?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedEvent(null)
        }}
        loading={actionLoading}
      />

      {showCreateModal && (
        <div className="form-modal-overlay" onClick={() => { setShowCreateModal(false); setCreateError(null) }}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal-header">
              <h2>Create Event</h2>
              <button
                className="form-modal-close"
                onClick={() => { setShowCreateModal(false); setCreateError(null) }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {createError && (
              <div className="form-modal-error">{createError}</div>
            )}

            <form onSubmit={handleCreateEvent} className="form-modal-body">
              <div className="form-group">
                <label htmlFor="event-title">Title *</label>
                <input
                  id="event-title"
                  type="text"
                  value={createForm.title}
                  onChange={(e) => handleCreateFormChange('title', e.target.value)}
                  placeholder="Event title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="event-description">Description *</label>
                <textarea
                  id="event-description"
                  value={createForm.description}
                  onChange={(e) => handleCreateFormChange('description', e.target.value)}
                  placeholder="Describe the event..."
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="event-location">Location *</label>
                <input
                  id="event-location"
                  type="text"
                  value={createForm.location}
                  onChange={(e) => handleCreateFormChange('location', e.target.value)}
                  placeholder="Event location"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="event-date">Date *</label>
                  <input
                    id="event-date"
                    type="date"
                    value={createForm.date}
                    onChange={(e) => handleCreateFormChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="event-start-time">Start Time *</label>
                  <input
                    id="event-start-time"
                    type="time"
                    value={createForm.start_time}
                    onChange={(e) => handleCreateFormChange('start_time', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="event-end-time">End Time *</label>
                  <input
                    id="event-end-time"
                    type="time"
                    value={createForm.end_time}
                    onChange={(e) => handleCreateFormChange('end_time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="event-price">Price</label>
                  <input
                    id="event-price"
                    type="text"
                    value={createForm.price}
                    onChange={(e) => handleCreateFormChange('price', e.target.value)}
                    placeholder='e.g. 25 or "Free"'
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="event-category">Category</label>
                  <input
                    id="event-category"
                    type="text"
                    value={createForm.category}
                    onChange={(e) => handleCreateFormChange('category', e.target.value)}
                    placeholder="e.g. Tasting, Workshop"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="event-max-attendees">Max Attendees</label>
                  <input
                    id="event-max-attendees"
                    type="number"
                    value={createForm.max_attendees}
                    onChange={(e) => handleCreateFormChange('max_attendees', e.target.value)}
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="event-image">Event Image</label>
                <input
                  id="event-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCreateFormChange('image', e.target.files?.[0] || null)}
                  className="file-input"
                />
              </div>

              <div className="form-modal-actions">
                <button
                  type="button"
                  className="form-modal-btn form-modal-cancel"
                  onClick={() => { setShowCreateModal(false); setCreateError(null) }}
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="form-modal-btn form-modal-submit"
                  disabled={createLoading}
                >
                  {createLoading ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventManagement
