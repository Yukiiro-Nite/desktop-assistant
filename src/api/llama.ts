import { chatPrompt, imageDictationPrompt } from "./prompts"

export interface AgentMessage {
  role: 'assistant',
  content?: string
}

export interface ChatMessage {
  role: 'assistant' | 'user',
  content: string,
  images?: string[]
}

export const readTextFromImage = async (baseUrl: string, imageData: string) => {
  const url = `${baseUrl}/api/chat`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3.2-vision',
      stream: false,
      messages: [
        { role: 'system', content: imageDictationPrompt },
        { role: 'user', content: 'Reply with only the text in this image: ', images: [imageData]}
      ]
    })
  })

  if (response.status !== 200) {
    throw response
  }

  const data = await response.json()
  return data?.message as AgentMessage
}

export const chat = async (baseUrl: string, messages: ChatMessage[]) => {
  const url = `${baseUrl}/api/chat`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3.2-vision',
      stream: false,
      messages: [
        { role: 'system', content: chatPrompt },
        ...messages
      ]
    })
  })

  if (response.status !== 200) {
    throw response
  }

  const data = await response.json()
  return data?.message as AgentMessage
}