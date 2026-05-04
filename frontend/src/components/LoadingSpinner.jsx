export function LoadingSpinner() {
  return (
    <div style={{
      width: '24px', height: '24px',
      border: '3px solid rgba(255,255,255,0.2)',
      borderTop: '3px solid #667eea',
      borderRadius: '50%'
    }} className="spin" />
  )
}

export function FullPageSpinner() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px'
    }}>
      <LoadingSpinner />
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        Loading...
      </p>
    </div>
  )
}

export default LoadingSpinner
