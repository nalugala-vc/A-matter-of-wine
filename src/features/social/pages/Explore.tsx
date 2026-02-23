import Navbar from '../../../components/Navbar'
import UserCard from '../components/UserCard'
import { useUserSearch, useDiscover } from '../hooks'
import './Explore.css'

function Explore() {
  const { users: searchResults, query, setQuery, loading: searchLoading } = useUserSearch()
  const { users: suggested, loading: discoverLoading } = useDiscover()

  const isSearching = query.trim().length > 0

  return (
    <div className="explore-page">
      <Navbar />
      <div className="explore-container">
        <div className="explore-search-section">
          <div className="explore-search-wrapper">
            <span className="explore-search-icon">🔍</span>
            <input
              className="explore-search-input"
              placeholder="Search people by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {isSearching ? (
          <div className="explore-section">
            <div className="explore-section-header">
              <h2 className="explore-section-title">Search Results</h2>
            </div>
            {searchLoading ? (
              <div className="explore-loading">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="explore-user-grid">
                {searchResults.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="explore-empty">
                <h3>No users found</h3>
                <p>Try a different search term</p>
              </div>
            )}
          </div>
        ) : (
          <div className="explore-section">
            <div className="explore-section-header">
              <h2 className="explore-section-title">Suggested for You</h2>
            </div>
            {discoverLoading ? (
              <div className="explore-loading">Loading suggestions...</div>
            ) : suggested.length > 0 ? (
              <div className="explore-user-grid">
                {suggested.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="explore-empty">
                <h3>No suggestions yet</h3>
                <p>Suggestions will appear as more people join</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore
