import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { UserProfile } from '../types';

// ==================== TYPES ====================

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isDemo: boolean;
  
  // Email/Password auth
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  
  // Social auth
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  
  // Web3 auth
  signInWithWallet: (address: string, signature: string) => Promise<{ error: Error | null }>;
  
  // Profile
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

// Create default profile with user data
const createUserProfile = (email: string, name?: string): UserProfile => ({
  id: `user-${Date.now()}`,
  email: email,
  name: name || email.split('@')[0],
  avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
  bio: '',
  location: '',
  website: '',
  twitter: '',
  joined_at: new Date().toISOString().split('T')[0],
  subscription_tier: 'free',
  badges: [],
  achievements: [],
  skill_tags: [],
  performance_score: 0,
  followers_count: 0,
  following_count: 0,
  total_earnings: 0,
  strategies_created: 0,
  strategies_subscribed: 0,
  is_verified_creator: false,
  referral_code: `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  referral_earnings: 0,
});

// Demo user for local development (default)
const defaultDemoProfile: UserProfile = {
  id: 'demo-user-1',
  email: 'demo@algomart.com',
  name: 'Alex Thompson',
  avatar_url: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
  bio: 'Quantitative trader with 8+ years of experience in algorithmic trading.',
  location: 'New York, USA',
  website: 'https://alexthompson.dev',
  twitter: '@alextrader',
  joined_at: '2023-06-15',
  subscription_tier: 'trader_pro',
  badges: [
    { id: '1', name: 'Early Adopter', description: 'Joined during beta', icon: '🚀', color: '#3B82F6', earned_at: '2023-06-15', rarity: 'rare' },
    { id: '2', name: 'Top Performer', description: 'Achieved 100%+ ROI', icon: '🏆', color: '#F59E0B', earned_at: '2024-01-20', rarity: 'epic' },
    { id: '3', name: 'Community Leader', description: '100+ helpful reviews', icon: '⭐', color: '#10B981', earned_at: '2024-03-10', rarity: 'legendary' },
  ],
  achievements: [
    { id: '1', name: 'First Trade', description: 'Execute your first trade', icon: '📈', progress: 1, max_progress: 1, completed: true, completed_at: '2023-06-16', reward_points: 100 },
    { id: '2', name: 'Strategy Hunter', description: 'Subscribe to 10 strategies', icon: '🎯', progress: 7, max_progress: 10, completed: false, reward_points: 500 },
    { id: '3', name: 'Profit Master', description: 'Earn $10,000 in profits', icon: '💰', progress: 8500, max_progress: 10000, completed: false, reward_points: 1000 },
  ],
  skill_tags: ['Momentum Trading', 'Risk Management', 'Python', 'Machine Learning'],
  performance_score: 87,
  followers_count: 1234,
  following_count: 56,
  total_earnings: 45670,
  strategies_created: 3,
  strategies_subscribed: 7,
  is_verified_creator: true,
  referral_code: 'ALEX2024',
  referral_earnings: 2340,
};

// ==================== CONTEXT ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isDemo = false;

  // Initialize with null user and profile
  const [user, setUser] = useState<User | null>(null);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading] = useState(false);

  // ==================== AUTH METHODS ====================

  const signUp = async (email: string, _password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProfile = createUserProfile(email, name);
    const newUser = {
      id: newProfile.id,
      email: email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { name },
      created_at: new Date().toISOString(),
    } as User;
    
    setUser(newUser);
    setProfile(newProfile);
    return { error: null };
  };

  const signIn = async (email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create profile with user's email
    const userProfile = createUserProfile(email);
    const loggedInUser = {
      id: userProfile.id,
      email: email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { name: email.split('@')[0] },
      created_at: new Date().toISOString(),
    } as User;
    
    setUser(loggedInUser);
    setProfile(userProfile);
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const resetPassword = async (_email: string) => {
    return { error: null };
  };

  const signInWithGoogle = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate Google user
    const googleEmail = 'user@gmail.com';
    const googleProfile = createUserProfile(googleEmail, 'Google User');
    googleProfile.avatar_url = 'https://lh3.googleusercontent.com/a/default-user=s96-c';
    
    const googleUser = {
      id: googleProfile.id,
      email: googleEmail,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: { provider: 'google' },
      user_metadata: { name: 'Google User', avatar_url: googleProfile.avatar_url },
      created_at: new Date().toISOString(),
    } as User;
    
    setUser(googleUser);
    setProfile(googleProfile);
    return { error: null };
  };

  const signInWithWallet = async (address: string, _signature: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const walletEmail = `${address.slice(0, 8)}@wallet`;
    const walletName = `${address.slice(0, 6)}...${address.slice(-4)}`;
    const walletProfile = createUserProfile(walletEmail, walletName);
    
    const walletUser = {
      id: walletProfile.id,
      email: walletEmail,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: { provider: 'wallet', wallet_address: address },
      user_metadata: { name: walletName },
      created_at: new Date().toISOString(),
    } as User;
    
    setUser(walletUser);
    setProfile(walletProfile);
    return { error: null };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    return { error: null };
  };

  const refreshProfile = async () => {
    // In demo mode, nothing to refresh from server
  };

  // ==================== CONTEXT VALUE ====================

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isDemo,
    signUp,
    signIn,
    signOut,
    resetPassword,
    signInWithGoogle,
    signInWithWallet,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==================== HOOK ====================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
