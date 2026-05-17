import api from './client'
import type { Board, BoardSummary } from '../types'

export const getBoards = () =>
  api.get<BoardSummary[]>('/boards').then(r => r.data)

export const getBoard = (id: number) =>
  api.get<Board>(`/boards/${id}`).then(r => r.data)

export const createList = (boardId: number, title: string) =>
  api.post(`/boards/${boardId}/lists`, { title }).then(r => r.data)

export const updateList = (listId: number, data: { title?: string; position?: number }) =>
  api.patch(`/lists/${listId}`, data).then(r => r.data)

export const deleteList = (listId: number) =>
  api.delete(`/lists/${listId}`)

export const createCard = (listId: number, title: string) =>
  api.post(`/lists/${listId}/cards`, { title }).then(r => r.data)

export const updateCard = (cardId: number, data: {
  title?: string
  description?: string
  dueDate?: string
  position?: number
  listId?: number
}) => api.patch(`/cards/${cardId}`, data).then(r => r.data)

export const deleteCard = (cardId: number) =>
  api.delete(`/cards/${cardId}`)
