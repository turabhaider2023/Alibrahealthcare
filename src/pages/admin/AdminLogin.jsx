import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTitle } from '../../hooks/useCatalog'

function loginMessage(error) {
  const code = error?.code || ''
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'That email or password does not match.'
  }
  if (code.includes('too-many-requests')) return 'Too many attempts. Wait a few minutes and try again.'
  if (code.includes('invalid-email')) return 'Enter a valid email address.'
  return error.message || 'Could not sign in.'
}

export default function AdminLogin() {
  useTitle('Admin login')
  const navigate = useNavigate()
  const { configured, ready, user, isAdmin, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isAdmin) navigate('/admin/products', { replace: true })
  }, [isAdmin, navigate])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
    } catch (err) {
      setError(loginMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span>
            YZAR
            <small>Healthcare</small>
          </span>
        </Link>
        <h1>Admin</h1>
        {!configured ? (
          <>
            <p>Add your Firebase web config to <code>.env.local</code>, then restart the dev server.</p>
            <ol className="setup-list">
              <li>Create a Firebase project and a web app.</li>
              <li>Turn on Email/Password sign-in and create the admin user.</li>
              <li>Create a Firestore document whose id is that user’s UID, in the collection <code>admins</code>.</li>
              <li>Paste <code>firestore.rules</code> and <code>storage.rules</code> into Firebase.</li>
            </ol>
            <p className="fine">The full click-path is in README.md.</p>
          </>
        ) : user && !ready ? (
          <p>Checking admin access…</p>
        ) : user && ready && !isAdmin ? (
          <>
            <p className="alert">This account can sign in, but it is not an admin yet.</p>
            <p>
              In Firestore, open the <code>admins</code> collection and add a document with this exact id:
            </p>
            <p className="uid">{user.uid}</p>
            <button className="btn btn-dark" type="button" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <form className="stack" onSubmit={submit}>
            <label>
              Email
              <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error && <p className="alert">{error}</p>}
            <button className="btn btn-dark" type="submit" disabled={busy || !ready}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
