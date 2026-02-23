import { useState, useRef } from 'react'
import { PostType, WineTag } from '../types'
import { useAuth } from '../../../contexts/AuthContext'
import { CreatePostData } from '../services'
import './PostComposer.css'

interface PostComposerProps {
  onSubmit: (data: CreatePostData, images?: File[]) => Promise<void>
}

function PostComposer({ onSubmit }: PostComposerProps) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState<PostType>('text')
  const [wineTag, setWineTag] = useState<WineTag>({ name: '' })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showWineTag = postType === 'check_in' || postType === 'review'

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = 4 - images.length
    const toAdd = files.slice(0, remaining)

    setImages(prev => [...prev, ...toAdd])
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreviews(prev => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return
    setSubmitting(true)

    try {
      const data: CreatePostData = {
        content: content.trim(),
        postType,
      }
      if (showWineTag && wineTag.name.trim()) {
        data.wineTag = {
          name: wineTag.name,
          year: wineTag.year || undefined,
          region: wineTag.region || undefined,
          rating: wineTag.rating || undefined,
        }
      }
      await onSubmit(data, images.length > 0 ? images : undefined)

      // Reset form
      setContent('')
      setPostType('text')
      setWineTag({ name: '' })
      setImages([])
      setImagePreviews([])
    } finally {
      setSubmitting(false)
    }
  }

  const charCount = content.length
  const charClass = charCount > 1900 ? 'at-limit' : charCount > 1500 ? 'near-limit' : ''

  return (
    <div className="post-composer">
      <div className="composer-header">
        <div className="composer-avatar">
          {user?.image ? (
            <img src={user.image} alt={user.name} />
          ) : (
            user?.name?.charAt(0).toUpperCase() || '?'
          )}
        </div>
        <span style={{ color: '#8a8478', fontSize: '14px' }}>What&apos;s on your wine mind?</span>
      </div>

      <textarea
        className="composer-textarea"
        placeholder="Share a tasting note, review, or moment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
      />
      <div className={`composer-char-count ${charClass}`}>{charCount}/2000</div>

      <div className="composer-type-selector">
        {(['text', 'check_in', 'review', 'cellar_share'] as PostType[]).map(type => (
          <button
            key={type}
            className={`type-option ${postType === type ? 'active' : ''}`}
            onClick={() => setPostType(type)}
          >
            {type === 'text' && 'Post'}
            {type === 'check_in' && 'Check-in'}
            {type === 'review' && 'Review'}
            {type === 'cellar_share' && 'Share Cellar'}
          </button>
        ))}
      </div>

      {showWineTag && (
        <div className="composer-wine-tag">
          <h4>Wine Details</h4>
          <div className="wine-tag-inputs">
            <input
              placeholder="Wine name *"
              value={wineTag.name}
              onChange={(e) => setWineTag(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              placeholder="Year"
              type="number"
              value={wineTag.year || ''}
              onChange={(e) => setWineTag(prev => ({ ...prev, year: e.target.value ? parseInt(e.target.value) : undefined }))}
            />
            <input
              placeholder="Region"
              value={wineTag.region || ''}
              onChange={(e) => setWineTag(prev => ({ ...prev, region: e.target.value }))}
            />
            <select
              value={wineTag.rating || ''}
              onChange={(e) => setWineTag(prev => ({ ...prev, rating: e.target.value ? parseInt(e.target.value) : undefined }))}
            >
              <option value="">Rating</option>
              {[1, 2, 3, 4, 5].map(r => (
                <option key={r} value={r}>{'★'.repeat(r)}{'☆'.repeat(5 - r)}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {imagePreviews.length > 0 && (
        <div className="composer-image-preview">
          {imagePreviews.map((src, i) => (
            <div key={i} className="image-preview-item">
              <img src={src} alt={`Preview ${i + 1}`} />
              <button className="image-preview-remove" onClick={() => removeImage(i)}>
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="composer-footer">
        <div className="composer-tools">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageAdd}
            style={{ display: 'none' }}
          />
          <button
            className="composer-tool-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 4}
          >
            📷 Photo {images.length > 0 && `(${images.length}/4)`}
          </button>
        </div>
        <button
          className="composer-submit-btn"
          onClick={handleSubmit}
          disabled={!content.trim() || submitting}
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}

export default PostComposer
