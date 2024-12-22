import { useCallback } from 'react'
import { Toggles, useToggleStore } from '../../stores/toggleStore'
import './WindowView.css'
import { useMovable } from '../../hooks/useMovable'
import classNames from 'classnames'

export interface WindowViewProps {
  className?: string
  toggle: Toggles
  title: string
  children?: JSX.Element | JSX.Element[]
  contentRef?: React.RefObject<HTMLElement>
}

export const WindowView = (props: WindowViewProps) => {
  const {
    className,
    toggle,
    title,
    children,
    contentRef
  } = props
  const { toggles, setToggle } = useToggleStore()
  const show = toggles[toggle]
  const windowViewClasses = classNames('WindowView', className, { show })
  const {
    style: movableStyle,
    movableRef,
    ...movableEventHandlers
  } = useMovable('WindowView__movable')
  const handleClose = useCallback(() => {
    setToggle(toggle, false)
  }, [setToggle, toggle])

  return (
    <main
      className={windowViewClasses}
      ref={movableRef}
      style={movableStyle}
    >
      <nav
        className='NavBar no-drag-select WindowView__movable'
        {...movableEventHandlers}
      >
        <ul className="WindowView__movable">
          <li className="WindowView__movable">{title}</li>
          <li><button onClick={handleClose}>❌</button></li>
        </ul>
      </nav>
      <section className="Content" ref={contentRef}>
        {children}
      </section>
    </main>
  )
}