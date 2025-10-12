import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import SupabaseService from '@/services/supabaseService';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication state on mount and when page loads
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await SupabaseService.getCurrentUser();
      
      if (currentUser) {
        // Get user profile
        const userProfile = await SupabaseService.getUserProfile(currentUser.id);
        
        // Check if admin
        const isAdmin = currentUser.email === 'warrenokumu98@gmail.com';
        
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          name: `${userProfile.first_name} ${userProfile.last_name}`,
          isAdmin
        });
        
        console.log('Auth state: User authenticated', {
          email: currentUser.email,
          isAdmin
        });
      } else {
        setUser(null);
        console.log('Auth state: No user authenticated');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await SupabaseService.signIn(email, password);
      
      if (!data || !data.user) {
        throw new Error('Authentication failed');
      }

      // Get user profile
      const userProfile = await SupabaseService.getUserProfile(data.user.id);
      
      // Check if admin
      const isAdmin = email === 'warrenokumu98@gmail.com';
      
      const userData: User = {
        id: data.user.id,
        email: email,
        name: `${userProfile.first_name} ${userProfile.last_name}`,
        isAdmin
      };
      
      setUser(userData);
      
      // Navigate based on role
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SupabaseService.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

