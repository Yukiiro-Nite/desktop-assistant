import { useCallback } from 'react'
import './StatusBar.css'
import { Toggles, useToggleStore } from '../../stores/toggleStore'
import { AgentStatus, useAgentStore } from '../../stores/agentStore'

const emoteMap = {
  [AgentStatus.idle]: '😃',
  [AgentStatus.thinking]: '🤔',
  [AgentStatus.speaking]: '🗣️',
} as Record<AgentStatus, string>

export const StatusBar = () => {
  const setToggle = useToggleStore((state) => state.setToggle)
  const agentStatus = useAgentStore((state) => state.agentStatus)
  const openLogs = useCallback(() => {
    setToggle(Toggles.showLogs, true)
  }, [setToggle])

  const handleClose = useCallback(() => {
    nw.App.closeAllWindows()
  }, [])

  return (
    <section className="StatusBar MiniView__movable">
      <div className="StatusWrapper no-drag-select MiniView__movable">
        <h2 className="MiniView__movable">Status</h2>
        <p className="MiniView__movable">{emoteMap[agentStatus]}</p>
      </div>
      <ul>
        <li><button onClick={openLogs}>📓</button></li>
        <li><button onClick={handleClose}>❌</button></li>
      </ul>
    </section>
  )
}