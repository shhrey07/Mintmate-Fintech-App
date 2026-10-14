import { useState } from 'react'
import * as P from '@phosphor-icons/react'
import { Button, Field, inputCls, cx } from './ui'
import { Wordmark } from './site'
import { useApp } from './store'

interface AuthProps {
  onSuccess: () => void
}

export default function Auth({ onSuccess }: AuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<Record<string, string>>({})
  const { toast } = useApp()

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    
    if (!email) errors.email = 'Email is required'
    else if (!validateEmail(email)) errors.email = 'Enter a valid email'
    if (!password) errors.password = 'Password is required'
    
    setErr(errors)
    if (Object.keys(errors).length) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const savedUser = localStorage.getItem('mintmate_user')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        if (user.email === email && user.password === password) {
          localStorage.setItem('mintmate_auth', 'true')
          localStorage.setItem('mintmate_user_email', email)
          toast('Welcome back!', { tone: 'ok' })
          onSuccess()
        } else {
          setErr({ password: 'Invalid email or password' })
        }
      } else {
        setErr({ password: 'No account found. Please sign up first.' })
      }
      setLoading(false)
    }, 1000)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    
    if (!name.trim()) errors.name = 'Name is required'
    if (!email) errors.email = 'Email is required'
    else if (!validateEmail(email)) errors.email = 'Enter a valid email'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    
    setErr(errors)
    if (Object.keys(errors).length) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const existingUser = localStorage.getItem('mintmate_user')
      if (existingUser) {
        const user = JSON.parse(existingUser)
        if (user.email === email) {
          setErr({ email: 'Account already exists. Please sign in.' })
          setLoading(false)
          return
        }
      }
      
      localStorage.setItem('mintmate_user', JSON.stringify({ email, password, name }))
      localStorage.setItem('mintmate_auth', 'true')
      localStorage.setItem('mintmate_user_email', email)
      toast('Account created successfully!', { tone: 'ok' })
      onSuccess()
      setLoading(false)
    }, 1000)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    
    if (!email) errors.email = 'Email is required'
    else if (!validateEmail(email)) errors.email = 'Enter a valid email'
    
    setErr(errors)
    if (Object.keys(errors).length) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast('Password reset link sent to your email', { tone: 'ok' })
      setMode('signin')
      setLoading(false)
    }, 1000)
  }

  const handleSocialLogin = (provider: string) => {
    toast(`${provider} login coming soon!`, { tone: 'ok' })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[440px] flex-col px-5 py-8">
      <div className="mb-8 flex items-center justify-center">
        <Wordmark />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {mode === 'signin' && (
          <div className="rise">
            <h1 className="serif mb-2 text-4xl font-medium">Welcome back</h1>
            <p className="mb-6 text-muted">Sign in to your MintMate account</p>
            
            <form onSubmit={handleSignIn} className="space-y-4">
              <Field label="Email" error={err.email} htmlFor="email">
                <input 
                  id="email" 
                  type="email" 
                  className={inputCls} 
                  aria-invalid={!!err.email}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>
              
              <Field label="Password" error={err.password} htmlFor="password">
                <input 
                  id="password" 
                  type="password" 
                  className={inputCls}
                  aria-invalid={!!err.password}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </Field>

              <button 
                type="button"
                onClick={() => setMode('forgot')} 
                className="text-sm font-semibold text-primary hover:underline"
              >
                Forgot password?
              </button>

              <Button type="submit" size="lg" full loading={loading}>
                Sign In
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="text-sm text-muted">Or continue with</span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary" 
                onClick={() => handleSocialLogin('Google')}
                className="gap-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => handleSocialLogin('Apple')}
                className="gap-2"
              >
                <P.AppleLogo size={20} weight="fill" />
                Apple
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted">
              Don't have an account?{' '}
              <button 
                onClick={() => setMode('signup')} 
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        )}

        {mode === 'signup' && (
          <div className="rise">
            <h1 className="serif mb-2 text-4xl font-medium">Create account</h1>
            <p className="mb-6 text-muted">Start managing your money better</p>
            
            <form onSubmit={handleSignUp} className="space-y-4">
              <Field label="Full Name" error={err.name} htmlFor="name">
                <input 
                  id="name" 
                  type="text" 
                  className={inputCls}
                  aria-invalid={!!err.name}
                  value={name} 
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="RIYA SHARMA"
                  autoComplete="name"
                />
              </Field>

              <Field label="Email" error={err.email} htmlFor="email">
                <input 
                  id="email" 
                  type="email" 
                  className={inputCls}
                  aria-invalid={!!err.email}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>
              
              <Field label="Password" error={err.password} htmlFor="password" hint="At least 6 characters">
                <input 
                  id="password" 
                  type="password" 
                  className={inputCls}
                  aria-invalid={!!err.password}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </Field>

              <Field label="Confirm Password" error={err.confirmPassword} htmlFor="confirmPassword">
                <input 
                  id="confirmPassword" 
                  type="password" 
                  className={inputCls}
                  aria-invalid={!!err.confirmPassword}
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </Field>

              <Button type="submit" size="lg" full loading={loading}>
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted">
              By signing up, you agree to our{' '}
              <a href="#" className="font-semibold text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-primary hover:underline">
                Privacy Policy
              </a>
            </p>

            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{' '}
              <button 
                onClick={() => setMode('signin')} 
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="rise">
            <h1 className="serif mb-2 text-4xl font-medium">Reset password</h1>
            <p className="mb-6 text-muted">Enter your email to receive a reset link</p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Field label="Email" error={err.email} htmlFor="email">
                <input 
                  id="email" 
                  type="email" 
                  className={inputCls}
                  aria-invalid={!!err.email}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>

              <Button type="submit" size="lg" full loading={loading}>
                Send Reset Link
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Remember your password?{' '}
              <button 
                onClick={() => setMode('signin')} 
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        © 2026 MintMate. All rights reserved.
      </p>
    </div>
  )
}
