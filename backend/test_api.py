from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token

client = TestClient(app)
token = create_access_token({"sub": "1111111111"})
response = client.get("/api/conversations/", headers={"Authorization": f"Bearer {token}"})
print(response.json())
