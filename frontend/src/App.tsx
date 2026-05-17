import { useEffect, useState, useCallback } from 'react'
import type { Board } from './types'
import { getBoard } from './api/boards'
import BoardView from './components/BoardView'

const BOARD_ID = 1

export default function App() {
  const [board, setBoard] = useState<Board | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchBoard = useCallback(async () => {
    try {
      const data = await getBoard(BOARD_ID)
      setBoard(data)
      setError(null)
    } catch {
      setError('バックエンドに接続できません。Spring Boot が起動しているか確認してください。')
    }
  }, [])

  useEffect(() => { fetchBoard() }, [fetchBoard])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #1e88e5 100%)' }}>
      <header className="flex items-center justify-between px-4 h-12 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <h1 className="text-white font-bold text-lg tracking-wide">📌 タスク管理アプリ</h1>
        {board && <span className="text-white/70 text-sm">{board.title}</span>}
      </header>

      {error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl px-6 py-4 text-red-600 text-sm shadow-lg max-w-md text-center">
            ⚠️ {error}
          </div>
        </div>
      ) : board ? (
        <BoardView board={board} onRefresh={fetchBoard} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/80 text-sm">読み込み中…</div>
        </div>
      )}
    </div>
  )
}
