import { useState } from 'react'
import type { BoardList } from '../types'
import CardItem from './CardItem'

type Props = {
  list: BoardList
  onDeleteList: (listId: number) => void
  onAddCard: (listId: number, title: string) => Promise<void>
  onDeleteCard: (cardId: number) => void
}

export default function ListColumn({ list, onDeleteList, onAddCard, onDeleteCard }: Props) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!title.trim()) return
    setLoading(true)
    await onAddCard(list.id, title.trim())
    setTitle('')
    setAdding(false)
    setLoading(false)
  }

  return (
    <div className="bg-gray-100 rounded-xl w-68 min-w-68 max-h-full flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <h3 className="font-bold text-sm text-gray-700">{list.title}</h3>
        <button
          onClick={() => onDeleteList(list.id)}
          className="text-gray-400 hover:text-red-400 transition-colors text-sm"
          title="リストを削除"
        >
          🗑
        </button>
      </div>

      {/* カード一覧 */}
      <div className="flex-1 overflow-y-auto px-2 flex flex-col gap-2 pb-2">
        {list.cards.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">カードがありません</p>
        )}
        {list.cards.map(card => (
          <CardItem key={card.id} card={card} onDelete={onDeleteCard} />
        ))}
      </div>

      {/* カード追加エリア */}
      <div className="px-2 pb-2">
        {adding ? (
          <div className="flex flex-col gap-1.5">
            <textarea
              className="w-full rounded-md border-2 border-blue-400 px-2 py-1.5 text-sm resize-none outline-none"
              rows={2}
              placeholder="カードのタイトル…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd() }
                if (e.key === 'Escape') { setAdding(false); setTitle('') }
              }}
              autoFocus
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleAdd}
                disabled={loading}
                className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                追加
              </button>
              <button
                onClick={() => { setAdding(false); setTitle('') }}
                className="text-gray-500 hover:text-gray-700 text-lg leading-none px-1"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 px-2 py-2 rounded-md transition-colors"
          >
            ＋ カード追加
          </button>
        )}
      </div>
    </div>
  )
}
