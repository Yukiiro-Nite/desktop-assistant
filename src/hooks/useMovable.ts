import { useCallback, useMemo, useState, MouseEvent, useRef } from "react"

export const useMovable = (movableClass: string) => {
  const movableRef = useRef<HTMLElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0, dragging: false, startX: 0, startY: 0 })
  const style = useMemo(() => ({
    top: pos.y,
    left: pos.x
  }), [pos])

  const handleMouseDown = useCallback((event: MouseEvent) => {
    const isMovable = (event.target as HTMLElement).classList.contains(movableClass)
    if (!isMovable || !movableRef.current) return

    const bbox = (movableRef.current).getBoundingClientRect()

    setPos({
      ...pos,
      startX: event.screenX - bbox.left,
      startY: event.screenY - bbox.top,
      dragging: true
    })
  }, [pos, setPos, movableClass])

  const handleMouseUp = useCallback(() => {
    setPos({ ...pos, dragging: false })
  }, [pos, setPos])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const isMovable = (event.target as HTMLElement).classList.contains(movableClass)
    if (!isMovable) return

    if (pos.dragging) {
      const newPos = {
        ...pos,
        x: event.screenX - pos.startX,
        y: event.screenY - pos.startY
      }
      setPos(newPos)
    }
  }, [pos, setPos, movableClass])

  return {
    style,
    movableRef,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
    onMouseMove: handleMouseMove
  }
}