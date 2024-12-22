import './App.css'
import { LogView } from './components/LogView/LogView'
import { MiniView } from './components/MiniView/MiniView'
import { SettingsView } from './components/SettingsView/SettingsView'
import { CaptureOverlayView } from './components/CaptureOverlayView/CaptureOverlayView'

function App() {
  return (
    <>
      <MiniView></MiniView>
      <LogView></LogView>
      <SettingsView></SettingsView>
      <CaptureOverlayView></CaptureOverlayView>
    </>
  )
}

export default App
