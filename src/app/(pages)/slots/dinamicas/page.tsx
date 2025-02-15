'use client'
// import Image from 'next/image'
import { useEffect, useState } from 'react'
// import { /*toast,*/ Toaster } from 'sonner'
// import { collection, addDoc } from "firebase/firestore";
import { SlotsType, TableData } from '../types'
import GenericTable from '../generic-table'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { Button } from '@nextui-org/react'

async function getLatestMatchingSlots() {
  try {
    const querySnapshot = await getDocs(collection(db, 'latest_matching'))

    if (querySnapshot.empty) {
      console.log('Nenhum documento encontrado na coleção latest_matching')
      return []
    }

    const documentData = querySnapshot.docs[0].data()
    return documentData.slots || []
  } catch (error) {
    console.error('Erro ao obter os slots:', error)
    return []
  }
}

const data: TableData[] = [
  {
    day: 'Quarta-feira, 12/02/2024',
    local: 'local reservado',
    horarios: [
      {
        horario: '08h00 - 09h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '09h00 - 10h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '10h00 - 11h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '11h00 - 12h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
  {
    day: 'Quinta-feira, 13/02/2024',
    local: 'local reservado',
    horarios: [
      {
        horario: '08h00 - 09h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '09h00 - 10h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '10h00 - 11h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '11h00 - 12h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
  {
    day: 'Sexta-feira, 14/02/2024',
    local: 'local reservado',
    horarios: [
      {
        horario: '08h00 - 09h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '09h00 - 10h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '10h00 - 11h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '11h00 - 12h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
  {
    day: 'Segunda-feira, 17/02/2024',
    local: 'local reservado',
    horarios: [
      {
        horario: '08h00 - 09h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '09h00 - 10h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '10h00 - 11h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        horario: '11h00 - 12h00',
        candidatos: [
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
          'Nome do candidato',
        ],
        entrevistadores: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
]

export default function SlotsDinamicasPage() {
  const [names, setNames] = useState<string[]>([])
  // const [loading, setLoading] = useState(true)
  const loading = true

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        // const querySnapshot = await getDocs(collection(db, 'enrollments'))
        // const enrollmentsNames = querySnapshot.docs.map((doc) => doc.data().name)
        // setNames(enrollmentsNames)
        setNames(['nome1', 'nome2', 'nome3', 'nome4'])
      } catch (error) {
        console.error('Erro ao buscar nomes: ', error)
      } finally {
        // setLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  return loading ? (
    <div className="flex-col flex h-screen justify-center items-center">
      <h1 className="text-orange-conpec font-bold text-2xl">Carregando...</h1>
      <Button
        className="bg-orange-conpec rounded text-white"
        onPress={async () => console.log(await getLatestMatchingSlots())}
      >
        Carregar latest_matching
      </Button>
    </div>
  ) : (
    <GenericTable slotsType={SlotsType.dinamicas} data={data} names={names} />
  )
}
