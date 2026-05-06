from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Project, ProjectMember, User
from schemas import ProjectCreate, ProjectOut, ProjectWithMembers, MemberAdd, MemberOut
from dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("", response_model=ProjectOut)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    new_project = Project(
        title=project_in.title,
        description=project_in.description,
        created_by=current_user.id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    new_member = ProjectMember(
        project_id=new_project.id,
        user_id=current_user.id,
        role="admin"
    )
    db.add(new_member)
    db.commit()
    
    new_project.member_count = 1
    return new_project

@router.get("", response_model=List[ProjectOut])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).join(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()
    for proj in projects:
        proj.member_count = len(proj.members)
    return projects

@router.get("/{project_id}", response_model=ProjectWithMembers)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    is_member = db.query(ProjectMember).filter(ProjectMember.project_id == project_id, ProjectMember.user_id == current_user.id).first()
    if not is_member:
        raise HTTPException(status_code=403, detail="Not a member of this project")
        
    project.member_count = len(project.members)
    return project

@router.post("/{project_id}/members", response_model=List[MemberOut])
def add_member(project_id: int, member_in: MemberAdd, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    current_member = db.query(ProjectMember).filter(ProjectMember.project_id == project_id, ProjectMember.user_id == current_user.id).first()
    if not current_member or current_member.role != "admin":
        raise HTTPException(status_code=403, detail="Must be project admin to add members")
        
    target_user = db.query(User).filter(User.id == member_in.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    existing_member = db.query(ProjectMember).filter(ProjectMember.project_id == project_id, ProjectMember.user_id == member_in.user_id).first()
    if existing_member:
        raise HTTPException(status_code=400, detail="Already a member")
        
    new_member = ProjectMember(project_id=project_id, user_id=member_in.user_id, role=member_in.role)
    db.add(new_member)
    db.commit()
    
    return project.members

@router.delete("/{project_id}/members/{user_id}")
def remove_member(project_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_member = db.query(ProjectMember).filter(ProjectMember.project_id == project_id, ProjectMember.user_id == current_user.id).first()
    if not current_member or current_member.role != "admin":
        raise HTTPException(status_code=403, detail="Must be project admin")
        
    target_member = db.query(ProjectMember).filter(ProjectMember.project_id == project_id, ProjectMember.user_id == user_id).first()
    if not target_member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    if target_member.user_id == current_user.id and target_member.role == "admin":
        admin_count = db.query(ProjectMember).filter(ProjectMember.project_id == project_id, ProjectMember.role == "admin").count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove yourself if you are the only admin")
            
    db.delete(target_member)
    db.commit()
    return {"message": "Member removed successfully"}

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if project.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only creator can delete project")
        
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}
