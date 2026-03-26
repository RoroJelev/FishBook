import { useState, useRef, useEffect } from 'react'

// Plays a short victory sound using the Web Audio API (no audio files needed).
// 'new-pb'      → triumphant ascending fanfare
// 'new-species' → magical discovery chime
function playVictorySound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    const notes = type === 'new-pb'
      ? [
          { freq: 392.00, t: 0.00, dur: 0.55 },   // G4
          { freq: 493.88, t: 0.13, dur: 0.50 },   // B4
          { freq: 587.33, t: 0.26, dur: 0.50 },   // D5
          { freq: 783.99, t: 0.39, dur: 0.90 },   // G5 — held
        ]
      : [
          { freq: 523.25,  t: 0.00, dur: 0.45 },  // C5
          { freq: 659.25,  t: 0.14, dur: 0.45 },  // E5
          { freq: 783.99,  t: 0.28, dur: 0.45 },  // G5
          { freq: 1046.50, t: 0.42, dur: 0.75 },  // C6 — held
        ]

    notes.forEach(({ freq, t, dur }) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = type === 'new-pb' ? 'triangle' : 'sine'
      osc.frequency.value = freq
      const s = ctx.currentTime + t
      gain.gain.setValueAtTime(0, s)
      gain.gain.linearRampToValueAtTime(0.25, s + 0.04)
      gain.gain.setValueAtTime(0.25, s + dur * 0.55)
      gain.gain.exponentialRampToValueAtTime(0.001, s + dur)
      osc.start(s)
      osc.stop(s + dur)
    })
  } catch (_) {
    // Audio unavailable — fail silently
  }
}

// Resizes and compresses the selected image to a base64 string.
// Keeps file sizes small enough for localStorage.
function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 800
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width  = img.width  * scale
        canvas.height = img.height * scale
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

function LogCatchPage({ fishData, catches, addCatch, updateCatch, navigate, preselectedFishId, editCatch }) {
  const isEditing = !!editCatch
  const today = new Date().toISOString().split('T')[0]

  const [fishId,    setFishId]    = useState(isEditing ? String(editCatch.fishId) : (preselectedFishId || ''))
  const [date,      setDate]      = useState(isEditing ? editCatch.date     : today)
  const [weight,    setWeight]    = useState(isEditing ? editCatch.weight   : '')
  const [length,    setLength]    = useState(isEditing ? editCatch.length   : '')
  const [location,  setLocation]  = useState(isEditing ? editCatch.location : '')
  const [notes,     setNotes]     = useState(isEditing ? editCatch.notes    : '')
  const [photo,     setPhoto]     = useState(isEditing ? editCatch.photo    : null)
  const [submitted, setSubmitted] = useState(false)
  // 'new-species' | 'new-pb' | null
  const [celebration, setCelebration] = useState(null)

  const fileInputRef = useRef(null)

  // Auto-dismiss celebration after 3 seconds then show success
  useEffect(() => {
    if (!celebration) return
    playVictorySound(celebration)
    const t = setTimeout(() => {
      setCelebration(null)
      setSubmitted(true)
    }, 3000)
    return () => clearTimeout(t)
  }, [celebration])

  async function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const compressed = await compressImage(file)
    setPhoto(compressed)
  }

  function removePhoto() {
    setPhoto(null)
    // Reset the file input so the same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!fishId) { alert('Please select a fish species.'); return }

    const selectedFish = fishData.find(f => f.id === parseInt(fishId))

    if (isEditing) {
      updateCatch({ ...editCatch, fishId: selectedFish.id, fishName: selectedFish.name, date, weight, length, location, notes, photo })
      setSubmitted(true)
      return
    }

    // Determine celebration before saving
    const speciesCatches = catches.filter(c => c.fishId === selectedFish.id)
    let celebrationType = null
    if (speciesCatches.length === 0) {
      celebrationType = 'new-species'
    } else if (weight) {
      const maxWeight = Math.max(...speciesCatches.map(c => parseFloat(c.weight || 0)))
      if (parseFloat(weight) > maxWeight) {
        celebrationType = 'new-pb'
      }
    }

    addCatch({ fishId: selectedFish.id, fishName: selectedFish.name, date, weight, length, location, notes, photo })

    if (celebrationType) {
      setCelebration(celebrationType)
    } else {
      setSubmitted(true)
    }
  }

  if (celebration) {
    const celebFish = fishData.find(f => f.id === parseInt(fishId))
    return (
      <div className="celebration-overlay">
        {celebration === 'new-species' ? (
          <>
            <div className="celebration-icon">
              {celebFish?.image
                ? <img src={celebFish.image} alt={celebFish.name} className="celebration-fish-img" />
                : '🐟'}
            </div>
            <div className="celebration-title">New Species!</div>
            {celebFish && <div className="celebration-weight">{celebFish.name}</div>}
          </>
        ) : (
          <>
            <div className="celebration-icon">🏆</div>
            <div className="celebration-title">New Personal Best!</div>
            <div className="celebration-weight">{weight} lbs</div>
          </>
        )}
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="success-screen">
          <div className="success-emoji">🎉</div>
          <h2>{isEditing ? 'Catch Updated!' : 'Catch Logged!'}</h2>
          <p>{isEditing ? 'Your changes have been saved.' : 'Nice work! Your catch has been saved.'}</p>
          <div className="success-actions">
            {!isEditing && <button className="btn btn--primary" onClick={() => navigate('log-catch', null)}>Log Another</button>}
            <button className="btn btn--ghost" onClick={() => navigate('home')}>Go Home</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {isEditing && (
        <button className="btn btn--ghost" style={{ marginBottom: 12 }} onClick={() => navigate('home')}>← Back</button>
      )}
      <form className="catch-form" onSubmit={handleSubmit}>

        {/* Photo Upload */}
        <div className="form-group">
          <label className="form-label">Photo</label>
          {photo ? (
            <div className="photo-preview-wrapper">
              <img src={photo} alt="Catch preview" className="photo-preview" />
              <button type="button" className="photo-remove" onClick={removePhoto}>✕ Remove</button>
            </div>
          ) : (
            <button
              type="button"
              className="photo-upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              <span className="photo-upload-icon">📷</span>
              <span>Add a Photo</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>

        {/* Fish Species */}
        <div className="form-group">
          <label className="form-label" htmlFor="fish-select">
            Fish Species <span className="required">*</span>
          </label>
          <select id="fish-select" className="form-input" value={fishId} onChange={e => setFishId(e.target.value)} required>
            <option value="">— Select a fish —</option>
            {fishData.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="catch-date">
            Date <span className="required">*</span>
          </label>
          <input id="catch-date" type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        {/* Weight + Length */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="catch-weight">Weight (lbs)</label>
            <input id="catch-weight" type="number" className="form-input" placeholder="e.g. 2.5" min="0" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="catch-length">Length (inches)</label>
            <input id="catch-length" type="number" className="form-input" placeholder="e.g. 14" min="0" step="0.5" value={length} onChange={e => setLength(e.target.value)} />
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label" htmlFor="catch-location">Location</label>
          <input id="catch-location" type="text" className="form-input" placeholder="e.g. Lake Minnetonka, MN" value={location} onChange={e => setLocation(e.target.value)} />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="catch-notes">Notes</label>
          <textarea id="catch-notes" className="form-input form-textarea" placeholder="What lure? Water conditions? Any story worth remembering?" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button type="submit" className="btn btn--primary btn--full">{isEditing ? 'Save Changes' : 'Save Catch 🎣'}</button>

      </form>
    </div>
  )
}

export default LogCatchPage
