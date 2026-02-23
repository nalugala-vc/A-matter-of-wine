import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Post } from '../types'
import { useAuth } from '../../../contexts/AuthContext'
import CommentSection from './CommentSection'
import './PostCard.css'

interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onDelete?: (postId: string) => void
}

function PostCard({ post, onLike, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-avatar">
          {post.authorAvatarUrl ? (
            <img src={post.authorAvatarUrl} alt={post.authorUsername} />
          ) : (
            post.authorUsername.charAt(0).toUpperCase()
          )}
        </div>
        <div className="post-author-info">
          <div
            className="post-author-name"
            onClick={() => navigate(`/profile/${post.authorId}`)}
          >
            {post.authorUsername}
          </div>
          <div className="post-timestamp">{timeAgo(post.createdAt)}</div>
        </div>
        {post.postType !== 'text' && (
          <span className={`post-type-badge ${post.postType}`}>
            {post.postType === 'check_in' && 'Check-in'}
            {post.postType === 'review' && 'Review'}
            {post.postType === 'cellar_share' && 'Cellar'}
          </span>
        )}
        {user?.id === post.authorId && onDelete && (
          <button className="post-delete-btn" onClick={() => onDelete(post.id)} title="Delete post">
            &times;
          </button>
        )}
      </div>

      <div className="post-content">{post.content}</div>

      {post.wineTag && (
        <div className="post-wine-tag">
          <span className="wine-tag-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 22h8" />
              <path d="M7 10h10" />
              <path d="M12 15v7" />
              <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z" />
            </svg>
          </span>
          <div className="wine-tag-info">
            <h4>{post.wineTag.name} {post.wineTag.year && `(${post.wineTag.year})`}</h4>
            {post.wineTag.region && <span className="wine-tag-meta">{post.wineTag.region}</span>}
          </div>
          {post.wineTag.rating && (
            <span className="wine-tag-rating">{renderStars(post.wineTag.rating)}</span>
          )}
        </div>
      )}

      {post.images.length > 0 && (
        <div className={`post-images count-${Math.min(post.images.length, 4)}`}>
          {post.images.slice(0, 4).map((url, i) => (
            <img key={i} src={url} alt={`Post image ${i + 1}`} />
          ))}
        </div>
      )}

      <div className="post-actions">
        <button
          className={`post-action-btn ${post.likedByMe ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={post.likedByMe ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {post.likesCount > 0 && <span>{post.likesCount}</span>}
        </button>
        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post.commentsCount > 0 && <span>{post.commentsCount}</span>}
        </button>
      </div>

      {showComments && <CommentSection postId={post.id} />}
    </div>
  )
}

export default PostCard
