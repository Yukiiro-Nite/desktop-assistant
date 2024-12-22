import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import { useSettingsStore } from "../stores/settingsStore"
import { useTranscriber } from "./useTranscriber";
import { blobToArrayBuffer } from "../utils/fileReaders";
import Constants from "../utils/Constants";
import { AgentStatus, useAgentStore } from "../stores/agentStore";

export const useSpeechToText = () => {
  const transcriber = useTranscriber()
  const inputDevice = useSettingsStore((state) => state.audioInputDevice)
  const setAgentStatus = useAgentStore((state) => state.setAgentStatus)
  const [isRecording, setRecording] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder>(null) as MutableRefObject<MediaRecorder>
  const chunksRef = useRef<Blob[]>([]) as MutableRefObject<Blob[]>

  const speechToText = useCallback(async () => {
    if (isRecording) {
      setRecording(false)
      if (!inputRef.current || !mediaRecorderRef.current) return
      
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/ogg; codecs=opus" })
        chunksRef.current = []
        setAgentStatus(AgentStatus.thinking)
        const arrayBuffer = await blobToArrayBuffer(blob)
        const audioCTX = new AudioContext({
            sampleRate: Constants.SAMPLING_RATE,
        });
        const decoded = await audioCTX.decodeAudioData(arrayBuffer);
        transcriber.start(decoded)
      }
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())

      return
    }

    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: inputDevice } })
    mediaRecorderRef.current = new MediaRecorder(audioStream)

    mediaRecorderRef.current.ondataavailable = (e) => {
      console.log('media recorder got data')
      chunksRef.current.push(e.data);
    }
    mediaRecorderRef.current.start()

    setRecording(true)
  }, [isRecording, inputDevice, transcriber, setRecording, setAgentStatus])

  useEffect(() => {
    if (inputRef.current && (transcriber.output?.text.length ?? 0) > 0) {
      inputRef.current.value = transcriber.output?.text ?? ''
      setAgentStatus(AgentStatus.idle)
    }
  }, [transcriber.output, setAgentStatus])

  return {
    speechToText,
    inputRef,
    isRecording
  }
}