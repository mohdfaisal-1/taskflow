export default function Badge({ type, children }) {
  const styles = {
    'todo': { color: '#4facfe', background: 'rgba(79,172,254,0.15)', border: '1px solid rgba(79,172,254,0.3)' },
    'in-progress': { color: '#f7971e', background: 'rgba(247,151,30,0.15)', border: '1px solid rgba(247,151,30,0.3)' },
    'done': { color: '#43e97b', background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)' },
    'low': { color: '#43e97b', background: 'rgba(67,233,123,0.12)', border: '1px solid transparent' },
    'medium': { color: '#f7971e', background: 'rgba(247,151,30,0.12)', border: '1px solid transparent' },
    'high': { color: '#fa709a', background: 'rgba(250,112,154,0.12)', border: '1px solid transparent' },
    'admin': { color: '#667eea', background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.3)' },
    'member': { color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.1)', border: '1px solid transparent' },
  }

  const style = styles[type] || styles['member']

  return (
    <span style={{
      ...style,
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '20px',
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: '600',
    }}>
      {children || type?.charAt(0).toUpperCase() + type?.slice(1)}
    </span>
  )
}
