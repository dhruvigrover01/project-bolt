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

// Demo user for local development
const demoProfile: UserProfile = {
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

// Demo user object
const demoUser: User = {
  id: 'demo-user-1',
  email: 'demo@algomart.com',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: { name: 'Alex Thompson' },
  created_at: '2023-06-15',
} as User;

// ==================== CONTEXT ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // ALWAYS run in demo mode for now (no Supabase configured)
  const isDemo = true;

  // Initialize with demo user already logged in
  const [user, setUser] = useState<User | null>(demoUser);
  const [profile, setProfile] = useState<UserProfile | null>(demoProfile);
  const [session, setSession] = useState<Session | null>(null);
  const [loading] = useState(false); // Never loading in demo mode

  // ==================== AUTH METHODS ====================

  const signUp = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser({ ...demoUser, email } as User);
    setProfile({ ...demoProfile, email, name });
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser({ ...demoUser, email } as User);
    setProfile(demoProfile);
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
    await new Promise(resolve => setTimeout(resolve, 300));
    const googleProfile = {
      ...demoProfile,
      name: 'Google User',
      email: 'user@gmail.com',
      avatar_url: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    };
    setUser({ ...demoUser, id: 'demo-google-user', email: 'user@gmail.com' } as User);
    setProfile(googleProfile);
    return { error: null };
  };

  const signInWithWallet = async (address: string, _signature: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const walletProfile = {
      ...demoProfile,
      name: `${address.slice(0, 6)}...${address.slice(-4)}`,
      email: `${address.slice(0, 8)}@wallet`,
    };
    setUser({ ...demoUser, id: 'demo-wallet-user', email: walletProfile.email } as User);
    setProfile(walletProfile);
    return { error: null };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    return { error: null };
  };

  const refreshProfile = async () => {
    // In demo mode, just reset to demo profile
    if (user) {
      setProfile(demoProfile);
    }
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
