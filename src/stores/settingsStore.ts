import { create } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"

export interface SettingsStore {
  audioInputDevice: string
  backgroundColor: string
  foregroundColor: string
  voice: string
  idleImg?: string
  thinkingImg?: string
  speakingImg?: string
  baseUrl: string
  setAudioInputDevice: (value: string) => void
  setBackgroundColor: (value: string) => void
  setForegroundColor: (value: string) => void
  setVoice: (value: string) => void
  setIdleImg: (value?: string) => void
  setThinkingImg: (value?: string) => void
  setSpeakingImg: (value?: string) => void
  setBaseUrl: (value?: string) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    subscribeWithSelector((set) => ({
      audioInputDevice: '',
      backgroundColor: 'grey',
      foregroundColor: 'white',
      voice: '',
      idleImg: undefined,
      thinkingImg: undefined,
      speakingImg: undefined,
      baseUrl: 'http://localhost:11434',
      setAudioInputDevice: (value) => {set({ audioInputDevice: value })},
      setBackgroundColor: (value) => {set({ backgroundColor: value })},
      setForegroundColor: (value) => {set({ foregroundColor: value })},
      setVoice: (value) => {set({ voice: value })},
      setIdleImg: (value) => {set({ idleImg: value })},
      setThinkingImg: (value) => {set({ thinkingImg: value })},
      setSpeakingImg: (value) => {set({ speakingImg: value })},
      setBaseUrl: (value) => {set({ baseUrl: value })}
    })),
    {
      name: 'settingsStore',
      onRehydrateStorage: () => {
        return (state) => {
          document.documentElement.style.setProperty('--bg-color', state?.backgroundColor ?? 'grey')
          document.documentElement.style.setProperty('--color', state?.foregroundColor ?? 'white')
        }
      }
    }
  )
)

useSettingsStore.subscribe(
  (state) => state.backgroundColor,
  (backgroundColor) => {
    document.documentElement.style.setProperty('--bg-color', backgroundColor)
  }
)

useSettingsStore.subscribe(
  (state) => state.foregroundColor,
  (foregroundColor) => {
    document.documentElement.style.setProperty('--color', foregroundColor)
  }
)
