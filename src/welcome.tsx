import { useState } from 'react'
import * as P from '@phosphor-icons/react'
import { Button, cx } from './ui'
import { Wordmark } from './site'

interface WelcomeProps {
  onComplete: () => void
  onSkip: () => void
}

const slides = [
  {
    icon: P.Wallet,
    title: 'Smart Budget Tracking',
    description: 'Know exactly how much you can spend today. MintMate calculates your safe daily spending based on bills, goals, and days left in your cycle.',
    color: 'bg-primary',
    gradient: 'from-primary to-primary-hover'
  },
  {
    icon: P.ChartLine,
    title: 'Insights That Matter',
    description: 'See where your money goes with beautiful charts. Track spending by category, spot trends, and make smarter financial decisions.',
    color: 'bg-[#3b73b0]',
    gradient: 'from-[#3b73b0] to-[#2d5a8a]'
  },
  {
    icon: P.Target,
    title: 'Achieve Your Goals',
    description: 'Save for that laptop, trip, or emergency fund. Set goals, track progress, and celebrate milestones with automated savings tracking.',
    color: 'bg-[#c4582c]',
    gradient: 'from-[#c4582c] to-[#9a4522]'
  },
  {
    icon: P.Robot,
    title: 'AI Budget Assistant',
    description: 'Get personalized financial advice 24/7. Our AI helps you plan budgets, find savings opportunities, and stay motivated on your money journey.',
    color: 'bg-[#8660b8]',
    gradient: 'from-[#8660b8] to-[#6a4d94]'
  }
]

export default function Welcome({ onComplete, onSkip }: WelcomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-bg via-surface to-surface2">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={cx(
          'absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br opacity-10 blur-3xl transition-all duration-1000',
          slide.gradient
        )} />
        <div className={cx(
          'absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-tr opacity-10 blur-3xl transition-all duration-1000',
          slide.gradient
        )} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[440px] flex-1 flex-col px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Wordmark />
          <button
            onClick={onSkip}
            className="text-sm font-semibold text-muted hover:text-ink"
          >
            Skip
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {/* Icon */}
          <div
            key={currentSlide}
            className={cx(
              'rise mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br shadow-2xl',
              slide.gradient
            )}
          >
            <Icon size={64} weight="duotone" className="text-white" />
          </div>

          {/* Text */}
          <div key={`text-${currentSlide}`} className="rise space-y-4">
            <h1 className="serif text-4xl font-bold tracking-tight">
              {slide.title}
            </h1>
            <p className="mx-auto max-w-sm text-lg leading-relaxed text-muted">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-6">
          {/* Dots */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cx(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentSlide
                    ? cx('w-8', slide.color)
                    : 'w-2 bg-line hover:bg-muted'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {currentSlide > 0 && (
              <Button
                variant="secondary"
                size="lg"
                onClick={handlePrev}
                icon={P.ArrowLeft}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              size="lg"
              onClick={handleNext}
              icon={currentSlide === slides.length - 1 ? P.Check : P.ArrowRight}
              className="flex-1"
            >
              {currentSlide === slides.length - 1 ? "Let's Go" : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
