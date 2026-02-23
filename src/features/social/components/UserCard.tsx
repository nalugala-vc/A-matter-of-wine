import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCard as UserCardType } from '../types'
import { followUser, unfollowUser } from '../services'
import { useAuth } from '../../../contexts/AuthContext'
import './UserCard.css'

interface UserCardProps {
  user: UserCardType
}

function UserCard({ user: initialUser }: UserCardProps) {
  const [userData, setUserData] = useState(initialUser)
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (userData.isFollowing) {
        const result = await unfollowUser(userData.id)
        setUserData(prev => ({
          ...prev,
          isFollowing: false,
          followersCount: result.followers_count,
        }))
      } else {
        const result = await followUser(userData.id)
        setUserData(prev => ({
          ...prev,
          isFollowing: true,
          followersCount: result.followers_count,
        }))
      }
    } catch {
      // Silently fail
    }
  }

  const isOwnProfile = currentUser?.id === userData.id

  return (
    <div className="user-card">
      <div className="user-card-avatar" onClick={() => navigate(`/profile/${userData.id}`)}>
        {userData.avatarUrl ? (
          <img src={userData.avatarUrl} alt={userData.username} />
        ) : (
          userData.username.charAt(0).toUpperCase()
        )}
      </div>
      <div className="user-card-info">
        <div className="user-card-name" onClick={() => navigate(`/profile/${userData.id}`)}>
          {userData.username}
        </div>
        {userData.bio && <div className="user-card-bio">{userData.bio}</div>}
        <div className="user-card-stats">
          {userData.followersCount} follower{userData.followersCount !== 1 ? 's' : ''}
        </div>
        {userData.winePreferences.length > 0 && (
          <div className="user-card-prefs">
            {userData.winePreferences.slice(0, 3).map(pref => (
              <span key={pref} className="user-card-pref-tag">{pref}</span>
            ))}
          </div>
        )}
      </div>
      {!isOwnProfile && (
        <button
          className={`follow-btn ${userData.isFollowing ? 'following' : 'follow'}`}
          onClick={handleToggleFollow}
        >
          {userData.isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  )
}

export default UserCard
