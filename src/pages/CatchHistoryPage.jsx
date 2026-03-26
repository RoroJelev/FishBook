// Catch History Page — full list of all logged catches, newest first

function CatchHistoryPage({ catches, fishData, navigate }) {
  if (catches.length === 0) {
    return (
      <div className="page">
        <h2 className="page-title">Catch History</h2>
        <div className="empty-state">
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎣</div>
          <p>No catches logged yet.</p>
          <button className="btn btn--primary" onClick={() => navigate('log-catch')}>
            Log Your First Catch
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h2 className="page-title">
        Catch History
        <span className="page-title-count">{catches.length} total</span>
      </h2>

      <div className="catch-list">
        {catches.map(c => (
          <div
            key={c.id}
            className="catch-item catch-item--detail"
            onClick={() => navigate('fish-detail', c.fishId)}
          >
            {c.photo
              ? <img src={c.photo} alt={c.fishName} className="catch-thumb" />
              : <span className="catch-emoji">🐟</span>
            }
            <div className="catch-info">
              <strong>{c.fishName}</strong>
              <span className="catch-meta">
                {c.date}
                {c.weight ? ` · ${c.weight} lbs` : ''}
                {c.length ? ` · ${c.length}"` : ''}
                {c.location ? ` · ${c.location}` : ''}
              </span>
              {c.notes && <span className="catch-notes">"{c.notes}"</span>}
            </div>
            <span className="catch-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CatchHistoryPage
