import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, db, isFirebaseConfigured } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [ready, setReady] = useState(!isFirebaseConfigured)

  useEffect(() => {
    if (!auth || !db) return undefined

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      if (!nextUser) {
        setIsAdmin(false)
        setReady(true)
        return
      }
      setReady(false)
      try {
        const adminDoc = await getDoc(doc(db, 'admins', nextUser.uid))
        setIsAdmin(adminDoc.exists())
      } catch {
        setIsAdmin(false)
      } finally {
        setReady(true)
      }
    })
  }, [])

  const api = useMemo(
    () => ({
      user,
      isAdmin,
      ready,
      configured: isFirebaseConfigured,
      async signIn(email, password) {
        if (!auth) throw new Error('Add your Firebase keys before signing in.')
        await signInWithEmailAndPassword(auth, email.trim(), password)
      },
      async signOut() {
        if (!auth) return
        await signOut(auth)
      },
    }),
    [user, isAdmin, ready],
  )

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const authState = useContext(AuthContext)
  if (!authState) throw new Error('useAuth must be used inside AuthProvider')
  return authState
}
