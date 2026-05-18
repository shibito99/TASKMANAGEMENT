import { useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { BoardList, Card } from '../types'
import CardItem from './CardItem'

type SortType = 'priority' | 'due'

type Props = {
  list: BoardList
  onDeleteList: (listId: number) => void
  onUpdateList: (listId: number, title: string) => Promise<void>
  onAddCard: (listId: number, title: string) => Promise<void>
  onDeleteCard: (cardId: number) => void
  onOpenModal: (card: Card) => void
  onSort: (listId: number, type: SortType) => void
}

export default function ListColumn({
  list, onDeleteList, onUpdateList, onAddCard, onDeleteCard, onOpenModal, onSort,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: `list-${list.id}` })

  // カード追加フォーム
  const [adding, setAdding] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [cardLoading, setCardLoading] = useState(false)

  // リスト名インライン編集
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(list.title)
  const titleInputRef = useRef<HTMLInputElement>(null)

  // アクティブなソートボタン
  const [activeSort, setActiveSort] = useState<SortType | null>(null)

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return
    setCardLoading(true)
    await onAddCard(list.id, newCardTitle.trim())
    setNewCardTitle('')
    setAdding(false)
    setCardLoading(false)
  }

  const handleTitleClick = () => {
    setEditingTitle(true)
    setTitleValue(list.title)
    setTimeout(() => titleInputRef.current?.select(), 0)
  }

  const handleTitleSave = async () => {
    const trimmed = titleValue.trim()
    if (trimmed && trimmed !== list.title) {
      await onUpdateList(list.id, trimmed)
    }
    setEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave()
    if (e.key === 'Escape') { setEditingTitle(false); setTitleValue(list.title) }
  }

  const handleSort = (type: SortType) => {
    setActiveSort(type)
    onSort(list.id, type)
  }

  return (
    <div className="bg-gray-100 rounded-xl w-68 min-w-68 max-h-full flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1 gap-2">
        {editingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={titleValue}
            onChange={e => setTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            className="flex-1 font-bold text-sm text-gray-700 bg-white border-2 border-blue-400 rounded px-1.5 py-0.5 outline-none"
            autoFocus
          />
        ) : (
          <h3
            onClick={handleTitleClick}
            className="font-bold text-sm text-gray-700 flex-1 cursor-text rounded px-1.5 py-0.5 hover:bg-gray-200 transition-colors truncate"
            title="クリックして編集"
          >
            {list.title}
          </h3>
        )}
        <button
          onClick={() => onDeleteList(list.id)}
          className="text-gray-400 hover:text-red-400 transition-colors text-sm flex-shrink-0"
          title="リストを削除"
        >
          🗑
        </button>
      </div>

      {/* ソートボタン */}
      <div className="flex gap-1.5 px-3 pb-2">
        <button
          onClick={() => handleSort('priority')}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
            activeSort === 'priority'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500 hover:bg-blue-100 hover:text-blue-700'
          }`}
          title="ラベルの優先度順に並び替え"
        >
          ⬆ 優先度
        </button>
        <button
          onClick={() => handleSort('due')}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
            activeSort === 'due'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500 hover:bg-blue-100 hover:text-blue-700'
          }`}
          title="期限日の近い順に並び替え"
        >
          📅 期限順
        </button>
      </div>

      {/* カード一覧 */}
      <SortableContext
        items={list.cards.map(c => `card-${c.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`flex-1 overflow-y-auto px-2 flex flex-col gap-2 pb-2 min-h-12 rounded-lg transition-colors ${isOver ? 'bg-blue-50' : ''}`}
        >
          {list.cards.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-3">カードがありません</p>
          )}
          {list.cards.map(card => (
            <CardItem
              key={card.id}
              card={card}
              listId={list.id}
              onDelete={cardId => { setActiveSort(null); onDeleteCard(cardId) }}
              onOpenModal={card => { setActiveSort(null); onOpenModal(card) }}
            />
          ))}
        </div>
      </SortableContext>

      {/* カード追加エリア */}
      <div className="px-2 pb-2">
        {adding ? (
          <div className="flex flex-col gap-1.5">
            <textarea
              className="w-full rounded-md border-2 border-blue-400 px-2 py-1.5 text-sm resize-none outline-none"
              rows={2}
              placeholder="カードのタイトル…"
              value={newCardTitle}
              onChange={e => setNewCardTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard() }
                if (e.key === 'Escape') { setAdding(false); setNewCardTitle('') }
              }}
              autoFocus
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleAddCard}
                disabled={cardLoading}
                className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                追加
              </button>
              <button
                onClick={() => { setAdding(false); setNewCardTitle('') }}
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
