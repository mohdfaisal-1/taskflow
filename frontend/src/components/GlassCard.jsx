export default function GlassCard({ 
  children, className = '', onClick, hoverable = true 
}) {
  return (
    <div
      className={`glass fade-in ${hoverable ? 'glass-hover' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  )
}
