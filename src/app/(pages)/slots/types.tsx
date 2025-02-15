export type Horario = {
  horario: string
  candidatos: string[]
  entrevistadores: string[]
}

export interface TableData {
  day: string
  local: string
  horarios: Horario[]
}

// export interface TableData {
//   candidates: string[]
//   interviewers: string[]
//   date: string
//   place: string
//   time: string
// }

export enum SlotsType {
  dinamicas,
  entrevistas,
}
