import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Role, User } from '../types'
import { DEMO_USERS } from '../data/seed'

interface AuthValue {
  user: User
  role: Role
  signedIn: boolean
  signIn: (role: Role) => void
  signOut: () => void
  updateProfile: (patch: Partial<Pick<User, 'name' | 'course'>>) => void
}

const AuthContext = createContext<AuthValue | null>(null)
const KEY = 'fmc.session.v1'

interface Session { role: Role; signedIn: boolean; overrides: Record<string, Partial<User>> }

function load(): Session {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { role: 'student', signedIn: true, overrides: {} }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(load)
  const save = (s: Session) => { setSession(s); try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ } }

  const base = DEMO_USERS.find((u) => u.role === session.role)!
  const user: User = { ...base, ...(session.overrides[base.id] ?? {}) }

  const value: AuthValue = {
    user, role: session.role, signedIn: session.signedIn,
    signIn: (role) => save({ ...session, role, signedIn: true }),
    signOut: () => save({ ...session, role: 'student', signedIn: false }),
    updateProfile: (p) => save({ ...session, overrides: { ...session.overrides, [user.id]: { ...(session.overrides[user.id] ?? {}), ...p } } }),
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
