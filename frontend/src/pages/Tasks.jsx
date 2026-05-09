import { useState, useEffect } from 'react'
import { getProjects, getProject } from '../api/projects'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Badge from '../components/Badge'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)

  const [selectedProject, setSelectedProject] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '', description: '', project_id: '', assigned_to: '', priority: 'medium', due_date: ''
  })
  const [projectMembers, setProjectMembers] = useState([])
  const [creating, setCreating] = useState(false)

  const { isAdmin } = useAuth()

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(console.error)
  }, [])

  const fetchTasks = async (projectId) => {
    if (!projectId) return setTasks([])
    try {
      setLoading(true)
      const res = await getTasks({ project_id: projectId })
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject)
    } else {
      setTasks([])
    }
  }, [selectedProject])

  useEffect(() => {
    if (newTask.project_id) {
      getProject(newTask.project_id)
        .then(res => setProjectMembers(res.data.members || []))
        .catch(console.error)
    } else {
      setProjectMembers([])
    }
  }, [newTask.project_id])

  const filteredTasks = tasks.filter(task => {
    if (filterStatus && task.status !== filterStatus) return false
    if (filterPriority && task.priority !== filterPriority) return false
    return true
  })

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.project_id) {
      return alert('Task Title and Project are required')
    }
    try {
      setCreating(true)
      await createTask({
        ...newTask,
        project_id: parseInt(newTask.project_id),
        assigned_to: newTask.assigned_to ? parseInt(newTask.assigned_to) : null
      })
      setShowCreateModal(false)
      setNewTask({ title: '', description: '', project_id: '', assigned_to: '', priority: 'medium', due_date: '' })

      if (selectedProject === newTask.project_id) {
        fetchTasks(selectedProject)
      } else {
        setSelectedProject(newTask.project_id)
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus })
      fetchTasks(selectedProject)
    } catch (err) {
      alert('Failed to update task status')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(taskId)
        fetchTasks(selectedProject)
      } catch (err) {
        alert('Failed to delete task')
      }
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit'
    })
  }

  const isOverdue = (dateStr) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const now = new Date()
    return d < now && d.toDateString() !== now.toDateString()
  }

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Done', value: 'done' }
  ]

  const priorityOptions = [
    { label: 'All', value: '' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ]

  return (
    <div>
      <style>{`
        .filter-bar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
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
        .task-table {
          width: 100%;
          border-collapse: collapse;
        }
        .task-table th {
          padding: 16px 20px;
          text-align: left;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          background: rgba(255,255,255,0.05);
        }
        .task-table td {
          padding: 16px 20px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .task-row:hover {
          background: rgba(255,255,255,0.04);
        }
        .task-row:last-child td {
          border-bottom: none;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 49;
        }
        select.input-glass option {
          background: #302b63;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>✅ Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage all tasks</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            ＋ Create Task
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="glass filter-bar" style={{ padding: '20px', margin: '24px 0' }}>
        <select
          className="input-glass"
          style={{ minWidth: '200px', width: 'auto' }}
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select a project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title || p.name}</option>
          ))}
        </select>

        <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)', margin: '0 8px' }} />

        <div style={{ display: 'flex', gap: '8px' }}>
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={filterStatus === opt.value ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)', margin: '0 8px' }} />

        <div style={{ display: 'flex', gap: '8px' }}>
          {priorityOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterPriority(opt.value)}
              className={filterPriority === opt.value ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* TASK TABLE */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        {!selectedProject ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>👆</div>
            Select a project to view its tasks
          </div>
        ) : loading ? (
          <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tasks found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => {
                  const overdue = isOverdue(task.due_date)
                  return (
                    <tr key={task.id} className="task-row">
                      <td>
                        <div style={{ fontWeight: 600, color: 'white' }}>{task.title}</div>
                        {task.description && (
                          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {task.project?.title || task.project?.name || 'Unknown'}
                      </td>
                      <td>
                        {task.assignee ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%', background: 'var(--grad-primary)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 600, fontSize: '14px', color: 'white', flexShrink: 0
                            }}>
                              {task.assignee.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ color: 'white', whiteSpace: 'nowrap' }}>{task.assignee.name}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                        )}
                      </td>
                      <td><Badge type={task.priority} /></td>
                      <td>
                        <select
                          className="input-glass"
                          style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td>
                        {task.due_date ? (
                          <span style={{ color: overdue ? '#fa709a' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                            {formatDate(task.due_date)} {overdue && '⚠️'}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      {isAdmin && (
                        <td>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.7 }}
                            title="Delete task"
                          >
                            🗑️
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE TASK SLIDE PANEL */}
      {showCreateModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)} />
          <div className="glass slide-panel fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>✨ Create New Task</h2>
              <button
                onClick={() => setShowCreateModal(false)}
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
                Project *
              </label>
              <select
                className="input-glass"
                value={newTask.project_id}
                onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value, assigned_to: '' })}
              >
                <option value="">Select a project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title || p.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                Assign To
              </label>
              <select
                className="input-glass"
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                disabled={!newTask.project_id}
              >
                <option value="">Unassigned</option>
                {projectMembers.map(m => (
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
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleCreateTask} disabled={creating}>
                {creating ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
