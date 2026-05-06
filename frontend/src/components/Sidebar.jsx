import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Badge from './Badge'

export default function Sidebar() {
  const { user, logout } = useAuth()
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/tasks', label: 'Tasks', icon: '✅' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <>
      <style>{`
        .sidebar-nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 16px; border-radius: 14px; margin-bottom: 6px;
          font-weight: 500; font-size: 15px; text-decoration: none;
          transition: all 0.25s ease; color: var(--text-secondary);
        }
        .sidebar-nav-item:hover:not(.active) {
          background: rgba(255,255,255,0.08);
          color: white;
        }
        .sidebar-nav-item.active {
          background: var(--grad-primary);
          color: white;
          box-shadow: 0 4px 15px rgba(102,126,234,0.4);
        }
        .logout-btn {
          width: 100%; margin-top: 12px; padding: 10px;
          background: rgba(250,112,154,0.12);
          border: 1px solid rgba(250,112,154,0.25);
          border-radius: 10px; color: #fa709a;
          cursor: pointer; font-weight: 600; font-size: 14px;
          font-family: inherit; transition: all 0.3s ease;
        }
        .logout-btn:hover {
          background: rgba(250,112,154,0.22);
        }
      `}</style>
      <div style={{
        width: '260px', minWidth: '260px',
        height: '100vh',
        background: 'rgba(15,12,41,0.85)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column',
        padding: '28px 20px'
      }}>
        
        {/* SECTION 1 - Logo */}
        <div className="gradient-text" style={{ fontSize: '22px', fontWeight: 800, marginBottom: '32px' }}>
          ⚡ TaskFlow
        </div>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

        {/* SECTION 2 - Navigation */}
        <div style={{ flex: 1, marginTop: '24px' }}>
          {navItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* SECTION 3 - User card */}
        <div className="glass" style={{ padding: '16px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '16px', color: 'white', flexShrink: 0
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ display: 'flex' }}>
                <Badge type={user?.role || 'member'} />
              </div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
        
      </div>
    </>
  )
}
