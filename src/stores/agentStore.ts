import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export enum AgentStatus {
  idle = 'idle',
  thinking = 'thinking',
  speaking = 'speaking'
}

export interface AgentStore {
  agentStatus: AgentStatus
  setAgentStatus: (value: AgentStatus) => void
}

export const useAgentStore = create<AgentStore>()(
  subscribeWithSelector((set) => ({
    agentStatus: AgentStatus.idle,
    setAgentStatus: (value) => { set({ agentStatus: value }) }
  }))
)