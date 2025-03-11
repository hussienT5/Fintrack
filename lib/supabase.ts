import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Memory storage fallback
const memoryStorage = new Map<string, string>();

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Custom storage adapter that works in all environments
const createStorageAdapter = () => {
  if (Platform.OS === 'web' && isBrowser) {
    // Check if localStorage is available
    let isLocalStorageAvailable = false;
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      isLocalStorageAvailable = true;
    } catch {
      isLocalStorageAvailable = false;
    }

    if (isLocalStorageAvailable) {
      return {
        getItem: (key: string) => {
          try {
            return Promise.resolve(localStorage.getItem(key));
          } catch {
            return Promise.resolve(memoryStorage.get(key) ?? null);
          }
        },
        setItem: (key: string, value: string) => {
          try {
            localStorage.setItem(key, value);
            return Promise.resolve();
          } catch {
            memoryStorage.set(key, value);
            return Promise.resolve();
          }
        },
        removeItem: (key: string) => {
          try {
            localStorage.removeItem(key);
            return Promise.resolve();
          } catch {
            memoryStorage.delete(key);
            return Promise.resolve();
          }
        },
      };
    }
  }

  // Use memory storage for non-browser web environments (SSR)
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => Promise.resolve(memoryStorage.get(key) ?? null),
      setItem: (key: string, value: string) => {
        memoryStorage.set(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        memoryStorage.delete(key);
        return Promise.resolve();
      },
    };
  }

  // For native platforms, use SecureStore
  return {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
  };
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types based on our database schema
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Account = {
  id: string;
  user_id: string;
  type: 'bank' | 'investment' | 'crypto';
  name: string;
  balance: number;
  institution: string;
  last_four: string | null;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  account_id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
  updated_at: string;
};