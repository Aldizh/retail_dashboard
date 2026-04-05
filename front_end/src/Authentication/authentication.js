import api from '../api';

// Log in a user with email and password
export async function loginEmailPassword(email, password) {
  try {
    const response = await api.post('/auth/login', { username: email, password });
    if (response.data.success) {
      const token = response.data.token;
      // Store token in localStorage for client-side validation
      localStorage.setItem('token', token);
      return {
        _accessToken: token,
        user: response.data.user
      };
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Email/password login failed:', error);
    throw new Error(error.response?.data?.message || error.message || 'Authentication failed');
  }
}

// Log in anonymously (create a demo user or use a default account)
export async function loginAnonymous() {
  try {
    // For anonymous login, we'll use a demo account
    // You can modify this to create temporary users or use a shared demo account
    const response = await api.post('/auth/login', {
      username: 'demo',
      password: 'demo123'
    });
    console.log("Anonymous login response:", response.data);

    if (response.data.success) {
      const token = response.data.token;
      // Store token in localStorage for client-side validation
      localStorage.setItem('token', token);
      return {
        _accessToken: token,
        user: response.data.user
      };
    } else {
      throw new Error(response.data.message || 'Anonymous login failed');
    }
  } catch (error) {
    console.error('Anonymous login failed:', error);
    throw new Error(error.response?.data?.message || error.message || 'Anonymous authentication failed');
  }
}

// API key login (for admin/system access)
export async function loginWithKey() {
  try {
    // Use API key as password for admin user
    const apiKey = process.env.REACT_APP_API_KEY || 'admin123';
    const response = await api.post('/auth/login', {
      username: 'admin',
      password: apiKey
    });

    if (response.data.success) {
      const token = response.data.token;
      // Store token in localStorage for client-side validation
      localStorage.setItem('token', token);
      return {
        _accessToken: token,
        user: response.data.user
      };
    } else {
      throw new Error(response.data.message || 'API key login failed');
    }
  } catch (error) {
    console.error('API key login failed:', error);
    throw new Error(error.response?.data?.message || error.message || 'API key authentication failed');
  }
}

// Register a new user
export async function registerUser(username, email, password) {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.success) {
      const token = response.data.token;
      // Store token in localStorage for client-side validation
      localStorage.setItem('token', token);
      return {
        _accessToken: token,
        user: response.data.user
      };
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error(error.response?.data?.message || error.message || 'Registration failed');
  }
}

// Get current user profile
export async function getCurrentUser() {
  try {
    const response = await api.get('/auth/profile');
    return response.data.user;
  } catch (error) {
    console.error('Get user profile failed:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to get user profile');
  }
}

// Logout user
export async function logoutUser() {
  try {
    // Clear token from localStorage
    localStorage.removeItem('token');
    await api.post('/auth/logout');
    window.location = "/";
  } catch (error) {
    console.error('Logout failed:', error);
    // Still redirect and clear token even if logout request fails
    localStorage.removeItem('token');
    window.location = "/";
  }
}

export function hasLoggedInUser() {
  // Check if valid JWT token exists in localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }
  
  try {
    // Decode JWT and check expiration
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }
    
    // Decode payload (second part)
    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Check if token is expired
    const expirationTime = payload.exp * 1000; // exp is in seconds, convert to ms
    const currentTime = Date.now();
    
    return currentTime < expirationTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}