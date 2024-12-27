import { useCallback } from "react"
import { LogType, useLogStore } from "../stores/logStore"
import { readTextFromImage } from "../api/llama"
import { useSpeech } from "./useSpeech"
import { AgentStatus, useAgentStore } from "../stores/agentStore"
import { useSettingsStore } from "../stores/settingsStore"

export const useReadClipboardImage = () => {
  const baseUrl = useSettingsStore((state) => state.baseUrl)
  const addLog = useLogStore((state) => state.addLog)
  const setAgentStatus = useAgentStore((state) => state.setAgentStatus)
  const speak = useSpeech()
  const readClipboardImage = useCallback(async () => {
    const clipboardContents = await navigator.clipboard.read()
    const pngItem = clipboardContents.find(content => content.types.includes('image/png'))
    if (!pngItem) {
      speak('No image in clipboard.')
      return
    }

    const blob = await pngItem.getType('image/png')
    const imageData = await blobToBase64(blob)

    // Will need to set up state data round this for animations and loading indicators.
    addLog({ type: LogType.system, content: `Asking agent to read image data`})
    setAgentStatus(AgentStatus.thinking)
    const agentMessage = await readTextFromImage(baseUrl, imageData)
    addLog({ type: LogType.imageReader, content: agentMessage.content ?? '' })
    speak(agentMessage.content ?? '')
  }, [addLog, speak, setAgentStatus, baseUrl])

  return readClipboardImage
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Result = (reader.result as string).substring('data:image/png;base64,'.length)
      resolve(base64Result)
    }
    reader.readAsDataURL(blob)
  });
}