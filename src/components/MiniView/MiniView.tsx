import './MiniView.css'
import { useMovable } from '../../hooks/useMovable'
import { AvatarBubble } from '../AvatarBubble/AvatarBubble'
import { StatusBar } from '../StatusBar/StatusBar'

export const MiniView = () => {
  const {
    movableRef,
    ...movableProps
  } = useMovable('MiniView__movable')

  return (
    <main
      className='MiniView MiniView__movable'
      ref={movableRef}
      {...movableProps}
    >
      <AvatarBubble></AvatarBubble>
      <StatusBar></StatusBar>
    </main>
  )
}