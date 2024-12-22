import { useState, useCallback, MouseEvent, useRef } from "react"

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export const useSelection = () => {
  const rootEl = useRef(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [liveSelection, setLiveSelection] = useState<Rectangle>({ x: 0, y: 0, width: 0, height: 0 })
  const [currentSelection, setCurrentSelection] = useState<Rectangle>({ x: 0, y: 0, width: 0, height: 0 })

  const handleSelectStart = useCallback((event: MouseEvent) => {
    if (rootEl.current !== event.target) return

    const x = event.clientX
    const y = event.clientY

    setIsSelecting(true)
    setStartPoint({ x, y })
    setLiveSelection({ x, y, width: 0, height: 0 })
  }, [rootEl, setIsSelecting, setStartPoint, setLiveSelection])

  const handleSelectEnd = useCallback(() => {
    if (!isSelecting) return

    setCurrentSelection(liveSelection)
    setIsSelecting(false)
  }, [liveSelection, isSelecting, setCurrentSelection, setIsSelecting])

  const handleSelectMove = useCallback((event: MouseEvent) => {
    if (!isSelecting) return

    const minX = Math.min(startPoint.x, event.clientX)
    const minY = Math.min(startPoint.y, event.clientY)
    const maxX = Math.max(startPoint.x, event.clientX)
    const maxY = Math.max(startPoint.y, event.clientY)

    setLiveSelection({
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    })
  }, [isSelecting, startPoint, setLiveSelection])

  return {
    selectionElRef: rootEl,
    liveSelection,
    currentSelection,
    selectionHandlers: {
      onMouseDown: handleSelectStart,
      onMouseUp: handleSelectEnd,
      onMouseLeave: handleSelectEnd,
      onMouseMove: handleSelectMove
    }
  }
}