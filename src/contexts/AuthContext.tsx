
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'college' | 'student';
  collegeName?: string;
  collegeId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'college' | 'student') => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'college' | 'student', collegeName?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const generateToken = (user: User): string => {
    // Simple JWT-like token simulation
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    const signature = btoa('signature'); // In real app, this would be properly signed
    return `${header}.${payload}.${signature}`;
  };

  const login = async (email: string, password: string, role: 'college' | 'student'): Promise<boolean> => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingUser = users.find((u: any) => u.email === email && u.role === role);
      
      if (existingUser && existingUser.password === password) {
        const userData: User = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          collegeName: existingUser.collegeName,
          collegeId: existingUser.collegeId
        };
        
        const token = generateToken(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'college' | 'student', collegeName?: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        return false; // User already exists
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role,
        collegeName: role === 'college' ? name : collegeName,
        collegeId: role === 'college' ? Date.now().toString() : undefined
      };

      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      // Auto login after registration
      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        collegeName: newUser.collegeName,
        collegeId: newUser.collegeId
      };

      const token = generateToken(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
