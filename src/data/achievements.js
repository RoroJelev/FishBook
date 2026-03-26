// ============================================================
// ACHIEVEMENTS — 25 fish-themed milestones with witty puns
// Organised into 4 difficulties: Beginner, Intermediate, Advanced, Legendary
// Each achievement has a check(catches) → boolean function.
// ============================================================

function monthKey(dateStr) {
  if (!dateStr) return null
  const parts = dateStr.split('-')
  return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : null
}

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Legendary']

export const DIFFICULTY_COLORS = {
  Beginner:     '#7A9445',   // moss green
  Intermediate: '#59789F',   // water blue
  Advanced:     '#C97B2E',   // amber
  Legendary:    '#8B5CF6',   // purple
}

export const achievements = [

  // ── BEGINNER (7) ──────────────────────────────────────────
  {
    id: 'first-cast',
    name: 'Hooked!',
    description: 'Log your very first catch.',
    difficulty: 'Beginner',
    icon: '🎣',
    check: c => c.length >= 1,
  },
  {
    id: 'five-catches',
    name: 'Reel Deal',
    description: 'Log 5 catches.',
    difficulty: 'Beginner',
    icon: '🐟',
    check: c => c.length >= 5,
  },
  {
    id: 'three-species',
    name: 'Fin-tastic!',
    description: 'Unlock 3 different fish species.',
    difficulty: 'Beginner',
    icon: '🐠',
    check: c => new Set(c.map(x => x.fishId)).size >= 3,
  },
  {
    id: 'photo-first',
    name: 'Photo Fin-ish',
    description: 'Add a photo to a catch.',
    difficulty: 'Beginner',
    icon: '📷',
    check: c => c.some(x => x.photo),
  },
  {
    id: 'first-weight',
    name: 'On the Scales',
    description: 'Record a weight for a catch.',
    difficulty: 'Beginner',
    icon: '⚖️',
    check: c => c.some(x => x.weight),
  },
  {
    id: 'first-length',
    name: 'Measure Twice, Fish Once',
    description: 'Record a length for a catch.',
    difficulty: 'Beginner',
    icon: '📏',
    check: c => c.some(x => x.length),
  },
  {
    id: 'first-location',
    name: 'You Had to Be There',
    description: 'Record a location for a catch.',
    difficulty: 'Beginner',
    icon: '📍',
    check: c => c.some(x => x.location),
  },

  // ── INTERMEDIATE (7) ──────────────────────────────────────
  {
    id: 'fifteen-catches',
    name: "O-fish-ally Obsessed",
    description: 'Log 15 catches.',
    difficulty: 'Intermediate',
    icon: '🏅',
    check: c => c.length >= 15,
  },
  {
    id: 'seven-species',
    name: "School's in Session",
    description: 'Unlock 7 different fish species.',
    difficulty: 'Intermediate',
    icon: '🎓',
    check: c => new Set(c.map(x => x.fishId)).size >= 7,
  },
  {
    id: 'five-lbs',
    name: 'Weigh to Go!',
    description: 'Log a catch weighing 5 lbs or more.',
    difficulty: 'Intermediate',
    icon: '💪',
    check: c => c.some(x => parseFloat(x.weight || 0) >= 5),
  },
  {
    id: 'bass-caught',
    name: 'Bass-ically a Legend',
    description: 'Catch a Smallmouth or Largemouth Bass.',
    difficulty: 'Intermediate',
    icon: '🎸',
    check: c => c.some(x => x.fishId === 1 || x.fishId === 15),
  },
  {
    id: 'five-photos',
    name: 'Snap Happy',
    description: 'Add photos to 5 different catches.',
    difficulty: 'Intermediate',
    icon: '📸',
    check: c => c.filter(x => x.photo).length >= 5,
  },
  {
    id: 'five-days',
    name: 'Pier Pressure',
    description: 'Log catches on 5 different days.',
    difficulty: 'Intermediate',
    icon: '📅',
    check: c => new Set(c.map(x => x.date)).size >= 5,
  },
  {
    id: 'five-notes',
    name: 'Something Smells Fishy',
    description: 'Add notes to 5 different catches.',
    difficulty: 'Intermediate',
    icon: '📝',
    check: c => c.filter(x => x.notes && x.notes.trim()).length >= 5,
  },

  // ── ADVANCED (7) ──────────────────────────────────────────
  {
    id: 'thirty-catches',
    name: 'Tackle This!',
    description: 'Log 30 catches.',
    difficulty: 'Advanced',
    icon: '🧰',
    check: c => c.length >= 30,
  },
  {
    id: 'fifteen-species',
    name: 'Deep Dive',
    description: 'Unlock 15 different fish species.',
    difficulty: 'Advanced',
    icon: '🤿',
    check: c => new Set(c.map(x => x.fishId)).size >= 15,
  },
  {
    id: 'ten-lbs',
    name: 'Big Fish Energy',
    description: 'Log a catch weighing 10 lbs or more.',
    difficulty: 'Advanced',
    icon: '🐋',
    check: c => c.some(x => parseFloat(x.weight || 0) >= 10),
  },
  {
    id: 'five-in-month',
    name: 'Going Overboard',
    description: 'Log 5 catches in a single calendar month.',
    difficulty: 'Advanced',
    icon: '🚢',
    check: c => {
      const tally = {}
      c.forEach(x => { const k = monthKey(x.date); if (k) tally[k] = (tally[k] || 0) + 1 })
      return Object.values(tally).some(n => n >= 5)
    },
  },
  {
    id: 'fifteen-photos',
    name: 'Lens Flare',
    description: 'Add photos to 15 different catches.',
    difficulty: 'Advanced',
    icon: '🌟',
    check: c => c.filter(x => x.photo).length >= 15,
  },
  {
    id: 'gar-caught',
    name: 'Gar-anteed Chaos',
    description: 'Catch a Longnose Gar.',
    difficulty: 'Advanced',
    icon: '🦷',
    check: c => c.some(x => x.fishId === 3),
  },
  {
    id: 'carp-caught',
    name: 'Carpe Diem',
    description: 'Catch a Eurasian Carp.',
    difficulty: 'Advanced',
    icon: '🌅',
    check: c => c.some(x => x.fishId === 11),
  },

  // ── LEGENDARY (4) ─────────────────────────────────────────
  {
    id: 'fifty-catches',
    name: 'Legend of the Lake',
    description: 'Log 50 catches.',
    difficulty: 'Legendary',
    icon: '🏆',
    check: c => c.length >= 50,
  },
  {
    id: 'twenty-species',
    name: 'The Chosen Fin',
    description: 'Unlock 20 different fish species.',
    difficulty: 'Legendary',
    icon: '👑',
    check: c => new Set(c.map(x => x.fishId)).size >= 20,
  },
  {
    id: 'twenty-lbs',
    name: 'Lunker Alert!',
    description: 'Log a catch weighing 20 lbs or more.',
    difficulty: 'Legendary',
    icon: '💎',
    check: c => c.some(x => parseFloat(x.weight || 0) >= 20),
  },
  {
    id: 'all-species',
    name: 'Supreme Angler',
    description: 'Unlock all 25 fish species.',
    difficulty: 'Legendary',
    icon: '🌊',
    check: c => new Set(c.map(x => x.fishId)).size >= 25,
  },
]

// Returns the subset of achievements the user has unlocked
export function getUnlocked(catches) {
  return new Set(achievements.filter(a => a.check(catches)).map(a => a.id))
}
