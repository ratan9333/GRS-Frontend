import { create } from "zustand";

interface Store {
  user: {};
  addToUser: (data: Record<string, any>) => void;
}

export const useStore = create<Store>((set) => ({
  user: {},
  addToUser: (data: Record<string, any>) => {
    set((state) => ({ user: { ...state.user, ...data } }));
  },
}));
