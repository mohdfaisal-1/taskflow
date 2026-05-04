import requests

BASE_URL = "http://localhost:8000"

print("Registering Admin...")
res = requests.post(f"{BASE_URL}/api/auth/register", json={
    "name": "Admin", "email": "admin@test.com", "password": "123456", "role": "admin"
})
print("Admin Register:", res.status_code, res.json())

print("Registering Member...")
res = requests.post(f"{BASE_URL}/api/auth/register", json={
    "name": "Member", "email": "member@test.com", "password": "123456", "role": "member"
})
print("Member Register:", res.status_code, res.json())

print("Login Admin...")
res = requests.post(f"{BASE_URL}/api/auth/login", json={
    "email": "admin@test.com", "password": "123456"
})
print("Admin Login:", res.status_code, res.json())
admin_token = res.json().get("access_token")

if not admin_token:
    print("FAILED TO GET ADMIN TOKEN")
    exit(1)

print("Create Project...")
headers = {"Authorization": f"Bearer {admin_token}"}
res = requests.post(f"{BASE_URL}/api/projects", json={
    "name": "Test Project", "description": "Desc"
}, headers=headers)
print("Create Project:", res.status_code, res.json())
project_id = res.json().get("id")

print("Add Member to Project...")
member_id = 2 # Assuming the second user is member
res = requests.post(f"{BASE_URL}/api/projects/{project_id}/members", json={
    "user_id": member_id, "role": "member"
}, headers=headers)
print("Add Member:", res.status_code, res.json())

print("Create Task...")
res = requests.post(f"{BASE_URL}/api/tasks", json={
    "title": "Test Task", "description": "Desc", "project_id": project_id,
    "assigned_to": member_id, "priority": "medium", "status": "todo"
}, headers=headers)
print("Create Task:", res.status_code, res.json())
task_id = res.json().get("id")

print("Login Member...")
res = requests.post(f"{BASE_URL}/api/auth/login", json={
    "email": "member@test.com", "password": "123456"
})
print("Member Login:", res.status_code, res.json())
member_token = res.json().get("access_token")

print("Member Update Task Status...")
member_headers = {"Authorization": f"Bearer {member_token}"}
res = requests.put(f"{BASE_URL}/api/tasks/{task_id}", json={
    "status": "done"
}, headers=member_headers)
print("Update Task:", res.status_code, res.json())

print("Get Dashboard for Member...")
res = requests.get(f"{BASE_URL}/api/tasks/dashboard", headers=member_headers)
print("Dashboard:", res.status_code, res.json())
