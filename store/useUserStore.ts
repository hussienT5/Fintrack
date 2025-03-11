import { create } from 'zustand';

interface UserState {
  name: string;
  avatar: string;
  updateProfile: (name: string, avatar: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: 'Hussien Tan',
  avatar: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&auto=format&fit=crop&q=60',
  updateProfile: (name, avatar) => set({ name, avatar }),
}));