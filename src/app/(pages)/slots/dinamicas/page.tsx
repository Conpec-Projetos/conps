'use client'

import { SlotsType } from '../types'
import SlotsTable from '../slots-table'

// const dataPlaceholderDinamicas: TableData[] = [
//   {
//     date: '2024-02-12',
//     place: 'local reservado',
//     slots: [
//       {
//         time: '08:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '09:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '10:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '11:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '12:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '13:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//     ],
//   },
//   {
//     date: '2024-02-13',
//     place: 'local reservado',
//     slots: [
//       {
//         time: '08:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '09:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '10:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '11:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//     ],
//   },
//   {
//     date: '2024-02-14',
//     place: 'local reservado',
//     slots: [
//       {
//         time: '08:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '09:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '10:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '11:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//     ],
//   },
//   {
//     date: '2024-02-17',
//     place: 'local reservado',
//     slots: [
//       {
//         time: '08:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '09:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '10:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//       {
//         time: '11:00',
//         candidates: [
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//           'Nome do candidato',
//         ],
//         interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
//       },
//     ],
//   },
// ]

export default function SlotsDinamicasPage() {
  return <SlotsTable slotsType={SlotsType.dinamicas} />
}
