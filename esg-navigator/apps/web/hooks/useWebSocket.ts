'use client'
import { useEffect, useRef, useState } from 'react'

export function useWebSocket() {
  const [connected, setConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)
  const ref = useRef<WebSocket|null>(null)

  useEffect(() => {
    // Wire up later to wss when backend ready:
    // ref.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:5051/realtime')
    // ref.current.onopen = () => setConnected(true)
    // ref.current.onmessage = (e) => setLastMessage(JSON.parse(e.data))
    // ref.current.onclose = () => setConnected(false)
    return () => { if (ref.current) ref.current.close() }
  }, [])

  return { connected, lastMessage }
}
