'use client'

import { Horario } from '../types'

// import ConpecBar from '@/components/ui/conpec-bar'
// import Logo from '@assets/conpec-full.png'
// import Image from 'next/image'
// import { useState } from 'react'
// import { /*toast,*/ Toaster } from 'sonner'
// import { db } from "@/firebase/firebase-config";
// import { collection, addDoc } from "firebase/firestore";
import { Button } from '@nextui-org/react'
// import EditFieldPopup from '../edit-field-popup'
import EditFieldIcon from '../edit-field-icon'

export default function SlotsEntrevistasPage() {
  interface TabelaDia {
    dia: string
    local: string
    horarios: Horario[]
  }

  // Dados organizados por dia
  const data: TabelaDia[] = [
    {
      dia: 'Quarta-feira, 12/02/2025',
      local: 'local reservado',
      horarios: [
        {
          horario: '08h00 - 09h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '09h00 - 10h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '10h00 - 11h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '11h00 - 12h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
      ],
    },
    {
      dia: 'Quinta-feira, 13/02/2025',
      local: 'local reservado',
      horarios: [
        {
          horario: '08h00 - 09h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '09h00 - 10h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '10h00 - 11h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '11h00 - 12h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
      ],
    },
    {
      dia: 'Sexta-feira, 14/02/2025',
      local: 'local reservado',
      horarios: [
        {
          horario: '08h00 - 09h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '09h00 - 10h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '10h00 - 11h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '11h00 - 12h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
      ],
    },
    {
      dia: 'Segunda-feira, 17/02/2025',
      local: 'local reservado',
      horarios: [
        {
          horario: '08h00 - 09h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '09h00 - 10h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '10h00 - 11h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '11h00 - 12h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
      ],
    },
    {
      dia: 'Terça-feira, 18/02/2025',
      local: 'local reservado',
      horarios: [
        {
          horario: '08h00 - 09h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '09h00 - 10h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '10h00 - 11h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '11h00 - 12h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
      ],
    },
    {
      dia: 'Quarta-feira, 19/02/2025',
      local: 'local reservado',
      horarios: [
        {
          horario: '08h00 - 09h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '09h00 - 10h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '10h00 - 11h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
        {
          horario: '11h00 - 12h00',
          candidatos: ['Nome do candidato'],
          entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
        },
      ],
    },
  ]

  // const [isOpen, setIsOpen] = useState<boolean>(false)
  // const [selectedHorario, setSelectedHorario] = useState<Horario>(
  //   data[0].horarios[0]
  // )
  // const [selectedDia, setSelectedDia] = useState<TabelaDia>(data[0])

  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-4 font-poppins">
        Horários - Entrevistas
      </h1>
      <table className="w-full border-collapse border-orange-conpec text-[13px] font-lato">
        {data.map((dia, i) => (
          <tbody key={i}>
            <tr className="bg-[#FFF4EF]">
              <th className="border border-orange-conpec bg-orange-conpec text-white w-[15%]">
                {dia.dia}
              </th>
              {dia.horarios.map((horario, k) => (
                <th key={k} className="border-white border-r-[6px] pt-2 pb-2">
                  <div className="relative flex items-center">
                    <p className="w-full text-center">{horario.horario}</p>
                    <Button
                      className="absolute right-0 p-2 rounded mr-3"
                      onPress={() => {
                        // setIsOpen(true)
                        // setSelectedHorario(horario)
                        // setSelectedDia(dia)
                      }}
                    >
                      <EditFieldIcon />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
            <tr>
              <td className="border border-orange-conpec text-center font-bold bg-[#FFF4EF]">
                {dia.local}
              </td>
              {dia.horarios.map((horario, k) => (
                <td
                  key={k}
                  className="border-white border-r-[6px] bg-orange-conpec text-white text-center p-1"
                >
                  {horario.candidatos.map((candidato, j) => (
                    <p key={j}>{candidato}</p>
                  ))}
                  {horario.entrevistadores.map((entrevistador, j) => (
                    <p key={j}>{entrevistador}</p>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        ))}
      </table>
      {/* {isOpen && (
        <EditFieldPopup
          horario={selectedHorario}
          dia={selectedDia.dia}
          local={selectedDia.local}
          setIsOpen={setIsOpen}
          candidatos={}
        />
      )} */}
    </div>
  )
}
