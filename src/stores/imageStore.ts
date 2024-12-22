import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export interface ImageCaptureData {
  id: string
  /** Base64 format PNG image */
  requestedAt: string
  img?: string
  createdAt?: string
}

export interface ImageStore {
  currentRequestId?: string
  images: Record<string, ImageCaptureData>
  requestImage: () => ImageCaptureData
  setImage: (id: string, img: string) => void
  releaseImage: (id: string) => void
  setCurrentRequest: (id: string) => void
}

export const useImageStore = create<ImageStore>()(
  subscribeWithSelector((set, get) => ({
    images: {} as Record<string, ImageCaptureData>,
    requestImage: () => {
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      const imageRequest = {
        id,
        requestedAt: now
      }
      const currentImages = get().images
      set({
        images: {
          ...currentImages,
          [id]: imageRequest
        }
      })

      return imageRequest
    },
    setImage: (id, img) => {
      const currentImages = get().images
      const now = new Date().toISOString()
      set({
        images: {
          ...currentImages,
          [id]: {
            ...currentImages[id],
            img,
            createdAt: now
          }
        }
      })
    },
    releaseImage: (id) => {
      const { [id]: imageToRelease, ...images } = get().images
      set({ images })
      imageToRelease.img = undefined
    },
    setCurrentRequest: (id) => {
      set({ currentRequestId: id })
    }
  }))
)