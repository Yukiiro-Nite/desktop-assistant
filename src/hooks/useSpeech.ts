import { useCallback, useEffect, useState } from "react"
import { useSettingsStore } from "../stores/settingsStore"
import { AgentStatus, useAgentStore } from "../stores/agentStore"

export const useSpeech = () => {
  const voice = useSettingsStore((store) => store.voice)
  const { agentStatus, setAgentStatus } = useAgentStore()
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance>()

  const speak = useCallback((text: string) => {
    const speech = new SpeechSynthesisUtterance(text)
    const chosenVoice = speechSynthesis.getVoices().find(synthVoice => synthVoice.name === voice)
    if (chosenVoice) {
      speech.voice = chosenVoice
    }
    setUtterance(speech)
    setAgentStatus(AgentStatus.speaking)
    speechSynthesis.speak(speech)
  }, [voice, setUtterance, setAgentStatus])

  useEffect(() => {
    const resetStatus = () => {
      if (agentStatus === AgentStatus.speaking) {
        setAgentStatus(AgentStatus.idle)
      }
    }
    utterance?.addEventListener('end', resetStatus)

    return () => {
      utterance?.removeEventListener('end', resetStatus)
    }
  }, [utterance, agentStatus, setAgentStatus])

  return speak
}