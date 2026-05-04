import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, createProject, deleteProject } from '../api/projects'
import { useAuth } from '../context/AuthContext'
import { FullPageSpinner } from '../components/LoadingSpinner'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', description: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await getProjects()
      setProjects(res.data)
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreate = async () => {
    if (!newProject.title.trim()) {
      setError('Project name is required')
      return
    }
    
    try {
      setCreating(true)
      setError('')
      await createProject({ title: newProject.title, description: newProject.description })
      setShowModal(false)
      setNewProject({ title: '', description: '' })
      fetchProjects()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (window.confirm("Delete this project? This cannot be undone.")) {
      try {
        await deleteProject(id)
        fetchProjects()
      } catch (err) {
        console.error('Error deleting project:', err)
        alert('Failed to delete project')
      }
    }
  }

  if (loading && projects.length === 0) return <FullPageSpinner />

  const gradients = [
    'var(--grad-primary)', 
    'var(--grad-secondary)', 
    'var(--grad-success)', 
    'var(--grad-warning)', 
    'var(--grad-orange)'
  ]

  return (
    <div>
      <style>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .project-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>📁 Projects</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your team projects</p>
        </div>
        {isAdmin && (
          <button 
            className="btn-primary" 
            onClick={() => setShowModal(true)}
          >
            ＋ New Project
          </button>
        )}
      </div>

      {/* PROJECTS GRID */}
      {projects.length === 0 && !loading ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📁</div>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No projects yet</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Create your first project to get started</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project, idx) => {
            const grad = gradients[idx % gradients.length]
            return (
              <div 
                key={project.id} 
                className="glass glass-hover project-card"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div style={{ height: '5px', background: grad, borderRadius: '20px 20px 0 0', position: 'absolute', top: 0, left: 0, right: 0 }} />
                
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', background: grad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '18px', color: 'white'
                    }}>
                      {(project.title || project.name || 'P').charAt(0).toUpperCase()}
                    </div>
                    {isAdmin && (
                      <div 
                        onClick={(e) => handleDelete(e, project.id)}
                        style={{ fontSize: '18px', padding: '4px', opacity: 0.7, transition: '0.2s', borderRadius: '8px' }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                        onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                        title="Delete project"
                      >
                        🗑️
                      </div>
                    )}
                  </div>
                  
                  <h3 className="line-clamp-1" style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: '16px 0 8px' }}>
                    {project.title || project.name}
                  </h3>
                  
                  <p className="line-clamp-2" style={{ color: 'var(--text-secondary)', fontSize: '14px', minHeight: '40px' }}>
                    {project.description || 'No description provided.'}
                  </p>

                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      👥 {project.members?.length || 0} members
                    </div>
                    <div className="gradient-text" style={{ fontSize: '13px', fontWeight: 600 }}>
                      View →
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="glass fade-in" style={{ width: '500px', maxWidth: '90%', padding: '40px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>✨ Create New Project</h2>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                Project Name *
              </label>
              <input
                className="input-glass"
                type="text"
                placeholder="Enter project name"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </div>

            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                Description
              </label>
              <textarea
                className="input-glass"
                rows={4}
                placeholder="What is this project about?"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                style={{ resize: 'none' }}
              />
            </div>

            {error && (
              <div style={{
                marginTop: '16px', padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(250,112,154,0.12)', border: '1px solid rgba(250,112,154,0.3)',
                color: '#fa709a', fontSize: '13px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginTop: '28px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
