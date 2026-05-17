import { useState } from 'react'
import type { Board } from '../types'
import ListColumn from './ListColumn'
import { createList, deleteList, createCard, deleteCard } from '../api/boards'

type Props = {
  board: Board
  onRefresh: () => void
}

export default function BoardView({ board, onRefresh }: Props) {
  const [addingList, setAddingList] = useState(false)
  const [listTitle, setListTitle] = useState('')

  const handleAddList = async () => {
    if (!listTitle.trim()) return
    await createList(board.id, listTitle.trim())
    setListTitle('')
    setAddingList(false)
    onRefresh()
  }

  const handleDeleteList = async (listId: number) => {
    if (!confirm('このリストとカードをすべて削除しますか？')) return
    await deleteList(listId)
    onRefresh()
  }

  const handleAddCard = async (listId: number, title: string) => {
    await createCard(listId, title)
    onRefresh()
  }

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('このカードを削除しますか？')) return
    await deleteCard(cardId)
    onRefresh()
  }

  return (
    <div className="flex items-start gap-3 p-4 overflow-x-auto flex-1 min-h-0">
      {board.lists.map(list => (
        <ListColumn
          key={list.id}
          list={list}
          onDeleteList={handleDeleteList}
          onAddCard={handleAddCard}
          onDeleteCard={handleDeleteCard}
        />
      ))}

      {/* リスト追加 */}
      <div className="min-w-60 flex-shrink-0">
        {addingList ? (
          <div className="bg-gray-100 rounded-xl p-2 flex flex-col gap-2">
            <input
              type="text"
              className="w-full rounded-md border-2 border-blue-400 px-2 py-1.5 text-sm outline-none"
              placeholder="リスト名を入力…"
              value={listTitle}
              onChange={e => setListTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddList()
                if (e.key === 'Escape') { setAddingList(false); setListTitle('') }
              }}
              autoFocus
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleAddList}
                className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-700"
              >
                追加
              </button>
              <button
                onClick={() => { setAddingList(false); setListTitle('') }}
                className="text-gray-500 hover:text-gray-700 text-lg leading-none px-1"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingList(true)}
            className="w-full bg-white/25 hover:bg-white/35 text-white font-semibold text-sm px-4 py-3 rounded-xl transition-colors text-left"
          >
            ＋ リスト追加
          </button>
        )}
      </div>
    </div>
  )
}
