import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProject, addMember, removeMember } from '../api/projects'
import { createTask, updateTask, deleteTask } from '../api/tasks'
import { useAuth } from '../context/AuthContext'
import { FullPageSpinner } from '../components/LoadingSpinner'
import Badge from '../components/Badge'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberId, setNewMemberId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('member')
  const [addingMember, setAddingMember] = useState(false)

  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' })
  const [addingTask, setAddingTask] = useState(false)

  const { user, isAdmin } = useAuth()

  const fetchProject = async () => {
    try {
      setLoading(true)
      const res = await getProject(id)
      setProject(res.data)
    } catch (err) {
      console.error('Failed to fetch project', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [id])

  const handleAddMember = async () => {
    if (!newMemberId) return alert('Enter user ID')
    try {
      setAddingMember(true)
      await addMember(id, { user_id: parseInt(newMemberId), role: newMemberRole })
      setShowAddMember(false)
      setNewMemberId('')
      setNewMemberRole('member')
      fetchProject()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add member')
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberUserId) => {
    if (window.confirm('Remove this member?')) {
      try {
        await removeMember(id, memberUserId)
        fetchProject()
      } catch (err) {
        alert('Failed to remove member')
      }
    }
  }

  const handleCreateTask = async () => {
    if (!newTask.title) return alert('Title is required')
    try {
      setAddingTask(true)
      await createTask({ ...newTask, project_id: parseInt(id), assigned_to: newTask.assigned_to ? parseInt(newTask.assigned_to) : null })
      setShowAddTask(false)
      setNewTask({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' })
      fetchProject()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create task')
    } finally {
      setAddingTask(false)
    }
  }

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus })
      fetchProject()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleDeleteTask = async (e, taskId) => {
    e.stopPropagation()
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(taskId)
        fetchProject()
      } catch (err) {
        alert('Failed to delete task')
      }
    }
  }

  if (loading && !project) return <FullPageSpinner />
  if (!project) return <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Project not found.</div>

  const gradients = [
    'var(--grad-primary)',
    'var(--grad-secondary)',
    'var(--grad-success)',
    'var(--grad-warning)',
    'var(--grad-orange)'
  ]

  const columns = [
    { id: 'todo', label: '📋 To Do', color: '#4facfe' },
    { id: 'in-progress', label: '⚡ In Progress', color: '#f7971e' },
    { id: 'done', label: '✅ Done', color: '#43e97b' }
  ]

  return (
    <div>
      <style>{`
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
        .project-header::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 5px;
          background: var(--grad-primary);
          border-radius: 24px 0 0 24px;
        }
        .task-card {
          transition: all 0.2s ease;
        }
        .slide-panel {
          position: fixed;
          right: 0; top: 0;
          height: 100vh;
          width: 480px;
          max-width: 100vw;
          z-index: 50;
          border-left: 1px solid var(--glass-border);
          transform: translateX(0);
          transition: transform 0.3s ease;
          overflow-y: auto;
          padding: 32px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        select.input-glass option {
          background: #302b63;
        }
        @media (max-width: 1024px) {
          .kanban-board {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* BACK BUTTON */}
      <Link to="/projects" className="gradient-text" style={{ textDecoration: 'none', marginBottom: '20px', display: 'inline-block', fontWeight: 600 }}>
        ← Back to Projects
      </Link>

      {/* PROJECT HEADER */}
      <div className="glass project-header" style={{ padding: '32px', marginBottom: '24px', position: 'relative', borderRadius: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'white', margin: 0 }}>{project.title || project.name}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{project.description || 'No description provided.'}</p>
        <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '12px' }}>
          Created by {project.creator?.name || 'Unknown'}
        </div>
      </div>

      {/* MEMBERS SECTION */}
      <div className="glass" style={{ padding: '28px', marginBottom: '24px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'white' }}>👥 Team Members</h2>
            <Badge type="member">{project.members?.length || 0}</Badge>
          </div>
          {isAdmin && (
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setShowAddMember(true)}>
              ＋ Add Member
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
          {project.members?.map((member, index) => {
            const grad = gradients[index % gradients.length]
            return (
              <div key={member.id || member.user?.id} className="glass" style={{ padding: '20px', borderRadius: '16px', minWidth: '220px', flex: 1, maxWidth: '280px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%', background: grad,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '20px', color: 'white', flexShrink: 0
                  }}>
                    {(member.user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ color: 'white', fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {member.user?.name || 'Unknown User'}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', marginBottom: '4px' }}>
                      {member.user?.email || ''}
                    </div>
                    <Badge type={member.role} />
                  </div>
                </div>
                {isAdmin && member.user?.id !== user?.id && (
                  <button
                    onClick={() => handleRemoveMember(member.user?.id)}
                    style={{ position: 'absolute', top: '12px', right: '12px', color: '#fa709a', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '4px' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* TASKS SECTION */}
      <div className="glass" style={{ padding: '28px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'white' }}>✅ Tasks</h2>
            <Badge type="member">{project.tasks?.length || 0}</Badge>
          </div>
          {isAdmin && (
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setShowAddTask(true)}>
              ＋ Add Task
            </button>
          )}
        </div>

        <div className="kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {columns.map(col => {
            const colTasks = (project.tasks || []).filter(t => t.status === col.id)
            return (
              <div key={col.id} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '16px', minHeight: '300px', borderTop: `3px solid ${col.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{col.label}</div>
                  <div className="glass" style={{ padding: '2px 8px', fontSize: '12px', borderRadius: '10px' }}>{colTasks.length}</div>
                </div>

                <div>
                  {colTasks.map(task => (
                    <div key={task.id} className="glass glass-hover task-card" style={{ padding: '16px', marginBottom: '10px', borderRadius: '14px', position: 'relative' }}>
                      {isAdmin && (
                        <div
                          onClick={(e) => handleDeleteTask(e, task.id)}
                          style={{ position: 'absolute', top: '12px', right: '12px', cursor: 'pointer', fontSize: '14px', opacity: 0.6 }}
                          title="Delete task"
                        >
                          🗑️
                        </div>
                      )}

                      <div style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginBottom: '8px', paddingRight: '20px' }}>
                        {task.title}
                      </div>
                      <div className="line-clamp-2" style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px', minHeight: '34px' }}>
                        {task.description || 'No description'}
                      </div>

                      {/* Status select for members */}
                      <select
                        className="input-glass"
                        style={{ padding: '6px 10px', fontSize: '12px', marginBottom: '12px', width: '100%' }}
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Badge type={task.priority} />
                          {task.assignee && (
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '50%', background: 'var(--grad-primary)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 600, fontSize: '10px', color: 'white'
                            }} title={task.assignee.name}>
                              {task.assignee.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        {task.due_date && (
                          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddMember && (
        <div className="modal-overlay">
          <div className="glass fade-in" style={{ padding: '32px', width: '400px', borderRadius: '24px', maxWidth: '90%' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '24px', margin: 0 }}>Add Team Member</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                User ID
              </label>
              <input
                className="input-glass"
                type="number"
                placeholder="Enter user ID"
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                Role
              </label>
              <select
                className="input-glass"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setShowAddMember(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddMember} disabled={addingMember}>
                {addingMember ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TASK MODAL (Slide in) */}
      {showAddTask && (
        <>
          <div className="modal-overlay" onClick={() => setShowAddTask(false)} />
          <div className="glass slide-panel fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>Create New Task</h2>
              <button
                onClick={() => setShowAddTask(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                Task Title *
              </label>
              <input
                className="input-glass"
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                Description
              </label>
              <textarea
                className="input-glass"
                rows={3}
                placeholder="Task details..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                Assign To
              </label>
              <select
                className="input-glass"
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
              >
                <option value="">Unassigned</option>
                {project.members?.map(m => (
                  <option key={m.user?.id} value={m.user?.id}>
                    {m.user?.name} (ID: {m.user?.id})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                Priority
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['low', 'medium', 'high'].map(pLevel => {
                  const isSelected = newTask.priority === pLevel
                  const labels = { low: '🟢 Low', medium: '🟡 Medium', high: '🔴 High' }
                  let grad = ''
                  if (isSelected) {
                    if (pLevel === 'low') grad = 'var(--grad-success)'
                    else if (pLevel === 'medium') grad = 'var(--grad-warning)'
                    else if (pLevel === 'high') grad = 'var(--grad-danger)'
                  }
                  return (
                    <button
                      key={pLevel}
                      onClick={() => setNewTask({ ...newTask, priority: pLevel })}
                      className={isSelected ? '' : 'btn-ghost'}
                      style={isSelected ? {
                        flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
                        fontWeight: 600, fontSize: '13px', transition: '0.2s', border: 'none', color: 'white',
                        background: grad, boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      } : {
                        flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
                        fontWeight: 600, fontSize: '13px', transition: '0.2s'
                      }}
                    >
                      {labels[pLevel]}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                Due Date
              </label>
              <input
                className="input-glass"
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddTask(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleCreateTask} disabled={addingTask}>
                {addingTask ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
