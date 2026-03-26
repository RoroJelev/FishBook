// Collection Page — grid of all fish species with sprite thumbnails

const difficultyColors = {
  Beginner:     '#2d9b5c',
  Intermediate: '#e6a817',
  Advanced:     '#e07b39',
  Expert:       '#c0392b',
  'N/A':        '#aaa',
}

function CollectionPage({ fishData, caughtSpeciesIds, navigate }) {
  const speciesCaught   = caughtSpeciesIds.length
  const totalSpecies    = fishData.length
  const progressPercent = Math.round((speciesCaught / totalSpecies) * 100)

  return (
    <div className="page">
      {/* Progress bar */}
      <div className="card">
        <div className="progress-header">
          <span>{speciesCaught} of {totalSpecies} species caught</span>
          <span className="progress-percent">{progressPercent}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Fish Grid — caught first, then sorted by difficulty */}
      <div className="fish-grid">
        {(() => {
          const diffOrder = { Beginner: 0, Intermediate: 1, Advanced: 2, Difficult: 3, Expert: 4 }
          return [...fishData].sort((a, b) => {
            const aCaught = caughtSpeciesIds.includes(a.id) ? 0 : 1
            const bCaught = caughtSpeciesIds.includes(b.id) ? 0 : 1
            if (aCaught !== bCaught) return aCaught - bCaught
            const aDiff = diffOrder[a.difficulty] ?? 99
            const bDiff = diffOrder[b.difficulty] ?? 99
            return aDiff - bDiff
          })
        })().map(fish => {
          const isCaught = caughtSpeciesIds.includes(fish.id)
          return (
            <div
              key={fish.id}
              className={`fish-card ${isCaught ? 'fish-card--caught' : 'fish-card--uncaught'}`}
              onClick={() => navigate('fish-detail', fish.id)}
            >
              {/* Use dedicated image if available, otherwise crop from species chart */}
              {fish.image
                ? <img src={fish.image} alt={fish.name} className="fish-img" />
                : <div className="fish-sprite" style={{ backgroundPosition: fish.spritePos }} />
              }

              {/* Caught checkmark / lock overlay */}
              {isCaught
                ? <div className="fish-card-caught-badge">✓</div>
                : <div className="fish-card-lock">🔒</div>
              }

              <div className="fish-card-body">
                <h4 className="fish-card-name">{fish.name}</h4>
                <div className="fish-card-footer">
                  <span
                    className="badge"
                    style={{ background: difficultyColors[fish.difficulty] || '#888' }}
                  >
                    {fish.difficulty}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CollectionPage
