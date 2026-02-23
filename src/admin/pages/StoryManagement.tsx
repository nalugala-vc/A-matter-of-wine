import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import ConfirmModal from '../components/ConfirmModal'
import { getAdminStories, toggleStoryPublished, deleteStory, createStory } from '../services/adminApi'
import { AdminStory, AdminStoryListResponse } from '../types'
import './StoryManagement.css'

interface CreateStoryForm {
  title: string
  description: string
  content: string
  image_url: string
  read_time: string
  date: string
  publishImmediately: boolean
}

const initialStoryForm: CreateStoryForm = {
  title: '',
  description: '',
  content: '',
  image_url: '',
  read_time: '',
  date: '',
  publishImmediately: true,
}

function StoryManagement() {
  const [stories, setStories] = useState<AdminStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [publishedFilter, setPublishedFilter] = useState<string>('')
  const [selectedStory, setSelectedStory] = useState<AdminStory | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState<CreateStoryForm>(initialStoryForm)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    fetchStories()
  }, [searchQuery, publishedFilter])

  const fetchStories = async () => {
    setLoading(true)
    setError(null)
    try {
      const data: AdminStoryListResponse = await getAdminStories({
        search: searchQuery || undefined,
        published: publishedFilter === '' ? undefined : publishedFilter === 'true',
      })
      setStories(data.stories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stories')
      setStories([])
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublished = async (story: AdminStory) => {
    try {
      await toggleStoryPublished(story.id)
      setStories((prev) =>
        prev.map((s) =>
          s.id === story.id ? { ...s, is_published: !s.is_published } : s
        )
      )
    } catch (error) {
      console.error('Failed to toggle published:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedStory) return

    setActionLoading(true)
    try {
      await deleteStory(selectedStory.id)
      setStories((prev) => prev.filter((s) => s.id !== selectedStory.id))
    } catch (error) {
      console.error('Failed to delete story:', error)
    } finally {
      setActionLoading(false)
      setShowDeleteModal(false)
      setSelectedStory(null)
    }
  }

  const handleCreateFormChange = (field: keyof CreateStoryForm, value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError(null)

    try {
      const newStory = await createStory({
        title: createForm.title,
        description: createForm.description,
        content: createForm.content,
        image_url: createForm.image_url,
        read_time: createForm.read_time,
        date: createForm.date,
      })

      // If "Publish immediately" is checked, publish the story right after creation
      if (createForm.publishImmediately && newStory?.id) {
        await toggleStoryPublished(newStory.id)
      }

      setShowCreateModal(false)
      setCreateForm(initialStoryForm)
      fetchStories()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create story')
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

  const columns = [
    {
      key: 'title' as const,
      header: 'Story',
      render: (story: AdminStory) => (
        <div className="story-cell">
          <div className="story-image">
            {story.image_url ? (
              <img src={story.image_url} alt={story.title} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            )}
          </div>
          <div className="story-info">
            <p className="story-title">{story.title}</p>
            <p className="story-author">by {story.author_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date' as const,
      header: 'Date',
      width: '120px',
      render: (story: AdminStory) => formatDate(story.date),
    },
    {
      key: 'read_time' as const,
      header: 'Read Time',
      width: '100px',
    },
    {
      key: 'is_published' as const,
      header: 'Status',
      width: '120px',
      render: (story: AdminStory) => (
        <button
          className={`published-toggle ${story.is_published ? 'published' : 'draft'}`}
          onClick={() => handleTogglePublished(story)}
        >
          {story.is_published ? 'Published' : 'Draft'}
        </button>
      ),
    },
    {
      key: 'actions' as const,
      header: 'Actions',
      width: '120px',
      render: (story: AdminStory) => (
        <div className="story-actions">
          <button className="action-btn action-btn-edit">Edit</button>
          <button
            className="action-btn action-btn-delete"
            onClick={() => {
              setSelectedStory(story)
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
    <div className="story-management">
      <div className="story-management-header">
        <div>
          <h1>Story Management</h1>
          <p>Create and manage wine stories and articles</p>
        </div>
        <button className="create-btn" onClick={() => setShowCreateModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Story
        </button>
      </div>

      <div className="story-management-filters">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Stories</option>
          <option value="true">Published</option>
          <option value="false">Drafts</option>
        </select>
      </div>

      {error ? (
        <div className="admin-error-message">
          <p>{error}</p>
          <button onClick={fetchStories}>Retry</button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={stories}
          loading={loading}
          emptyMessage="No stories found"
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Story"
        message={`Are you sure you want to delete "${selectedStory?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedStory(null)
        }}
        loading={actionLoading}
      />

      {showCreateModal && (
        <div className="form-modal-overlay" onClick={() => { setShowCreateModal(false); setCreateError(null) }}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal-header">
              <h2>Create Story</h2>
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

            <form onSubmit={handleCreateStory} className="form-modal-body">
              <div className="form-group">
                <label htmlFor="story-title">Title *</label>
                <input
                  id="story-title"
                  type="text"
                  value={createForm.title}
                  onChange={(e) => handleCreateFormChange('title', e.target.value)}
                  placeholder="Story title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="story-description">Description *</label>
                <textarea
                  id="story-description"
                  value={createForm.description}
                  onChange={(e) => handleCreateFormChange('description', e.target.value)}
                  placeholder="Brief description of the story..."
                  rows={2}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="story-content">Content *</label>
                <textarea
                  id="story-content"
                  value={createForm.content}
                  onChange={(e) => handleCreateFormChange('content', e.target.value)}
                  placeholder="Write the full story content..."
                  rows={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="story-image-url">Image URL</label>
                <input
                  id="story-image-url"
                  type="url"
                  value={createForm.image_url}
                  onChange={(e) => handleCreateFormChange('image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="story-read-time">Read Time *</label>
                  <input
                    id="story-read-time"
                    type="text"
                    value={createForm.read_time}
                    onChange={(e) => handleCreateFormChange('read_time', e.target.value)}
                    placeholder="e.g. 5 min read"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="story-date">Date *</label>
                  <input
                    id="story-date"
                    type="date"
                    value={createForm.date}
                    onChange={(e) => handleCreateFormChange('date', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group form-group-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={createForm.publishImmediately}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, publishImmediately: e.target.checked }))}
                  />
                  <span>Publish immediately</span>
                </label>
                <p className="form-hint">If unchecked, the story will be saved as a draft and won't be visible to users until published.</p>
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
                  {createLoading ? 'Creating...' : createForm.publishImmediately ? 'Create & Publish' : 'Save as Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoryManagement
