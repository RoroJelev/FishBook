import { useState } from 'react'

const slides = [
  {
    emoji: null,
    title: 'Welcome to\nFishbook',
    description: 'Track your catches, discover new species, and make every trip count.',
  },
  {
    emoji: '📷',
    title: 'How It Works',
    description: 'Snap or upload a photo of your catch to log it in your book.',
  },
  {
    emoji: '📖',
    title: 'Reel In Your Collection',
    description: 'Reel in every catch and watch your collection grow.',
  },
]

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const slide = slides[step]
  const isLast = step === slides.length - 1

  function handleContinue() {
    if (isLast) {
      onDone()
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding-slide">

        {/* Circle illustration */}
        <div className={`onboarding-circle ${slide.emoji ? '' : 'onboarding-circle--logo'}`}>
          {slide.emoji
            ? <span className="onboarding-emoji">{slide.emoji}</span>
            : <img src="/logo.png" alt="logo" className="onboarding-logo" />
          }
        </div>

        {/* Text */}
        <div className="onboarding-text">
          <h2 className="onboarding-title">
            {slide.title.split('\n').map((line, i) => (
              <span key={i}>{line}{i < slide.title.split('\n').length - 1 && <br />}</span>
            ))}
          </h2>
          <p className="onboarding-desc">{slide.description}</p>
        </div>

        {/* Dot indicators */}
        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <div key={i} className={`onboarding-dot ${i === step ? 'onboarding-dot--active' : ''}`} />
          ))}
        </div>

        {/* Continue button */}
        <button className="onboarding-btn" onClick={handleContinue}>
          Continue
        </button>

      </div>
    </div>
  )
}

export default Onboarding
