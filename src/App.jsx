import { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import Nav from './components/Nav'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import FishDetailPage from './pages/FishDetailPage'
import LogCatchPage from './pages/LogCatchPage'
import CatchHistoryPage from './pages/CatchHistoryPage'
import CatchDetailPage from './pages/CatchDetailPage'
import StatsPage from './pages/StatsPage'
import { fishData } from './data/fishData'

// ----- App is the single source of truth -----
// All shared state lives here and is passed down as props.

function getSkillCategory(n) {
  if (n <= 3)  return 'Beginner'
  if (n <= 6)  return 'Rookie'
  if (n <= 12) return 'Intermediate'
  if (n <= 16) return 'Advanced'
  if (n <= 21) return 'Master'
  return 'Supreme Master'
}

// Returns "Good morning", "Good afternoon", or "Good evening"
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function App() {
  // Show onboarding only on first visit
  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem('fishingLog_onboarded') === 'true'
  })

  function completeOnboarding() {
    localStorage.setItem('fishingLog_onboarded', 'true')
    setOnboarded(true)
  }

  // Load catches from localStorage on first render
  const [catches, setCatches] = useState(() => {
    try {
      const saved = localStorage.getItem('fishingLog_catches')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // User's display name — stored in localStorage, click to change
  const [name, setName] = useState(() => {
    return localStorage.getItem('fishingLog_name') || 'Angler'
  })

  // Which page to show
  const [page, setPage] = useState('home')

  // The fish ID passed to the detail page
  const [selectedFishId, setSelectedFishId] = useState(null)

  // Save catches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fishingLog_catches', JSON.stringify(catches))
  }, [catches])

  // Tap the name to rename
  function handleNameClick() {
    const input = window.prompt('Enter your name:', name)
    if (input && input.trim()) {
      const trimmed = input.trim()
      setName(trimmed)
      localStorage.setItem('fishingLog_name', trimmed)
    }
  }

  // Add a new catch entry
  function addCatch(entry) {
    const newCatch = { ...entry, id: Date.now() }
    setCatches(prev => [newCatch, ...prev]) // newest first
  }

  // Update an existing catch entry
  function updateCatch(updatedEntry) {
    setCatches(prev => prev.map(c => c.id === updatedEntry.id ? updatedEntry : c))
  }

  // Delete a catch entry by id
  function deleteCatch(id) {
    setCatches(prev => prev.filter(c => c.id !== id))
  }

  // The catch being edited (null when logging a new catch)
  const [editingCatch, setEditingCatch] = useState(null)

  // Selected catch ID for the catch detail page
  const [selectedCatchId, setSelectedCatchId] = useState(null)

  // Navigate to a page, optionally with a fish ID, catch ID, or catch object
  function navigate(targetPage, id = null) {
    if (targetPage === 'catch-detail') {
      setSelectedCatchId(id)
    } else if (targetPage === 'edit-catch') {
      // id is the full catch object here
      setEditingCatch(id)
      setPage('log-catch')
      window.scrollTo(0, 0)
      return
    } else {
      setSelectedFishId(id)
      if (targetPage === 'log-catch') setEditingCatch(null)
    }
    setPage(targetPage)
    window.scrollTo(0, 0)
  }

  // Unique fish IDs the user has caught
  const caughtSpeciesIds = [...new Set(catches.map(c => c.fishId))]
  const speciesCaught = caughtSpeciesIds.length
  const totalSpecies  = fishData.length
  const progressPct   = Math.round((speciesCaught / totalSpecies) * 100)

  if (!onboarded) {
    return <Onboarding onDone={completeOnboarding} />
  }

  return (
    <div className="app">
      {page === 'home' && <header className="app-header">
        <div className="app-header-left">
          <h1 className="app-greeting">
            {getGreeting()},{' '}
            <span className="app-name" onClick={handleNameClick} title="Tap to change name">
              {name}
            </span>
          </h1>
          <div className="header-progress-track">
            <div className="header-progress-fill" style={{ width: progressPct + '%' }} />
          </div>
          <div className="header-progress-label">
            <span>{speciesCaught}/{totalSpecies} Fish Species Caught</span>
            <span className="skill-badge">{getSkillCategory(speciesCaught)}</span>
          </div>
        </div>
        <div className="app-avatar">
          <img src="/logo.png" alt="Fishing Log Logo" className="app-avatar-img" />
        </div>
      </header>}

      <Nav page={page} navigate={navigate} />

      <main className="main-content">
        {page === 'home' && (
          <HomePage
            catches={catches}
            caughtSpeciesIds={caughtSpeciesIds}
            fishData={fishData}
            navigate={navigate}
            deleteCatch={deleteCatch}
          />
        )}
        {page === 'collection' && (
          <CollectionPage
            fishData={fishData}
            caughtSpeciesIds={caughtSpeciesIds}
            navigate={navigate}
          />
        )}
        {page === 'fish-detail' && (
          <FishDetailPage
            fishId={selectedFishId}
            fishData={fishData}
            catches={catches}
            navigate={navigate}
          />
        )}
        {page === 'log-catch' && (
          <LogCatchPage
            fishData={fishData}
            catches={catches}
            addCatch={addCatch}
            updateCatch={updateCatch}
            navigate={navigate}
            preselectedFishId={selectedFishId}
            editCatch={editingCatch}
          />
        )}
        {page === 'catch-detail' && (
          <CatchDetailPage
            catchId={selectedCatchId}
            catches={catches}
            fishData={fishData}
            navigate={navigate}
          />
        )}
        {page === 'history' && (
          <CatchHistoryPage
            catches={catches}
            fishData={fishData}
            navigate={navigate}
          />
        )}
        {page === 'stats' && (
          <StatsPage
            catches={catches}
            fishData={fishData}
          />
        )}
      </main>
    </div>
  )
}

export default App
