import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import PostCard from '../../feed/components/PostCard'
import UserCard from '../components/UserCard'
import { useProfile, useFollowList, usePublicCellar } from '../hooks'
import { useFeed } from '../../feed/hooks'
import { useAuth } from '../../../contexts/AuthContext'
import './Profile.css'

function Profile() {
  const { userId } = useParams<{ userId: string }>()
  const { user: currentUser } = useAuth()
  const { profile, loading, toggleFollow } = useProfile(userId || null)
  const { posts, toggleLike, removePost } = useFeed('explore')
  const { wines } = usePublicCellar(userId || null)
  const [activeTab, setActiveTab] = useState<'posts' | 'cellar'>('posts')
  const [followModal, setFollowModal] = useState<'followers' | 'following' | null>(null)
  const { users: followUsers, loading: followLoading } = useFollowList(
    followModal ? (userId || null) : null,
    followModal || 'followers'
  )

  const isOwnProfile = currentUser?.id === userId

  const userPosts = posts.filter(p => p.authorId === userId)

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div className="profile-loading">User not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div
            className="profile-cover"
            style={profile.coverImageUrl ? { backgroundImage: `url(${profile.coverImageUrl})` } : undefined}
          />
          <div className="profile-info">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.username} />
                ) : (
                  profile.username.charAt(0).toUpperCase()
                )}
              </div>
              <div className="profile-actions">
                {isOwnProfile ? (
                  <button className="profile-edit-btn">Edit Profile</button>
                ) : (
                  <button
                    className={`profile-follow-btn ${profile.isFollowing ? 'following' : 'follow'}`}
                    onClick={toggleFollow}
                  >
                    {profile.isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            <h1 className="profile-name">{profile.username}</h1>
            {profile.location && (
              <div className="profile-location">{profile.location}</div>
            )}
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}

            {profile.winePreferences.length > 0 && (
              <div className="profile-prefs">
                {profile.winePreferences.map(pref => (
                  <span key={pref} className="profile-pref-tag">{pref}</span>
                ))}
              </div>
            )}

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-count">{profile.postsCount}</span>
                <span className="stat-label">posts</span>
              </div>
              <div className="profile-stat" onClick={() => setFollowModal('followers')}>
                <span className="stat-count">{profile.followersCount}</span>
                <span className="stat-label">followers</span>
              </div>
              <div className="profile-stat" onClick={() => setFollowModal('following')}>
                <span className="stat-count">{profile.followingCount}</span>
                <span className="stat-label">following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`profile-tab ${activeTab === 'cellar' ? 'active' : ''}`}
            onClick={() => setActiveTab('cellar')}
          >
            Wine Cellar
          </button>
        </div>

        {activeTab === 'posts' && (
          userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onDelete={isOwnProfile ? removePost : undefined}
              />
            ))
          ) : (
            <div className="profile-section-empty">No posts yet</div>
          )
        )}

        {activeTab === 'cellar' && (
          wines.length > 0 ? (
            <div className="public-cellar-grid">
              {wines.map(wine => (
                <div key={wine.id} className="public-wine-card">
                  {wine.imageUrl && (
                    <img className="public-wine-image" src={wine.imageUrl} alt={wine.name} />
                  )}
                  <div className="public-wine-name">{wine.name}</div>
                  <div className="public-wine-meta">{wine.region} &middot; {wine.year}</div>
                  <div className="public-wine-rating">
                    {'★'.repeat(wine.rating)}{'☆'.repeat(5 - wine.rating)}
                  </div>
                  <span className="public-wine-category">{wine.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="profile-section-empty">
              {isOwnProfile ? 'Make some wines public to show them here' : 'No public wines'}
            </div>
          )
        )}
      </div>

      {/* Follow Modal */}
      {followModal && (
        <div className="follow-modal-overlay" onClick={() => setFollowModal(null)}>
          <div className="follow-modal" onClick={e => e.stopPropagation()}>
            <div className="follow-modal-header">
              <h3>{followModal === 'followers' ? 'Followers' : 'Following'}</h3>
              <button className="follow-modal-close" onClick={() => setFollowModal(null)}>&times;</button>
            </div>
            <div className="follow-modal-list">
              {followLoading ? (
                <div className="profile-section-empty">Loading...</div>
              ) : followUsers.length > 0 ? (
                followUsers.map(u => <UserCard key={u.id} user={u} />)
              ) : (
                <div className="profile-section-empty">
                  {followModal === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
