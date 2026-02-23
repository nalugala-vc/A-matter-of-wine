import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import { useNotifications } from '../hooks'
import './Notifications.css'

function Notifications() {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications()
  const navigate = useNavigate()

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'now'
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    return new Date(dateStr).toLocaleDateString()
  }

  const getNotificationText = (notif: typeof notifications[0]) => {
    switch (notif.type) {
      case 'like':
        return <><strong>{notif.actorUsername}</strong> liked your post</>
      case 'comment':
        return <><strong>{notif.actorUsername}</strong> commented on your post</>
      case 'follow':
        return <><strong>{notif.actorUsername}</strong> started following you</>
      case 'mention':
        return <><strong>{notif.actorUsername}</strong> mentioned you</>
      default:
        return <><strong>{notif.actorUsername}</strong> interacted with you</>
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '♥'
      case 'comment': return '💬'
      case 'follow': return '👤'
      case 'mention': return '@'
      default: return '🔔'
    }
  }

  const handleClick = (notif: typeof notifications[0]) => {
    if (!notif.isRead) {
      markAsRead(notif.id)
    }
    if (notif.type === 'follow' && notif.actorId) {
      navigate(`/profile/${notif.actorId}`)
    } else if (notif.targetId && notif.targetType === 'post') {
      navigate(`/feed`)
    }
  }

  const hasUnread = notifications.some(n => !n.isRead)

  return (
    <div className="notifications-page">
      <Navbar />
      <div className="notifications-container">
        <div className="notifications-header">
          <h1 className="notifications-title">Notifications</h1>
          {hasUnread && (
            <button className="notifications-mark-read" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="notifications-loading">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="notifications-empty">
            <h3>No notifications yet</h3>
            <p>When someone likes, comments, or follows you, it will show up here.</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`notification-item ${notif.isRead ? '' : 'unread'}`}
                onClick={() => handleClick(notif)}
              >
                <div className="notification-avatar">
                  {notif.actorAvatarUrl ? (
                    <img src={notif.actorAvatarUrl} alt={notif.actorUsername} />
                  ) : (
                    notif.actorUsername.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="notification-body">
                  <div className="notification-text">
                    {getNotificationText(notif)}
                  </div>
                  {notif.preview && (
                    <div className="notification-preview">"{notif.preview}"</div>
                  )}
                </div>
                <span className="notification-icon">{getNotificationIcon(notif.type)}</span>
                <span className="notification-time">{timeAgo(notif.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
