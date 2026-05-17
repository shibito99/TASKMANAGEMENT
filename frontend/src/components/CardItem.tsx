import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Card } from '../types'

type Props = {
  card: Card
  listId: number
  onDelete: (cardId: number) => void
}

const LABEL_STYLE: Record<string, string> = {
  '#ef4444': 'bg-red-100 text-red-700',
  '#f59e0b': 'bg-yellow-100 text-yellow-700',
  '#22c55e': 'bg-green-100 text-green-700',
}

export default function CardItem({ card, listId, onDelete }: Props) {
  const isOverdue = card.dueDate && card.dueDate < new Date().toISOString().split('T')[0]

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
      className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow select-none ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
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
          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 text-base leading-none"
          title="削除"
        >
          ✕
        </button>
      </div>

      {/* 期限日 */}
      {card.dueDate && (
        <div className={`mt-1.5 text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
          📅 {card.dueDate}{isOverdue ? ' 期限切れ' : ''}
        </div>
      )}
    </div>
  )
}
