import { create } from "zustand"

type HeaderState = {
  title: string
  setTitle: (title: string) => void
}

export const useHeaderStore = create<HeaderState>((set) => ({
  title: "Dashboard",
  setTitle: (title) => set({ title }),
}))
