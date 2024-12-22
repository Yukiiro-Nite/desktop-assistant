import { ChangeEvent } from 'react'
import defaultIdleImg from '../assets/avatar/idle.gif'
import defaultSpeakingImg from '../assets/avatar/speaking.gif'
import defaultThinkingImg from '../assets/avatar/thinking.gif'
import { AgentStatus } from '../stores/agentStore'
import { fileToDataURL } from './fileReaders'

export const defaultImages = {
  [AgentStatus.idle]: defaultIdleImg,
  [AgentStatus.speaking]: defaultSpeakingImg,
  [AgentStatus.thinking]: defaultThinkingImg,
} as Record<AgentStatus, string>

export const getImageData = async (event?: ChangeEvent): Promise<string | undefined> => {
  if (!event) return

  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  return fileToDataURL(file)
}