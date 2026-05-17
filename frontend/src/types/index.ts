export type Label = {
  id: number
  name: string
  color: string
}

export type Card = {
  id: number
  title: string
  description: string | null
  dueDate: string | null
  position: number
  labels: Label[]
}

export type BoardList = {
  id: number
  title: string
  position: number
  cards: Card[]
}

export type Board = {
  id: number
  title: string
  createdAt: string
  lists: BoardList[]
}

export type BoardSummary = {
  id: number
  title: string
  createdAt: string
}
