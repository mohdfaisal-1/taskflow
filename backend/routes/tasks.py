from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import date
from database import get_db
from models import Task, Project, ProjectMember, User
from schemas import TaskCreate, TaskOut, TaskUpdate, DashboardStats
from dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks_query = db.query(Task).filter(Task.assigned_to == current_user.id)
    
    total = tasks_query.count()
    completed = tasks_query.filter(Task.status == "done").count()
    in_progress = tasks_query.filter(Task.status == "in-progress").count()
    
    today = date.today()
    overdue = tasks_query.filter(Task.status != "done", Task.due_date < today).count()
    
    return DashboardStats(
        total=total,
        completed=completed,
        in_progress=in_progress,
        overdue=overdue
    )

@router.post("", response_model=TaskOut)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    project = db.query(Project).filter(Project.id == task_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    is_member = db.query(ProjectMember).filter(
        ProjectMember.project_id == task_in.project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    if not is_member:
        raise HTTPException(status_code=403, detail="Not a member of this project")
        
    new_task = Task(
        title=task_in.title,
        description=task_in.description,
        project_id=task_in.project_id,
        assigned_to=task_in.assigned_to,
        priority=task_in.priority,
        due_date=task_in.due_date,
        created_by=current_user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    task = db.query(Task).options(joinedload(Task.assignee)).filter(Task.id == new_task.id).first()
    return task

@router.get("", response_model=List[TaskOut])
def get_tasks(
    project_id: int = Query(...),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    if not is_member:
        raise HTTPException(status_code=403, detail="Not a member of this project")
        
    query = db.query(Task).options(joinedload(Task.assignee)).filter(Task.project_id == project_id)
    
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
        
    return query.all()

@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task_in: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).options(joinedload(Task.assignee)).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    current_member = db.query(ProjectMember).filter(
        ProjectMember.project_id == task.project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    
    if not current_member:
        raise HTTPException(status_code=403, detail="Not a member of this project")
        
    if current_member.role != "admin":
        update_data = task_in.model_dump(exclude_unset=True)
        for key in update_data.keys():
            if key != "status":
                raise HTTPException(status_code=403, detail="Members can only update status")
                
    update_data = task_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
        
    db.commit()
    db.refresh(task)
    
    task = db.query(Task).options(joinedload(Task.assignee)).filter(Task.id == task_id).first()
    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
