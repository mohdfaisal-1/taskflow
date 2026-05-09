import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard } from '../api/tasks'
import { getProjects } from '../api/projects'
import { useAuth } from '../context/AuthContext'
import { FullPageSpinner } from '../components/LoadingSpinner'
import Badge from '../components/Badge'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, projRes] = await Promise.all([
          getDashboard(),
          getProjects()
        ])
        setStats(dashRes.data.stats)
        setRecentTasks(dashRes.data.recent_tasks || [])
        setProjects(projRes.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <FullPageSpinner />

  const hour = new Date().getHours()
  let greeting = 'Good evening'
  if (hour >= 0 && hour < 12) greeting = 'Good morning'
  else if (hour >= 12 && hour < 18) greeting = 'Good afternoon'

  return (
    <div>
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .two-column-section {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
          margin-top: 32px;
        }
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .two-column-section {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        .stat-card {
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          opacity: 0.08;
          z-index: 0;
          pointer-events: none;
        }
        .stat-card-content {
          position: relative;
          z-index: 1;
        }
        .pulse-danger {
          animation: pulseRed 2s infinite;
        }
        @keyframes pulseRed {
          0% { box-shadow: 0 0 0 0 rgba(250, 112, 154, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(250, 112, 154, 0); }
          100% { box-shadow: 0 0 0 0 rgba(250, 112, 154, 0); }
        }
        .project-item {
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .project-item:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .task-row {
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .task-row:last-child {
          border-bottom: none;
        }
      `}</style>

      {/* HEADER SECTION */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
          {greeting}, {user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '36px' }}>
          Here's your TaskFlow overview for today
        </p>
      </div>

      {/* STATS GRID */}
      <div className="dashboard-grid">
        {/* Card 1 - Total Tasks */}
        <div className="glass fade-in stat-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--grad-primary)', opacity: 0.08, pointerEvents: 'none' }} />
          <div className="stat-card-content">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
              📋
            </div>
            <div style={{ fontSize: '42px', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stats?.total || 0}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Total Tasks
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'var(--grad-primary)', borderRadius: '0 0 20px 20px' }} />
        </div>

        {/* Card 2 - Completed */}
        <div className="glass fade-in stat-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--grad-success)', opacity: 0.08, pointerEvents: 'none' }} />
          <div className="stat-card-content">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--grad-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
              ✅
            </div>
            <div style={{ fontSize: '42px', fontWeight: 800, background: 'var(--grad-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stats?.completed || 0}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Completed
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'var(--grad-success)', borderRadius: '0 0 20px 20px' }} />
        </div>

        {/* Card 3 - In Progress */}
        <div className="glass fade-in stat-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--grad-secondary)', opacity: 0.08, pointerEvents: 'none' }} />
          <div className="stat-card-content">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--grad-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
              ⚡
            </div>
            <div style={{ fontSize: '42px', fontWeight: 800, background: 'var(--grad-secondary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stats?.in_progress || 0}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              In Progress
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'var(--grad-secondary)', borderRadius: '0 0 20px 20px' }} />
        </div>

        {/* Card 4 - Overdue */}
        <div className={`glass fade-in stat-card ${stats?.overdue > 0 ? 'pulse-danger' : ''}`} style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--grad-danger)', opacity: 0.08, pointerEvents: 'none' }} />
          <div className="stat-card-content">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--grad-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
              🔥
            </div>
            <div style={{ fontSize: '42px', fontWeight: 800, background: 'var(--grad-danger)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stats?.overdue || 0}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Overdue
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'var(--grad-danger)', borderRadius: '0 0 20px 20px' }} />
        </div>
      </div>

      {/* TWO COLUMN SECTION */}
      <div className="two-column-section">
        {/* LEFT - Recent Tasks */}
        <div className="glass fade-in" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>📋 My Recent Tasks</h2>
            <Badge type="member">{recentTasks.length}</Badge>
          </div>

          {recentTasks.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>No tasks assigned yet</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Tasks assigned to you will appear here</div>
            </div>
          ) : (
            <div>
              {recentTasks.slice(0, 5).map(task => (
                <div key={task.id} className="task-row">
                  <div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{task.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>{task.project?.name || 'No Project'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Badge type={task.status} />
                    <Badge type={task.priority} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT - My Projects */}
        <div className="glass fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>📁 My Projects</h2>

          {projects.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>No projects yet</div>
            </div>
          ) : (
            <div>
              {projects.slice(0, 5).map(project => (
                <div
                  key={project.id}
                  className="project-item"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{project.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>{project.members?.length || 0} members</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
