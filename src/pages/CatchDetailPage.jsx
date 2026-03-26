// Catch Detail Page — shows the user-uploaded photo + info for one specific catch

function CatchDetailPage({ catchId, catches, fishData, navigate }) {
  const entry = catches.find(c => c.id === catchId)

  if (!entry) {
    return (
      <div className="page">
        <button className="btn btn--ghost" onClick={() => navigate('home')}>← Back</button>
        <p>Catch not found.</p>
      </div>
    )
  }

  const fish = fishData.find(f => f.id === entry.fishId)

  return (
    <div className="page">
      <button className="btn btn--ghost" onClick={() => navigate('home')}>← Back</button>

      {/* User photo box */}
      <div className="catch-detail-photo-box">
        {entry.photo
          ? <img src={entry.photo} alt={entry.fishName} className="catch-detail-photo" />
          : (
            <div className="catch-detail-photo-empty">
              {fish?.image
                ? <img src={fish.image} alt={fish.name} className="catch-detail-photo-placeholder" />
                : <span style={{ fontSize: '64px' }}>🐟</span>
              }
              <p className="catch-detail-no-photo">No photo added</p>
            </div>
          )
        }
      </div>

      {/* Catch info */}
      <div className="card">
        <h2 className="catch-detail-name">{entry.fishName}</h2>
        <p className="catch-detail-date">{entry.date}</p>
      </div>

      <div className="info-grid">
        {entry.weight && (
          <div className="info-item">
            <span className="info-label">Weight</span>
            <span className="info-value">{entry.weight} lbs</span>
          </div>
        )}
        {entry.length && (
          <div className="info-item">
            <span className="info-label">Length</span>
            <span className="info-value">{entry.length}"</span>
          </div>
        )}
        {entry.location && (
          <div className="info-item">
            <span className="info-label">Location</span>
            <span className="info-value">{entry.location}</span>
          </div>
        )}
      </div>

      {entry.notes && (
        <div className="card tips-card">
          <div className="tips-title">Notes</div>
          <p>{entry.notes}</p>
        </div>
      )}

      <button
        className="btn btn--secondary"
        style={{ width: '100%' }}
        onClick={() => navigate('fish-detail', entry.fishId)}
      >
        View {entry.fishName} Species Info →
      </button>
    </div>
  )
}

export default CatchDetailPage
