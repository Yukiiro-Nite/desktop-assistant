import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useSettingsStore } from '../../stores/settingsStore'
import { Toggles } from '../../stores/toggleStore'
import { WindowView } from '../WindowView/WindowView'
import './SettingsView.css'
import { defaultImages, getImageData } from '../../utils/avatarImages'
import { AgentStatus } from '../../stores/agentStore'

export interface OptionData {
  value: string
  display: string
}

export const SettingsView = () => {
  const {
    audioInputDevice,
    backgroundColor,
    foregroundColor,
    voice,
    idleImg,
    thinkingImg,
    speakingImg,
    setAudioInputDevice,
    setBackgroundColor,
    setForegroundColor,
    setVoice,
    setIdleImg,
    setThinkingImg,
    setSpeakingImg,
  } = useSettingsStore()
  const [micOptions, setMicOptions] = useState<OptionData[]>([])
  const getMicOptions = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()

    return devices
      .filter((device) => device.kind === 'audioinput')
      .map((device) => ({ value: device.deviceId, display: device.label }))
  }, [])

  useEffect(() => {
    getMicOptions().then((options) => setMicOptions(options))
  }, [getMicOptions])

  const handleBackgroundColorChange = useCallback((event: ChangeEvent) => {
    const target = event.target as HTMLInputElement
    setBackgroundColor(target.value)
  }, [setBackgroundColor])

  const handleForegroundColorChange = useCallback((event: ChangeEvent) => {
    const target = event.target as HTMLInputElement
    setForegroundColor(target.value)
  }, [setForegroundColor])

  const handleMicrophoneChange = useCallback((event: ChangeEvent) => {
    const target = event.target as HTMLInputElement
    setAudioInputDevice(target.value)
  }, [setAudioInputDevice])

  const handleVoiceChange = useCallback((event: ChangeEvent) => {
    const target = event.target as HTMLInputElement
    setVoice(target.value)
  }, [setVoice])

  const handleRefreshMicOptions = useCallback(() => {
    getMicOptions().then((options) => setMicOptions(options))
  }, [getMicOptions])

  const handleIdleImageChange = useCallback(async (event?: ChangeEvent) => {
    const imageData = await getImageData(event)
    setIdleImg(imageData)
  }, [setIdleImg])

  const handleThinkingImageChange = useCallback(async (event?: ChangeEvent) => {
    const imageData = await getImageData(event)
    setThinkingImg(imageData)
  }, [setThinkingImg])

  const handleSpeakingImageChange = useCallback(async (event?: ChangeEvent) => {
    const imageData = await getImageData(event)
    setSpeakingImg(imageData)
  }, [setSpeakingImg])

  const voiceOptions = speechSynthesis.getVoices().map((synthVoice) => {
    return {
      value: synthVoice.name,
      display: synthVoice.name
    }
  })

  return (
    <WindowView
      toggle={Toggles.showSettings}
      title="⚙️ Settings"
      className="SettingsView"
    >
      <h2>🎨 Colors</h2>
      <label>
        <span>🌄 Background Color</span>
        <input
          type="color"
          value={backgroundColor}
          onChange={handleBackgroundColorChange}
        ></input>
      </label>

      <label>
        <span>🗚 Text Color</span>
        <input
          type="color"
          value={foregroundColor}
          onChange={handleForegroundColorChange}
        ></input>
      </label>

      <h2>🎤🔈 Audio</h2>
      <label>
        <span>
          🎤 Microphone
          <button onClick={handleRefreshMicOptions}>🔄</button>
        </span>
        <select
          value={audioInputDevice}
          onChange={handleMicrophoneChange}
        >
          {
            micOptions.map((micOption) => (
              <option key={micOption.value} value={micOption.value}>{micOption.display}</option>
            ))
          }
        </select>
      </label>
      <label>
        <span>🗣️ Voice</span>
        <select
          value={voice}
          onChange={handleVoiceChange}
        >
          {
            voiceOptions.map((voiceOption) => (
              <option key={voiceOption.value} value={voiceOption.value}>{voiceOption.display}</option>
            ))
          }
        </select>
      </label>

      <h2>😃 Avatar</h2>
      <label>
        <span>😃 Idle Image</span>
        <div className="ImgPreviewWrapper">
          <img src={idleImg || defaultImages[AgentStatus.idle]} alt="Idle animation" />
          <button onClick={() => handleIdleImageChange()}>🗑️</button>
        </div>
        <input
          type="file"
          onChange={handleIdleImageChange}
        ></input>
      </label>
      <label>
        <span>🤔 Thinking Image</span>
        <div className="ImgPreviewWrapper">
          <img src={thinkingImg || defaultImages[AgentStatus.thinking]} alt="Thinking animation" />
          <button onClick={() => handleThinkingImageChange()}>🗑️</button>
        </div>
        <input
          type="file"
          onChange={handleThinkingImageChange}
        ></input>
      </label>
      <label>
        <span>🗣️ Speaking Image</span>
        <div className="ImgPreviewWrapper">
          <img src={speakingImg || defaultImages[AgentStatus.speaking]} alt="Speaking animation" />
          <button onClick={() => handleSpeakingImageChange()}>🗑️</button>
        </div>
        <input
          type="file"
          onChange={handleSpeakingImageChange}
        ></input>
      </label>
    </WindowView>
  )
}