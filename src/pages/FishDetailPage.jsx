// Fish Detail Page — full info about one species plus personal catch history for it

function FishDetailPage({ fishId, fishData, catches, navigate }) {
  const fish = fishData.find(f => f.id === fishId)

  // If somehow the fish isn't found, go back
  if (!fish) {
    return (
      <div className="page">
        <p>Fish not found.</p>
        <button className="btn btn--secondary" onClick={() => navigate('collection')}>
          Back to Collection
        </button>
      </div>
    )
  }

  // Catches logged for this specific fish
  const fishCatches = catches.filter(c => c.fishId === fishId)
  const isCaught = fishCatches.length > 0

  // Best catch by weight
  const bestCatch = fishCatches.reduce((best, c) => {
    if (!c.weight) return best
    return !best || parseFloat(c.weight) > parseFloat(best.weight) ? c : best
  }, null)

  return (
    <div className="page">

      {/* Back button */}
      <button className="btn btn--ghost" onClick={() => navigate('collection')}>
        ← Back to Collection
      </button>

      {/* Fish Header */}
      <div className="fish-detail-header">
        <div className="fish-detail-emoji">{fish.emoji}</div>
        <div>
          <h2 className="fish-detail-name">{fish.name}</h2>
          <p className="fish-detail-scientific">{fish.scientificName}</p>
          {isCaught
            ? <span className="badge badge--caught">✓ Caught</span>
            : <span className="badge badge--uncaught">Not Caught Yet</span>
          }
        </div>
      </div>

      {/* Description */}
      <div className="card">
        <p>{fish.description}</p>
      </div>

      {/* Info Grid */}
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Habitat</span>
          <span className="info-value">{fish.habitat}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Average Weight</span>
          <span className="info-value">{fish.avgWeight}</span>
        </div>
        <div className="info-item">
          <span className="info-label">World Record</span>
          <span className="info-value">{fish.record}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Difficulty</span>
          <span className="info-value">{fish.difficulty}</span>
        </div>
      </div>

      {/* Fishing Tips */}
      <div className="card tips-card">
        <h4 className="tips-title">💡 Fishing Tips</h4>
        <p>{fish.tips}</p>
      </div>

      {/* Personal Bests */}
      {bestCatch && (
        <div className="card">
          <h4>Your Personal Best</h4>
          <p>
            <strong>{bestCatch.weight} lbs</strong>
            {bestCatch.length ? ` · ${bestCatch.length}"` : ''}
            {bestCatch.date ? ` · ${bestCatch.date}` : ''}
            {bestCatch.location ? ` · ${bestCatch.location}` : ''}
          </p>
        </div>
      )}

      {/* Log Catch Button */}
      <button
        className="btn btn--primary"
        style={{ width: '100%', marginTop: '8px' }}
        onClick={() => navigate('log-catch', fish.id)}
      >
        + Log a {fish.name} Catch
      </button>

      {/* Catch History for this fish */}
      {fishCatches.length > 0 && (
        <div className="section">
          <h3 className="section-title">Your Catches ({fishCatches.length})</h3>
          <div className="catch-list">
            {fishCatches.map(c => (
              <div key={c.id} className="catch-item catch-item--no-click">
                {c.photo
                  ? <img src={c.photo} alt={c.fishName} className="catch-thumb" />
                  : <span className="catch-emoji">🐟</span>
                }
                <div className="catch-info">
                  <strong>{c.date}</strong>
                  <span className="catch-meta">
                    {c.weight ? `${c.weight} lbs` : ''}
                    {c.length ? ` · ${c.length}"` : ''}
                    {c.location ? ` · ${c.location}` : ''}
                  </span>
                  {c.notes && <span className="catch-notes">"{c.notes}"</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default FishDetailPage
