const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

import { Server } from 'socket.io'
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

type Point = { x: number; y: number }

type drawCursor = {
  currentPoint: Point
  cursorId: string
  username: string
}

interface Cursor {
  x: number
  y: number
  username: string
}


interface Cursors {
  [key: string]: Cursor
}

const cursors: Cursors = {}

io.on('connection', (socket) => {
  const cursorId = socket.id

  socket.on('client-ready', () => {
    socket.broadcast.emit('get-canvas-state')
  })

  socket.on('canvas-state', (state) => {
    console.log('received canvas state')
    socket.broadcast.emit('canvas-state-from-server', state)
  })

  socket.on('draw-cursor', ({ currentPoint, username }: drawCursor) => {
    cursors[cursorId] = { x: currentPoint.x, y: currentPoint.y, username }
    socket.broadcast.emit('draw-cursor', { currentPoint, cursorId, username })
  })

  socket.on('clear', () => {
    delete cursors[cursorId]
    io.emit('clear', cursorId)
  })

  socket.on('disconnect', () => {
    delete cursors[cursorId]
    io.emit('clear', cursorId)
  })

  setInterval(() => {
    socket.emit('cursors', cursors)
    console.log(cursors)
  }, 10)
})

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001')
})
