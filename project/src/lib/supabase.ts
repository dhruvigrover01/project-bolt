import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      strategies: {
        Row: {
          id: string;
          creator_id: string;
          name: string;
          description: string;
          category: string;
          asset_class: string;
          price_monthly: number;
          min_capital: number;
          risk_level: 'low' | 'medium' | 'high';
          is_verified: boolean;
          total_subscribers: number;
          rating: number;
          created_at: string;
          version: string;
          tags: string[];
          timeframe: string;
        };
        Insert: Omit<Database['public']['Tables']['strategies']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['strategies']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string;
          bio: string;
          location: string;
          website: string;
          twitter: string;
          joined_at: string;
          subscription_tier: string;
          is_verified_creator: boolean;
          wallet_address: string | null;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'joined_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          strategy_id: string;
          status: 'active' | 'cancelled' | 'expired';
          started_at: string;
          expires_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'started_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
    };
  };
}
