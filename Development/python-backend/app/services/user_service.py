import httpx
from typing import Optional, Dict
import os

class UserService:
    """Service to validate users against the MySQL authentication backend"""
    
    def __init__(self, auth_api_url: str = None):
        self.auth_api_url = auth_api_url or os.getenv("AUTH_API_URL", "http://localhost:8080")
    
    async def validate_user_exists(self, user_id: str, token: str) -> bool:
        """
        Validate that a user exists in the MySQL database via the authentication API
        
        Args:
            user_id: UUID of the user from MySQL
            token: JWT token for authentication
            
        Returns:
            True if user exists and token is valid, False otherwise
        """
        async with httpx.AsyncClient() as client:
            try:
                url = f"{self.auth_api_url}/api/auth/users/{user_id}"
                print(f"[UserService] Validating user: {user_id}")
                print(f"[UserService] Request URL: {url}")
                print(f"[UserService] Token: {token[:20]}..." if token else "[UserService] No token")
                
                response = await client.get(
                    url,
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=5.0
                )
                
                print(f"[UserService] Response status: {response.status_code}")
                if response.status_code != 200:
                    print(f"[UserService] Response body: {response.text}")
                
                return response.status_code == 200
            except httpx.RequestError as e:
                # Network error or timeout
                print(f"[UserService] Request error: {str(e)}")
                return False
            except Exception as e:
                print(f"[UserService] Unexpected error: {str(e)}")
                return False
    
    async def get_user_info(self, user_id: str, token: str) -> Optional[Dict]:
        """
        Get user information from MySQL database
        
        Args:
            user_id: UUID of the user
            token: JWT token for authentication
            
        Returns:
            User data dict or None if not found
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.auth_api_url}/api/auth/users/{user_id}",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=5.0
                )
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception:
                return None
    
    def extract_user_id_from_token(self, token: str) -> Optional[str]:
        """
        Extract user ID from JWT token (basic implementation)
        For production, use proper JWT validation
        
        Args:
            token: JWT token
            
        Returns:
            User ID or None
        """
        try:
            import jwt
            # Decode without verification for now (add secret verification in production)
            payload = jwt.decode(token, options={"verify_signature": False})
            return payload.get("sub") or payload.get("userId")
        except:
            return None
