import { useCallback } from "react"
import { Toggles, useToggleStore } from "../stores/toggleStore"
import { LogType, useLogStore } from "../stores/logStore"
import { useImageStore } from "../stores/imageStore"

// It looks like I'm going to have to use a different solution until
// I can find a better way to get a screenshot from nwjs
export const useReadImage = () => {
  // Show Capture Overlay
  // Wait for image capture
  // Or wait for overlay closed
  // If we get an image
  // Send the image to the AI
  // When we get a response, save it to logs
  // And dictate the response
  const setToggle = useToggleStore((state) => state.setToggle)
  const addLog = useLogStore((state) => state.addLog)
  const {
    requestImage,
    releaseImage,
    setCurrentRequest
  } = useImageStore()

  const readImage = useCallback(() => {
    // Open the capture overlay
    setToggle(Toggles.showCaptureOverlay, true)
    // Create an image request
    const imageRequest = requestImage()
    setCurrentRequest(imageRequest.id)

    // Keep track of our subscribers
    const listeners = [] as (() => void)[]
    // Create a function for us to clear all of them
    const clearListeners = () => {
      listeners.forEach(l => l())
    }

    // If the user closes the overlay, we want to stop listening
    const removeToggleStoreListener = useToggleStore.subscribe(
      (state) => state.toggles[Toggles.showCaptureOverlay],
      (showCaptureOverlay) => {
        if (!showCaptureOverlay) {
          clearListeners()
          releaseImage(imageRequest.id)
        }
      }
    )
    listeners.push(removeToggleStoreListener)

    // Watch for the image request to be completed
    const removeImageListener = useImageStore.subscribe(
      (state) => state.images[imageRequest.id],
      (captureData) => {
        if (captureData.img && captureData.createdAt) {
          // We have an image, read it and then release it.
          addLog({ type: LogType.system, content: `Asking agent to read image` })
        }
      }
    )
    listeners.push(removeImageListener)
  }, [addLog, releaseImage, requestImage, setCurrentRequest, setToggle])

  return readImage
}