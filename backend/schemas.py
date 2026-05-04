from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, date

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: str = "member"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None

class ProjectOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    created_by: int
    created_at: datetime
    member_count: Optional[int] = 0
    
    model_config = ConfigDict(from_attributes=True)

class MemberOut(BaseModel):
    id: int
    user: UserOut
    role: str
    
    model_config = ConfigDict(from_attributes=True)

class ProjectWithMembers(ProjectOut):
    members: List[MemberOut] = []
    
    model_config = ConfigDict(from_attributes=True)

class MemberAdd(BaseModel):
    user_id: int
    role: str = "member"

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: int
    assigned_to: Optional[int] = None
    priority: str = "medium"
    due_date: Optional[date] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[int] = None
    due_date: Optional[date] = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    project_id: int
    assigned_to: Optional[int]
    assignee: Optional[UserOut] = None
    created_by: int
    due_date: Optional[date]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DashboardStats(BaseModel):
    total: int
    completed: int
    in_progress: int
    overdue: int
