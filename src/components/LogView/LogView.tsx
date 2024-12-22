import { useCallback, useMemo } from 'react'
import { useLogStore } from '../../stores/logStore'
import { Toggles } from '../../stores/toggleStore'
import { WindowView } from '../WindowView/WindowView'
import './LogView.css'
import { LogItemDisplay } from '../LogItemDisplay/LogItemDisplay'
import classNames from 'classnames'
import { useSendChat } from '../../hooks/useSendChat'
import { useSpeechToText } from '../../hooks/useSpeechToText'

export const LogView = () => {
  const logs = useLogStore((state) => state.logs)
  const clearLogs = useLogStore((state) => state.clearLogs)
  const sortedLogs = useMemo(() => logs.sort((a, b) => {
    return a.createdAt.localeCompare(b.createdAt)
  }), [logs])
  const _clearLogs = useCallback(() => {
    clearLogs()
  }, [clearLogs])
  const {
    sendChat,
    scrollableRef,
    disableInput
  } = useSendChat()
  const {
    speechToText,
    isRecording,
    inputRef
  } = useSpeechToText()
  const chatFormClasses = classNames('ChatForm', { disabled: disableInput })


  return (
    <WindowView
      className="LogView"
      toggle={Toggles.showLogs}
      title="📓 Logs"
      contentRef={scrollableRef}
    >
      <details className="LogSettings">
        <summary>⚙️ Log Settings</summary>
        <button className="ClearLogs" onClick={_clearLogs}>🗑️ Clear Logs</button>
      </details>
      <ul className="LogList">
        { sortedLogs.map(log => <LogItemDisplay key={log.id} log={log}></LogItemDisplay>) }
      </ul>
      <form className={chatFormClasses} onSubmit={sendChat}>
        <button
          disabled={disableInput}
          type='button'
          onClick={speechToText}
        >{ isRecording ? '⏹️' : '🎤' }</button>
        <label title="">
          <textarea
            ref={inputRef}
            name="input"
            disabled={disableInput || isRecording}
            rows={3}
          ></textarea>
        </label>
        <button
          disabled={disableInput || isRecording}
        >➡️</button>
      </form>
    </WindowView>
  )
}