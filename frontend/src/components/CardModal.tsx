import { useEffect, useRef, useState } from 'react'
import type { Card, Label } from '../types'
import { updateCard, deleteCard, attachLabel, detachLabel } from '../api/boards'

type Props = {
  card: Card
  listTitle: string
  allLabels: Label[]
  onClose: () => void
  onRefresh: () => void
}

export default function CardModal({ card, listTitle, allLabels, onClose, onRefresh }: Props) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description ?? '')
  const [dueDate, setDueDate] = useState(
    card.dueDate ? card.dueDate.slice(0, 16) : ''
  )
  // 現在付いているラベルの id（1つのみ選択、なしは null）
  const [selectedLabelId, setSelectedLabelId] = useState<number | null>(
    card.labels.length > 0 ? card.labels[0].id : null
  )
  const [saving, setSaving] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      // タイトル・説明・期限日を更新
      await updateCard(card.id, {
        title: title.trim(),
        description,
        dueDate: dueDate || undefined,
      })

      // ラベルの差分更新
      const currentLabelId = card.labels.length > 0 ? card.labels[0].id : null
      if (selectedLabelId !== currentLabelId) {
        if (currentLabelId !== null) await detachLabel(card.id, currentLabelId)
        if (selectedLabelId !== null) await attachLabel(card.id, selectedLabelId)
      }

      await onRefresh()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('このカードを削除しますか？\nこの操作は元に戻せません。')) return
    await deleteCard(card.id)
    await onRefresh()
    onClose()
  }

  const LABEL_COLORS: Record<string, string> = {
    '#ef4444': 'bg-red-100 text-red-700 border-red-300',
    '#f59e0b': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    '#22c55e': 'bg-green-100 text-green-700 border-green-300',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 px-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-gray-50 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideUp .15s ease' }}
      >
        {/* ヘッダー */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-3">
          <span className="text-xl mt-0.5">📝</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">タイトル</p>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-lg font-bold text-gray-800 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-400 pb-0.5 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">リスト：{listTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none flex-shrink-0 mt-0.5"
          >
            ×
          </button>
        </div>

        {/* ボディ */}
        <div className="px-5 pb-5 flex flex-col gap-4 overflow-y-auto">
          {/* 説明 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              説明
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="説明を追加する…"
              rows={3}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 resize-none transition-colors bg-white"
            />
          </div>

          {/* 期限日時 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              期限日時
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors bg-white"
            />
          </div>

          {/* ラベル */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              ラベル
            </label>
            <div className="flex flex-wrap gap-2">
              {/* なし */}
              <button
                onClick={() => setSelectedLabelId(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                  selectedLabelId === null
                    ? 'bg-gray-200 text-gray-700 border-gray-500'
                    : 'bg-gray-100 text-gray-500 border-transparent hover:border-gray-300'
                }`}
              >
                なし
              </button>
              {allLabels.map(label => (
                <button
                  key={label.id}
                  onClick={() => setSelectedLabelId(label.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    selectedLabelId === label.id
                      ? `${LABEL_COLORS[label.color] ?? 'bg-gray-100 text-gray-600 border-gray-400'} border-gray-800`
                      : `${LABEL_COLORS[label.color] ?? 'bg-gray-100 text-gray-600'} border-transparent hover:border-current`
                  }`}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>

          {/* フッター */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              {saving ? '保存中…' : '保存'}
            </button>
            <button
              onClick={handleDelete}
              className="border-2 border-red-400 text-red-500 hover:bg-red-500 hover:text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors"
            >
              🗑 削除
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}
