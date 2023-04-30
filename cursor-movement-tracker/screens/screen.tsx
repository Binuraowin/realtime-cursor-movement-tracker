'use client'

import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useDraw } from '../hooks/useDraw'
import { io } from 'socket.io-client'
import { Draw, Point } from '../types/typing'
import React from 'react';
const _ = require('lodash');
const socket = io('http://localhost:3001')
import { setUsername } from '../redux/features/UserSlice'

interface screenPageProps { }

interface Cursor {
    id: string;
    position: Point;
}

interface Cursors {
    [key: string]: Cursor
}


const ScreenPage: FC<screenPageProps> = ({ }) => {
    const { canvasRef, onMouseMove, clear } = useDraw(createLine)
    const [cursors, setCursors] = useState<Cursor[]>([])
    const [displayWidth, setDisplayWidth] = useState(0);
    const [displayHeight, setDisplayHeight] = useState(0);
    const [userNameInput, setUsernameInput] = useState("")
    const dispatch = useDispatch();
    const userSlice = useSelector((state: any) => state.userSlice);

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
            console.log(cursors)
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
        const username: any = userSlice.username
        socket.emit('draw-cursor', { currentPoint, username })
    }
    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsernameInput(event.target.value)

    }

    function handleUsernameOnClick() {
        console.log(userNameInput)
        dispatch(setUsername(userNameInput));
    }


    return (
        <div className='w-screen h-screen bg-white flex justify-center items-center'>
            {console.log("username", userSlice.username)}
            {_.isEmpty(userSlice.username) && (
                <div className="flex flex-col space-y-2">
                    <label className="text-lg font-medium text-gray-700">
                        Please enter your username:
                        <input
                            type="text"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleUsernameChange}
                        />
                    </label>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleUsernameOnClick}
                    >
                        enter
                    </button>
                </div>

            )}

            {
                !_.isEmpty(userSlice.username) && (
                    <>
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
                                    <h3>{cursor.position.username}</h3>
                                </span>
                            </div>
                        ))}</>
                )
            }
        </div>
    )
}

export default ScreenPage
