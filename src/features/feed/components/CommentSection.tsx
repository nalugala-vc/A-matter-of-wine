import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useComments } from '../hooks'
import { useAuth } from '../../../contexts/AuthContext'
import './CommentSection.css'

interface CommentSectionProps {
  postId: string
}

function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const { comments, loading, addComment, removeComment, toggleCommentLike } = useComments(postId)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    await addComment(newComment.trim())
    setNewComment('')
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'now'
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>
  }

  return (
    <div className="comment-section">
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          className="comment-input"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={500}
        />
        <button
          className="comment-submit-btn"
          type="submit"
          disabled={!newComment.trim()}
        >
          Post
        </button>
      </form>

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar">
              {comment.authorAvatarUrl ? (
                <img src={comment.authorAvatarUrl} alt={comment.authorUsername} />
              ) : (
                comment.authorUsername.charAt(0).toUpperCase()
              )}
            </div>
            <div className="comment-body">
              <div className="comment-bubble">
                <span
                  className="comment-author"
                  onClick={() => navigate(`/profile/${comment.authorId}`)}
                >
                  {comment.authorUsername}
                </span>
                <div className="comment-text">{comment.content}</div>
              </div>
              <div className="comment-meta">
                <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                <button
                  className={`comment-like-btn ${comment.likedByMe ? 'liked' : ''}`}
                  onClick={() => toggleCommentLike(comment.id)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={comment.likedByMe ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
                </button>
                {user?.id === comment.authorId && (
                  <button
                    className="comment-delete-btn"
                    onClick={() => removeComment(comment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentSection
