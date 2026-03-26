// Statistics Page — charts, summaries, and achievements

import { useState } from 'react'
import { achievements, getUnlocked, DIFFICULTIES, DIFFICULTY_COLORS } from '../data/achievements'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getMonthKey(dateStr) {
  // dateStr is 'YYYY-MM-DD'
  if (!dateStr) return null
  const [y, m] = dateStr.split('-')
  return `${y}-${m}`
}

function formatMonth(key) {
  // key is 'YYYY-MM'
  const [y, m] = key.split('-')
  const d = new Date(parseInt(y), parseInt(m) - 1, 1)
  return d.toLocaleString('default', { month: 'short', year: '2-digit' })
}

// Build last N months including months with 0 catches
function buildMonthlyData(catches, n = 6) {
  const now = new Date()
  const months = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push({ key, label: formatMonth(key), count: 0 })
  }
  catches.forEach(c => {
    const k = getMonthKey(c.date)
    const slot = months.find(m => m.key === k)
    if (slot) slot.count++
  })
  return months
}

// ── Sub-components ───────────────────────────────────────────────────────────

// Stat card — single number with a label
function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  )
}

// SVG bar chart — catches per month
function MonthlyBarChart({ data }) {
  const W = 320
  const H = 120
  const PAD = { top: 8, right: 8, bottom: 28, left: 28 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const maxVal = Math.max(...data.map(d => d.count), 1)
  const barW = chartW / data.length
  const barGap = barW * 0.25

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="stats-svg">
      {/* Y-axis gridlines */}
      {[0, 0.5, 1].map(t => {
        const y = PAD.top + chartH * (1 - t)
        return (
          <g key={t}>
            <line
              x1={PAD.left} y1={y}
              x2={PAD.left + chartW} y2={y}
              stroke="#e0e0e0" strokeWidth="1"
            />
            <text x={PAD.left - 4} y={y + 4} textAnchor="end" className="stats-axis-label">
              {Math.round(maxVal * t)}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const barH = d.count === 0 ? 0 : Math.max(4, (d.count / maxVal) * chartH)
        const x = PAD.left + i * barW + barGap / 2
        const y = PAD.top + chartH - barH
        const w = barW - barGap
        return (
          <g key={d.key}>
            <rect
              x={x} y={y} width={w} height={barH}
              rx="3" ry="3"
              fill="#7A9445"
              opacity={d.count === 0 ? 0.15 : 0.85}
            />
            {d.count > 0 && (
              <text x={x + w / 2} y={y - 3} textAnchor="middle" className="stats-bar-label">
                {d.count}
              </text>
            )}
            <text
              x={x + w / 2}
              y={PAD.top + chartH + 14}
              textAnchor="middle"
              className="stats-axis-label"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// Horizontal bar — species breakdown
function SpeciesBar({ name, count, max, img }) {
  const pct = max === 0 ? 0 : Math.round((count / max) * 100)
  return (
    <div className="species-bar-row">
      <div className="species-bar-thumb">
        {img
          ? <img src={img} alt={name} className="species-bar-img" />
          : <span style={{ fontSize: 18 }}>🐟</span>
        }
      </div>
      <div className="species-bar-info">
        <div className="species-bar-name">{name}</div>
        <div className="species-bar-track">
          <div className="species-bar-fill" style={{ width: pct + '%' }} />
        </div>
      </div>
      <div className="species-bar-count">{count}</div>
    </div>
  )
}

// Grouped achievements section — list hidden behind a dropdown
function AchievementsSection({ unlocked, unlockedCount }) {
  const [open, setOpen] = useState(false)
  const pct = Math.round((unlockedCount / achievements.length) * 100)

  return (
    <div className="stats-card achievements-section">
      {/* Always-visible header — clicking toggles the list */}
      <button className="achievements-toggle" onClick={() => setOpen(o => !o)}>
        <div className="achievements-toggle-left">
          <div className="stats-card-title" style={{ marginBottom: 0 }}>Achievements</div>
          <div className="achievements-progress-label">{unlockedCount} / {achievements.length}</div>
        </div>
        <span className={`achievements-chevron ${open ? 'achievements-chevron--open' : ''}`}>›</span>
      </button>

      <div className="achievements-progress-track">
        <div className="achievements-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {open && (
        <div className="achievements-body">
          {DIFFICULTIES.map(diff => {
            const group = achievements.filter(a => a.difficulty === diff)
            const color = DIFFICULTY_COLORS[diff]
            return (
              <div key={diff} className="achievement-group">
                <div className="achievement-group-label" style={{ color }}>
                  <span className="achievement-group-dot" style={{ background: color }} />
                  {diff}
                </div>
                <div className="achievement-list">
                  {group.map(a => (
                    <AchievementCard key={a.id} achievement={a} unlocked={unlocked.has(a.id)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Achievement card — locked ones are greyed out
function AchievementCard({ achievement, unlocked }) {
  return (
    <div className={`achievement-card ${unlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}>
      <div className="achievement-icon">{achievement.icon}</div>
      <div className="achievement-info">
        <div className="achievement-name">{achievement.name}</div>
        <div className="achievement-desc">{achievement.description}</div>
      </div>
      {unlocked && <div className="achievement-check">✓</div>}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

function StatsPage({ catches, fishData }) {
  const unlocked = getUnlocked(catches)
  const unlockedCount = unlocked.size

  if (catches.length === 0) {
    return (
      <div className="page stats-page">
        <div className="home-empty">
          <div className="home-empty-icon">📊</div>
          <p>No data yet.</p>
          <p className="home-empty-sub">Log your first catch to see statistics!</p>
        </div>
        {/* Still show achievements so there's something to work toward */}
        <AchievementsSection unlocked={unlocked} unlockedCount={unlockedCount} />
      </div>
    )
  }

  // Summary numbers
  const totalCatches  = catches.length
  const speciesCaught = new Set(catches.map(c => c.fishId)).size
  const heaviest      = catches.reduce((best, c) => {
    const w = parseFloat(c.weight || 0)
    return w > best ? w : best
  }, 0)
  const withPhotos = catches.filter(c => c.photo).length

  // Monthly data
  const monthlyData = buildMonthlyData(catches, 6)

  // Top species by catch count
  const speciesCounts = {}
  catches.forEach(c => {
    speciesCounts[c.fishId] = (speciesCounts[c.fishId] || 0) + 1
  })
  const topSpecies = Object.entries(speciesCounts)
    .map(([id, count]) => ({
      count,
      fish: fishData.find(f => f.id === parseInt(id)),
    }))
    .filter(s => s.fish)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const maxSpeciesCount = topSpecies[0]?.count || 1

  // Heaviest catch per species (personal bests)
  const pbMap = {}
  catches.forEach(c => {
    const w = parseFloat(c.weight || 0)
    if (!pbMap[c.fishId] || w > pbMap[c.fishId].weight) {
      pbMap[c.fishId] = { weight: w, fishName: c.fishName, fishId: c.fishId }
    }
  })
  const personalBests = Object.values(pbMap)
    .filter(pb => pb.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)

  return (
    <div className="page stats-page">

      {/* Summary cards */}
      <div className="stats-grid">
        <StatCard value={totalCatches}  label="Total Catches" />
        <StatCard value={speciesCaught} label="Species Caught" />
        <StatCard value={heaviest > 0 ? `${heaviest} lb` : '—'} label="Heaviest Catch" />
        <StatCard value={withPhotos}    label="With Photos" />
      </div>

      {/* Monthly activity */}
      <div className="stats-card">
        <div className="stats-card-title">Catches by Month</div>
        <MonthlyBarChart data={monthlyData} />
      </div>

      {/* Top species */}
      {topSpecies.length > 0 && (
        <div className="stats-card">
          <div className="stats-card-title">Most Caught Species</div>
          <div className="species-bar-list">
            {topSpecies.map(({ fish, count }) => (
              <SpeciesBar
                key={fish.id}
                name={fish.name}
                count={count}
                max={maxSpeciesCount}
                img={fish.image}
              />
            ))}
          </div>
        </div>
      )}

      {/* Personal bests */}
      {personalBests.length > 0 && (
        <div className="stats-card">
          <div className="stats-card-title">Personal Bests</div>
          <div className="pb-list">
            {personalBests.map((pb, i) => {
              const fish = fishData.find(f => f.id === pb.fishId)
              return (
                <div key={pb.fishId} className="pb-row">
                  <span className="pb-rank">#{i + 1}</span>
                  {fish?.image && (
                    <img src={fish.image} alt={pb.fishName} className="pb-img" />
                  )}
                  <span className="pb-name">{pb.fishName}</span>
                  <span className="pb-weight">{pb.weight} lb</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      <AchievementsSection unlocked={unlocked} unlockedCount={unlockedCount} />

    </div>
  )
}

export default StatsPage
