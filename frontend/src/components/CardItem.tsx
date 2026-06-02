import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Card } from '../types'

type Props = {
  card: Card
  listId: number
  onDelete: (cardId: number) => void
  onOpenModal: (card: Card) => void
}

const LABEL_STYLE: Record<string, string> = {
  '#ef4444': 'bg-red-100 text-red-700',
  '#f59e0b': 'bg-yellow-100 text-yellow-700',
  '#22c55e': 'bg-green-100 text-green-700',
}

export default function CardItem({ card, listId, onDelete, onOpenModal }: Props) {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
    data: { type: 'card', listId },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => { if (!isDragging) onOpenModal(card) }}
      className={`group bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow select-none ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
    >
      {/* ラベル */}
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map(label => (
            <span
              key={label.id}
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LABEL_STYLE[label.color] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-gray-800 leading-snug break-words flex-1">{card.title}</span>
        <button
          onClick={() => onDelete(card.id)}
          onPointerDown={e => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-0.5 transition-all flex-shrink-0"
          title="削除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {/* 期限日 */}
      {card.dueDate && (
        <div className={`mt-1.5 text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
          📅 {new Date(card.dueDate).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}{isOverdue ? ' 期限切れ' : ''}
        </div>
      )}
    </div>
  )
}
