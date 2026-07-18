const API_URL = 'http://localhost:5000/api';

/**
 * Register a new user
 * @param {Object} userData - { username, email, password }
 */
export const registerAPI = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }

    if (data.token) {
      localStorage.setItem('raagam_token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login an existing user
 * @param {Object} userData - { email, password }
 */
export const loginAPI = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    if (data.token) {
      localStorage.setItem('raagam_token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get the token from local storage
 */
export const getToken = () => {
  return localStorage.getItem('raagam_token');
};

/**
 * Logout utility
 */
export const logoutAPI = () => {
  localStorage.removeItem('raagam_token');
};

/**
 * Fetch the logged-in user's profile
 */
export const fetchUserProfile = async () => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No token found. User is not authenticated.');
  }

  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
