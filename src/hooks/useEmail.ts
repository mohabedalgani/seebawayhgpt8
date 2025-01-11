import { create } from 'zustand';

interface EmailStore {
  email: string;
  setEmail: (email: string) => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
  email: '',
  setEmail: (email: string) => set({ email }),
}));