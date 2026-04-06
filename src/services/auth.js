import { jwtDecode } from 'jwt-decode'; // Note the brackets { }
export function setToken(token) {
  // If the token is an object, extract the string property
  if (typeof token === 'object' && token.token) {
    localStorage.setItem('ps_token', token.token);
  } else {
    localStorage.setItem('ps_token', token);
  }
}

export function getToken() {
  return localStorage.getItem('ps_token');
}

export function getUserInfo() {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      // Matches your .NET 'uid' or 'sub' claim
      id: decoded.uid || decoded.sub, 
      // Matches ClaimTypes.Role
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role 
    };
  } catch (e) {
    return null;
  }
}