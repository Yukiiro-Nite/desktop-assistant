import { useCallback, useMemo } from 'react'
import './AvatarBubble.css'
import { Toggles, useToggleStore } from '../../stores/toggleStore'
import { LogType, useLogStore } from '../../stores/logStore'
import { useReadClipboardImage } from '../../hooks/useReadClipboardImage'
import { useSpeech } from '../../hooks/useSpeech'
import defaultIdleImg from '../../assets/avatar/idle.gif'
import defaultSpeakingImg from '../../assets/avatar/speaking.gif'
import defaultThinkingImg from '../../assets/avatar/thinking.gif'
import { AgentStatus, useAgentStore } from '../../stores/agentStore'
import { useSettingsStore } from '../../stores/settingsStore'

const defaultImageMap = {
  [AgentStatus.idle]: defaultIdleImg,
  [AgentStatus.speaking]: defaultSpeakingImg,
  [AgentStatus.thinking]: defaultThinkingImg,
} as Record<AgentStatus, string>

export const AvatarBubble = () => {
  const avatarStatus = useAgentStore((state) => state.agentStatus)
  const addLog = useLogStore((state) => state.addLog)
  const { setToggle } = useToggleStore()
  const idleImg = useSettingsStore((state) => state.idleImg)
  const speakingImg = useSettingsStore((state) => state.speakingImg)
  const thinkingImg = useSettingsStore((state) => state.thinkingImg)
  const imgMap = useMemo(() => ({
    [AgentStatus.idle]: idleImg,
    [AgentStatus.speaking]: speakingImg,
    [AgentStatus.thinking]: thinkingImg
  }), [idleImg, speakingImg, thinkingImg])

  const openSettings = useCallback(() => {
    setToggle(Toggles.showSettings, true)
  }, [setToggle])

  const readImage = useReadClipboardImage()
  const speak = useSpeech()

  const readText = useCallback(async () => {
    addLog({
      type: LogType.system,
      content: 'Reading text from clipboard'
    })
    const text = await navigator.clipboard.readText()
    speak(text)
  }, [addLog, speak])

  const mute = useCallback(() => {
    speechSynthesis.cancel()
  }, [])

  return (
    <div className="AvatarBubble MiniView__movable">
      <div className="ImageWrapper MiniView__movable">
        <img
          className="no-drag-select MiniView__movable"
          src={imgMap[avatarStatus] || defaultImageMap[avatarStatus]}
        ></img>
      </div>
      <ul className="options">
        <li
          style={{"--index": 0} as React.CSSProperties}
        >
          <button onClick={openSettings} title="Settings">⚙️</button>
        </li>
        <li
          style={{"--index": 1} as React.CSSProperties}
        >
          <button onClick={readImage} title="Read Image from Clipboard">🖼️</button>
        </li>
        <li
          style={{"--index": 2} as React.CSSProperties}
        >
          <button onClick={readText} title="Read Text from Clipboard">📋</button>
        </li>
        <li
          style={{"--index": 3} as React.CSSProperties}
        >
          <button onClick={mute} title="Mute">🔇</button>
        </li>
      </ul>
    </div>
  )
}