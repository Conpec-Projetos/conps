export interface TableSlot {
  time: string
  candidates: string[]
  interviewers: string[]
}

export interface TableData {
  date: string
  place: string
  slots: TableSlot[]
}

export interface Slot {
  candidates: string[]
  interviewers: string[]
  date: string
  place: string
  time: string
}

export enum SlotsType {
  dinamicas,
  entrevistas,
}
