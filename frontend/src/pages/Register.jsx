import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../api/auth'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('member')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      setError('')
      const { data } = await registerUser({ name, email, password, role })
      login(data.access_token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', position: 'relative', padding: '20px'
    }}>
      {/* Floating orbs */}
      <div style={{
        position: 'absolute', pointerEvents: 'none',
        top: '-100px', left: '-100px', width: '350px', height: '350px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,126,234,0.2), transparent)',
        filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute', pointerEvents: 'none',
        bottom: '-80px', right: '-80px', width: '280px', height: '280px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,147,251,0.15), transparent)',
        filter: 'blur(60px)'
      }} />

      <div className="glass fade-in" style={{
        maxWidth: '440px', width: '100%', padding: '48px',
        borderRadius: '24px', position: 'relative', zIndex: 1
      }}>
        <div style={{
          width: '56px', height: '56px', background: 'var(--grad-primary)',
          borderRadius: '50%', margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px'
        }}>
          🚀
        </div>
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
          Create Account
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
          Join TaskFlow and manage your team
        </p>

        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
              Full Name
            </label>
            <input
              className="input-glass"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
              Email Address
            </label>
            <input
              className="input-glass"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="input-glass"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                }}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
              Confirm Password
            </label>
            <input
              className="input-glass"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
              I am a...
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setRole('member')}
                className={role === 'member' ? '' : 'btn-ghost'}
                style={role === 'member' ? {
                  background: 'var(--grad-primary)', border: 'none', color: 'white',
                  boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
                  flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.3s ease'
                } : {
                  flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.3s ease'
                }}
              >
                👤 Member
              </button>
              <button
                onClick={() => setRole('admin')}
                className={role === 'admin' ? '' : 'btn-ghost'}
                style={role === 'admin' ? {
                  background: 'var(--grad-primary)', border: 'none', color: 'white',
                  boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
                  flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.3s ease'
                } : {
                  flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.3s ease'
                }}
              >
                ⚡ Admin
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              marginTop: '12px', padding: '12px 16px', borderRadius: '10px',
              background: 'rgba(250,112,154,0.12)', border: '1px solid rgba(250,112,154,0.3)',
              color: '#fa709a', fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: '24px', width: '100%', height: '50px', fontSize: '16px' }}
          >
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>

          <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" className="gradient-text" style={{ textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
