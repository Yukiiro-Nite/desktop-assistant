import './LogItemDisplay.css'
import classNames from "classnames";
import { LogItem, LogType } from "../../stores/logStore";

export interface LogItemProps {
  log: LogItem
}

export const LogItemDisplay = (props: LogItemProps) => {
  const {
    log
  } = props
  const isUserMessage = log.type === LogType.system || log.type === LogType.user
  const logItemDisplayClasses = classNames('LogItemDisplay', log.type, { left: !isUserMessage })
  const logDate = new Date(log.createdAt)
  return (
    <li className={logItemDisplayClasses}>
      <h2>{log.type}</h2>
      <time>{logDate.toLocaleDateString()} {logDate.toLocaleTimeString()}</time>
      <p>{log.content}</p>
    </li>
  )
}