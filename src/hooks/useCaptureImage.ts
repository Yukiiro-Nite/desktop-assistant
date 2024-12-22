import { useCallback } from "react"
import { Rectangle } from "./useSelection"
import { LogType, useLogStore } from "../stores/logStore"

// This version does not work
// Apparently I can not capture the background window in the current implementation
// In the mean time, I'm going to go with a clipboard based solution
export const useCaptureImage = (selection: Rectangle) => {
  const addLog = useLogStore((state) => state.addLog)
  const captureImage = useCallback(() => {
    if (!nw) {
      console.log(selection)
      return
    }

    const currentWindow = nw.Window.get()
    // @ts-expect-error @types/nwjs doesn't have a definition for this function
    const screenshotPromise: Promise<string> = currentWindow?.captureScreenshot({
      fullSize: true,
      clip: {
        ...selection,
        scale: 1
      }
    })

    screenshotPromise
      .then((imageData) => {
        addLog({ type: LogType.system, content: `Got image data: ${imageData}`})
      })
      .catch((error) => {
        addLog({ type: LogType.system, content: `Could not get image: ${error}`})
      })
  }, [selection, addLog])

  return captureImage
}