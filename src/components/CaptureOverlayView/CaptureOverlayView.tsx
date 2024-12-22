import { useClose } from '../../hooks/useClose'
import { Toggles, useToggleStore } from '../../stores/toggleStore'
import './CaptureOverlayView.css'
import { useCaptureImage } from '../../hooks/useCaptureImage'
import classNames from 'classnames'
import { useImageStore } from '../../stores/imageStore'
import { useSelection } from '../../hooks/useSelection'
import { useMemo } from 'react'

export const CaptureOverlayView = () => {
  const showCaptureOverlay = useToggleStore((state) => state.toggles[Toggles.showCaptureOverlay])
  const currentRequestId = useImageStore((state) => state.currentRequestId)
  const {
    selectionElRef,
    liveSelection,
    currentSelection,
    selectionHandlers
  } = useSelection()
  const close = useClose(Toggles.showCaptureOverlay)
  const captureImage = useCaptureImage(currentSelection)
  const captureOverlayClasses = classNames('CaptureOverlayView', { show: showCaptureOverlay && currentRequestId })
  const captureClipStyle = useMemo(() => {
    const top = liveSelection.y
    const left = liveSelection.x
    const bottom = liveSelection.y + liveSelection.height
    const right = liveSelection.x + liveSelection.width

    return {
      clipPath: `polygon(
        0% 0%,
        100% 0%,
        100% 100%,
        0% 100%,
        0% 0%,
        ${left}px ${top}px,
        ${left}px ${bottom}px,
        ${right}px ${bottom}px,
        ${right}px ${top}px,
        ${left}px ${top}px
      )`
    } as React.CSSProperties
  }, [liveSelection])

  return (
    <div
      ref={selectionElRef}
      className={captureOverlayClasses}
      style={captureClipStyle}
      {...selectionHandlers}
    >
      <section className="CaptureController">
        <ul>
          <li>
            <button onClick={captureImage}>📷</button>
          </li>
          <li>
            <button onClick={close}>❌</button>
          </li>
        </ul>
      </section>
    </div>
  )
}