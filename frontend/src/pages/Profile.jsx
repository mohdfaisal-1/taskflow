import { useAuth } from '../context/AuthContext'
import Badge from '../components/Badge'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div>
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
          👤 My Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your account details and preferences
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
        {/* PROFILE CARD */}
        <div className="glass fade-in" style={{ padding: '40px', display: 'flex', gap: '32px', alignItems: 'center' }}>
          {/* Avatar */}
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px', fontWeight: 700, color: 'white',
            boxShadow: '0 8px 32px rgba(102,126,234,0.4)',
            flexShrink: 0
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          {/* User Details */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
              {user?.name || 'Unknown User'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {user?.email || 'No email provided'}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Badge type={user?.role || 'member'} />
              <Badge type="success">Active</Badge>
            </div>
          </div>
        </div>

        {/* ACCOUNT INFO */}
        <div className="glass fade-in" style={{ padding: '32px', animationDelay: '0.1s' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '24px' }}>
            Account Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Full Name</label>
              <div className="input-glass" style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                {user?.name || '-'}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Email Address</label>
              <div className="input-glass" style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                {user?.email || '-'}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Role Level</label>
              <div className="input-glass" style={{ opacity: 0.7, cursor: 'not-allowed', textTransform: 'capitalize' }}>
                {user?.role || 'Member'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Currently, profile updates are disabled. Please contact your system administrator to change your email or password.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
