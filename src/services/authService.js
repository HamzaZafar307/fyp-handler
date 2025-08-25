import api from './api';

// Mock users for testing (remove when backend is ready)
const MOCK_USERS = [
  {
    id: 1,
    email: 'student@gmail.com',
    password: 'student123',
    firstName: 'John',
    lastName: 'Student',
    role: 'Student',
    department: 'Computer Science'
  },
  {
    id: 2,
    email: 'teacher@gmail.com',
    password: 'teacher123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'Teacher',
    department: 'Computer Science'
  },
  {
    id: 3,
    email: 'admin@gmail.com',
    password: 'admin123',
    firstName: 'Michael',
    lastName: 'Admin',
    role: 'Admin',
    department: 'Administration'
  }
];

export const authService = {
  login: async (credentials) => {
    try {
      // Mock authentication for testing
      const mockUser = MOCK_USERS.find(
        user => user.email === credentials.email && user.password === credentials.password
      );
      
      if (mockUser) {
        const { password, ...userWithoutPassword } = mockUser;
        const mockToken = `mock-token-${mockUser.id}`;
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        return {
          success: true,
          token: mockToken,
          user: userWithoutPassword,
          message: 'Login successful'
        };
      } else {
        throw new Error('Invalid email or password');
      }
      
      // Original API call (uncomment when backend is ready)
      /*
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
      */
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        throw error;
      }
      // Handle API errors when backend is connected
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.message === 'Network Error') {
        throw new Error('Cannot connect to server. Please check your connection.');
      } else {
        throw new Error(error.message || 'Login failed');
      }
    }
  },

  register: async (userData) => {
    try {
      // Mock registration for testing
      const existingUser = MOCK_USERS.find(user => user.email === userData.email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new mock user
      const newUser = {
        id: MOCK_USERS.length + 1,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'Student',
        department: userData.department || 'Computer Science'
      };
      
      const mockToken = `mock-token-${newUser.id}`;
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return {
        success: true,
        token: mockToken,
        user: newUser,
        message: 'Registration successful'
      };
      
      // Original API call (uncomment when backend is ready)
      /*
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
      */
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        throw error;
      }
      // Handle API errors when backend is connected
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 409) {
        throw new Error('User with this email already exists');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid registration data. Please check your inputs.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.message === 'Network Error') {
        throw new Error('Cannot connect to server. Please check your connection.');
      } else {
        throw new Error(error.message || 'Registration failed');
      }
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Failed to get user information');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        authService.logout();
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = authService.getStoredUser();
    return !!(token && user);
  },

  hasRole: (requiredRole) => {
    const user = authService.getStoredUser();
    return user?.role === requiredRole;
  },

  hasAnyRole: (requiredRoles) => {
    const user = authService.getStoredUser();
    return requiredRoles.includes(user?.role);
  }
};