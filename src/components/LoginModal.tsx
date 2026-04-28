import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { signIn, signUp } from '../lib/auth'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) return setError('Please fill in all fields.')
    if (mode === 'signup' && password !== confirm) return setError('Passwords do not match.')
    if (mode === 'signup' && password.length < 6) return setError('Password must be at least 6 characters.')

    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
        onClose()
      } else {
        await signUp(email, password)
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-background rounded-2xl border border-border w-full max-w-sm mx-4 p-8"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition">
              <X size={18} />
            </button>

            {success ? (
              <div className="text-center py-4">
                <p className="font-serif text-2xl text-foreground mb-2">Check your email</p>
                <p className="text-sm text-foreground/60">We sent a confirmation link to {email}</p>
              </div>
            ) : (
              <>
                <p className="font-serif text-2xl text-foreground mb-1">
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </p>
                <p className="text-sm text-foreground/60 mb-6">
                  {mode === 'login' ? 'Sign in to your Tactiq account' : 'Join Tactiq today'}
                </p>

                {/* Tab toggle */}
                <div className="flex rounded-full border border-border bg-muted p-1 mb-6">
                  {(['login', 'signup'] as const).map(m => (
                    <button key={m} onClick={() => { setMode(m); setError('') }}
                      className={`flex-1 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors ${mode === m ? 'bg-primary text-primary-foreground' : 'text-foreground/60'}`}>
                      {m === 'login' ? 'Sign in' : 'Sign up'}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition" />
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition" />
                  {mode === 'signup' && (
                    <input type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition" />
                  )}
                </div>

                {error && <p className="text-xs text-destructive mt-2">{error}</p>}

                <button onClick={handleSubmit} disabled={loading}
                  className="w-full mt-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition">
                  {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}