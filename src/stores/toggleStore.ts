import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export enum Toggles {
  showLogs = 'showLogs',
  showSettings = 'showSettings',
  showCaptureOverlay = 'showCaptureOverlay'
}

interface ToggleStore {
  toggles: Record<Toggles, boolean>
  setToggle: (key: Toggles, val: boolean) => void
}

export const useToggleStore = create<ToggleStore>()(
  subscribeWithSelector((set, get) => ({
    toggles: {} as Record<Toggles, boolean>,
    setToggle: (key, val) => {
      const currentToggles = get().toggles
      set({ toggles: {
        ...currentToggles,
        [key]: val
      }})
    }
  }))
)