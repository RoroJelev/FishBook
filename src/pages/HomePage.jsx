import { useState, useEffect, useRef } from 'react'

const sortOptions = [
  { value: 'newest',   label: 'Most Recent' },
  { value: 'heaviest', label: 'Heaviest'    },
  { value: 'name',     label: 'Fish Name (A–Z)' },
  { value: 'location', label: 'Location'    },
]

function sortCatches(catches, sortBy) {
  const arr = [...catches]
  switch (sortBy) {
    case 'heaviest':
      return arr.sort((a, b) => parseFloat(b.weight || 0) - parseFloat(a.weight || 0))
    case 'name':
      return arr.sort((a, b) => a.fishName.localeCompare(b.fishName))
    case 'location':
      return arr.sort((a, b) => (a.location || '').localeCompare(b.location || ''))
    default:
      return arr // already newest-first from addCatch
  }
}

// Individual card in the grid — always shows species image, clicking opens catch detail
function CatchCard({ entry, fish, navigate, deleteCatch }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const photoContent = fish?.image ? (
    <img src={fish.image} alt={entry.fishName} className="catch-card-img" />
  ) : fish?.spritePos ? (
    <div className="catch-card-sprite" style={{ backgroundPosition: fish.spritePos }} />
  ) : (
    <span className="catch-card-emoji">🐟</span>
  )

  return (
    <div className="catch-card" onClick={() => navigate('catch-detail', entry.id)}>
      <div className="catch-card-photo">
        {photoContent}

        {/* Three-dot menu square — top right of photo */}
        <div className="catch-card-menu-wrap" ref={menuRef}>
          <button
            className="catch-card-menu-btn"
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
          >
            ···
          </button>
          {menuOpen && (
            <div className="catch-card-menu">
              <button
                className="catch-card-menu-item"
                onClick={e => { e.stopPropagation(); setMenuOpen(false); navigate('edit-catch', entry) }}
              >
                Edit
              </button>
              <button
                className="catch-card-menu-item catch-card-menu-item--delete"
                onClick={e => {
                  e.stopPropagation()
                  setMenuOpen(false)
                  if (window.confirm('Delete this catch? This cannot be undone.')) {
                    deleteCatch(entry.id)
                  }
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="catch-card-info">
        <div className="catch-card-name">{entry.fishName}</div>
        {entry.weight && <div className="catch-card-weight">{entry.weight}lb</div>}
      </div>
    </div>
  )
}

function HomePage({ catches, fishData, navigate, deleteCatch }) {
  const [sortBy, setSortBy] = useState('newest')
  const sorted = sortCatches(catches, sortBy)

  return (
    <div className="home-page">

      {/* Sort Bar */}
      <div className="sort-bar">
        <span className="sort-label">Sort By</span>
        <div className="sort-select-wrapper">
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className="sort-chevron">⌄</span>
        </div>
      </div>

      {/* Catch Grid or Empty State */}
      {sorted.length === 0 ? (
        <div className="home-empty">
          <div className="home-empty-icon">🎣</div>
          <p>No catches yet.</p>
          <p className="home-empty-sub">Tap <strong>+</strong> below to log your first catch!</p>
        </div>
      ) : (
        <div className="catch-grid">
          {sorted.map(entry => (
            <CatchCard
              key={entry.id}
              entry={entry}
              fish={fishData.find(f => f.id === entry.fishId)}
              navigate={navigate}
              deleteCatch={deleteCatch}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default HomePage
