import { useCallback } from "react"
import { Toggles, useToggleStore } from "../stores/toggleStore"

export const useClose = (toggle: Toggles) => {
  const setToggle = useToggleStore((state) => state.setToggle)
  const close = useCallback(() => {
    setToggle(toggle, false)
  }, [setToggle, toggle])

  return close
}