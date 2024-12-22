import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

export enum LogType {
  system = 'System',
  imageReader = 'Image Reader',
  assistant = 'Assistant',
  user = 'User'
}

export interface LogItem {
  id: string
  createdAt: string
  type: LogType
  content: string
}

export interface LogStore {
  logs: LogItem[]
  addLog: (log: Omit<Omit<LogItem, 'id'>, 'createdAt'>) => void
  clearLogs: () => void
}

export const useLogStore = create<LogStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      logs: [] as LogItem[],
      addLog: (log) => {
        const currentLogs = get().logs
        const now = new Date().toISOString()
        set({
          logs: currentLogs.concat({
            ...log,
            createdAt: now,
            id: crypto.randomUUID()
          })
        })
      },
      clearLogs: () => set({ logs: [] })
    })),
    { name: 'logStore' }
  )
)