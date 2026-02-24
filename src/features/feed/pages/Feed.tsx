import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import PostComposer from '../components/PostComposer'
import PostCard from '../components/PostCard'
import { useFeed } from '../hooks'
import './Feed.css'

function Feed() {
  const [mode, setMode] = useState<'feed' | 'explore'>('feed')
  const { posts, loading, hasMore, loadMore, addPost, removePost, toggleLike } = useFeed(mode)

  return (
    <div className="feed-page">
      <Navbar />
      <div className="feed-container">
        <div className="feed-tabs">
          <button
            className={`feed-tab ${mode === 'feed' ? 'active' : ''}`}
            onClick={() => setMode('feed')}
          >
            Following
          </button>
          <button
            className={`feed-tab ${mode === 'explore' ? 'active' : ''}`}
            onClick={() => setMode('explore')}
          >
            Explore
          </button>
        </div>

        <PostComposer onSubmit={async (data, images) => { await addPost(data, images) }} />

        {loading && posts.length === 0 ? (
          <div className="feed-loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="feed-empty">
            <h3>{mode === 'feed' ? 'Your feed is empty' : 'No posts yet'}</h3>
            <p>
              {mode === 'feed'
                ? 'Follow other wine enthusiasts to see their posts here, or switch to Explore to discover the community.'
                : 'Be the first to share something with the community!'}
            </p>
            {mode === 'feed' && (
              <Link to="/explore" className="feed-empty-btn">
                Discover People
              </Link>
            )}
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onDelete={removePost}
              />
            ))}
            {hasMore && (
              <button className="feed-load-more" onClick={loadMore}>
                {loading ? 'Loading...' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Feed
