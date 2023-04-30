'use client'

import { FC, useEffect, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3001')

interface pageProps { }

interface Cursor {
  id: string;
  position: Point;
}

interface Cursors {
  [key: string]: Cursor
}


const page: FC<pageProps> = ({ }) => {
  const { canvasRef, onMouseMove, clear } = useDraw(createLine)
  const [cursors, setCursors] = useState<Cursor[]>([])
  const [displayWidth, setDisplayWidth] = useState(0);
  const [displayHeight, setDisplayHeight] = useState(0);

  useEffect(() => {
    setDisplayWidth(window.innerWidth);
    setDisplayHeight(window.innerHeight);

    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
      setDisplayHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    socket.emit('client-ready')

    socket.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return
      socket.emit('canvas-state', canvasRef.current.toDataURL())
    })

    socket.on('canvas-state-from-server', (state: string) => {
      const img = new Image()
      img.src = state
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
    })

    socket.on('clear', clear)

    socket.on('cursors', (cursors: Cursors) => {
      const cursorArray = Object.entries(cursors).map(([id, cursor]) => ({ id, position: cursor }))
      console.log(cursorArray)
      setCursors(cursorArray as any)
    })

    return () => {
      socket.off('draw-cursor')
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('clear')
      socket.off('cursors')
    }
  }, [canvasRef])

  function createLine({ currentPoint, ctx }: Draw) {
    socket.emit('draw-cursor', { currentPoint })
  }

  return (
    <div className='w-screen h-screen bg-white flex justify-center items-center'>
      
      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}
      width={displayWidth}
      height={displayHeight}
      />
      {cursors.map(cursor => (
        <div
          key={cursor.id}
          style={{ position: 'absolute', left: cursor.position.x, top: cursor.position.y, cursor: 'pointer' }}
        >
          <span role='img' aria-label='cursor' style={{ color: '#000' }}>
            ✏️
            <h3>{cursor.id}</h3>
          </span>
        </div>
      ))}
    </div>
  )
}

export default page
