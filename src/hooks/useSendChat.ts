import { FormEvent, useCallback, useRef, useState } from "react"
import { LogType, useLogStore } from "../stores/logStore"
import { chat, ChatMessage } from "../api/llama"
import { useSpeech } from "./useSpeech"
import { AgentStatus, useAgentStore } from "../stores/agentStore"

export interface ChatFormElements extends HTMLFormControlsCollection {
  input: HTMLTextAreaElement
}

export const useSendChat = () => {
  const scrollableRef = useRef<HTMLElement>(null)
  const [disableInput, setDisableInput] = useState(false)
  const { logs, addLog } = useLogStore()
  const setAgentStatus = useAgentStore((state) => state.setAgentStatus)
  const speak = useSpeech()
  const sendChat = useCallback((event: FormEvent) => {
    event.preventDefault()
    const target = event.target as HTMLFormElement
    const elements = target.elements as ChatFormElements
    const inputText = elements.input.value
    if (!inputText) return

    const newMessage = {
      role: 'user',
      content: inputText
    }
    const messages = logs
      .filter(log => log.type === LogType.assistant || LogType.user)
      .map(log => ({ role: log.type.toLowerCase(), content: log.content }))
      .concat(newMessage) as ChatMessage[]
    
    addLog({ type: LogType.user, content: inputText })
    setDisableInput(true)
    setTimeout(() => {
      scrollableRef.current?.scroll({ top: scrollableRef.current?.scrollHeight, behavior: 'smooth' })
    })
    setAgentStatus(AgentStatus.thinking)
    

    chat(messages)
      .then((agentMessage) => {
        const text = agentMessage.content ?? ''
        addLog({ type: LogType.assistant, content: text })
        speak(text)
        target.reset()
        setTimeout(() => {
          scrollableRef.current?.scroll({ top: scrollableRef.current?.scrollHeight, behavior: 'smooth' })
        })
      })
      .catch((error) => {
        addLog({ type: LogType.system, content: `There was a problem getting chat from llama: ${error}` })
      })
      .finally(() => {
        setDisableInput(false)
      })

  }, [logs, setDisableInput, addLog, speak, setAgentStatus])

  return {
    sendChat,
    scrollableRef,
    disableInput
  }
}