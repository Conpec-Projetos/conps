import { useEffect, useState } from 'react'
import { TableSlot, SlotsType, TableData, Slot } from './types'
import { Button } from '@nextui-org/react'
import EditFieldIcon from './edit-field-icon'
import EditFieldPopup from './edit-field-popup'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/firebase-config'

const dataPlaceholderEntrevistas: TableData[] = [
  {
    date: '2025-02-12',
    place: 'local reservado',
    slots: [
      {
        time: '08:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '09:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '10:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '11:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '12:00',
        candidates: [
          'nome MUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUITO GRAAAAAAAAANDE',
        ],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
  {
    date: '2025-02-13',
    place: 'local reservado',
    slots: [
      {
        time: '08:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '09:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '10:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '11:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
  {
    date: '2025-02-14',
    place: 'local reservado',
    slots: [
      {
        time: '08:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '09:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '10:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '11:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
  {
    date: '2025-02-17',
    place: 'local reservado',
    slots: [
      {
        time: '08:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '09:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '10:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '11:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
  {
    date: '2025-02-18',
    place: 'local reservado',
    slots: [
      {
        time: '08:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '09:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '10:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '11:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
  {
    date: '2025-02-19',
    place: 'local reservado',
    slots: [
      {
        time: '08:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '09:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '10:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
      {
        time: '11:00',
        candidates: ['Nome do candidato'],
        interviewers: ['Nome do entrevistador', 'Nome do entrevistador'],
      },
    ],
  },
]

interface SlotsTableProps {
  slotsType: SlotsType
}

function formatDate(dataString: string): string {
  const date = new Date(dataString + 'T00:00:00')

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}

function formatTime(time: string): string {
  const [hour, minute] = time.split(':').map(Number)
  const finalHour = (hour + 2) % 24
  const formattedHour = hour.toString().padStart(2, '0')
  const formattedFinalHour = finalHour.toString().padStart(2, '0')
  const formattedMinute = minute.toString().padStart(2, '0')

  return `${formattedHour}h${formattedMinute} - ${formattedFinalHour}h${formattedMinute}`
}

async function getLatestMatchingSlots() {
  try {
    const querySnapshot = await getDocs(collection(db, 'latest_matching'))

    if (querySnapshot.empty) {
      console.log('Nenhum documento encontrado na coleção latest_matching')
      return []
    }

    const data = querySnapshot.docs[0].data()
    const slots = data.slots || []

    // Agrupa os slots por "day" e "local"
    const grouped: Record<string, TableData> = {}

    slots.forEach((slot: Slot) => {
      // Extraia as propriedades de cada slot
      const { date, place, time, candidates, interviewers } = slot
      const key = `${date}_${place}`

      // Se ainda não existir o grupo para essa chave, cria-o
      if (!grouped[key]) {
        grouped[key] = {
          date: date,
          place: place,
          slots: [],
        }
      }

      // Adiciona o horário (no formato Horario) ao array "horarios"
      grouped[key].slots.push({
        time,
        candidates,
        interviewers,
      })
    })

    // Retorna um array de TableData
    return Object.values(grouped).sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime() // Ordena em ordem crescente
    })
  } catch (error) {
    console.error('Erro ao obter os slots:', error)
    return []
  }
}

export default function SlotsTable({ slotsType }: SlotsTableProps) {
  const slotPlaceholder = {
    time: '--:--',
    candidates: [],
    interviewers: [],
  }

  const dayPlaceholder = {
    date: '../../....',
    place: '...',
    slots: [],
  }

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedSlot, setSelectedSlot] = useState<TableSlot>(slotPlaceholder)
  const [selectedDay, setSelectedDay] = useState<TableData>(dayPlaceholder)
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<TableData[]>([])
  const [names, setNames] = useState<string[]>([])

  useEffect(() => {
    if (slotsType == SlotsType.dinamicas) {
      getLatestMatchingSlots().then((tableData) => {
        console.log(tableData)
        setData(tableData)
      })
    } else {
      setData(dataPlaceholderEntrevistas) // provisório
    }
  }, [slotsType])

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const querySnapshot = await getDocs(collection(db, 'enrollments'))
        const enrollmentsNames = querySnapshot.docs.map(
          (doc) => doc.data().name
        )
        setNames(enrollmentsNames)
        // setNames(['nome1', 'nome2', 'nome3', 'nome4'])
      } catch (error) {
        console.error('Erro ao buscar nomes: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  return loading ? (
    <div className="flex h-screen justify-center items-center">
      <h1 className="text-orange-conpec font-bold text-2xl">Carregando...</h1>
    </div>
  ) : (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-4 font-poppins">
        Horários -{' '}
        {slotsType == SlotsType.dinamicas ? 'Dinâmicas' : 'Entrevistas'}
      </h1>
      <table className="w-full border-l table-fixed border-orange-conpec text-[13px] font-lato">
        {data.map((day, i) => {
          return (
            <tbody key={i}>
              <tr className="bg-[#FFF4EF]">
                <th className="bg-orange-conpec text-white w-[200px]">
                  {formatDate(day.date)}
                </th>
                {day.slots.map((slot, j) => {
                  const formattedTime = formatTime(slot.time)
                  return (
                    <th
                      key={j}
                      className="border-white border-r-[6px] pt-2 pb-2 w-[250px]"
                    >
                      <div className="relative flex items-center">
                        <p className="w-full text-center">{formattedTime}</p>
                        <Button
                          className="absolute right-0 p-2 rounded mr-3"
                          onPress={() => {
                            setIsOpen(true)
                            setSelectedSlot(slot)
                            setSelectedDay(day)
                          }}
                        >
                          <EditFieldIcon />
                        </Button>
                      </div>
                    </th>
                  )
                })}
              </tr>
              <tr>
                <td className="border-b border-orange-conpec text-center font-bold bg-[#FFF4EF]">
                  {day.place}
                </td>
                {day.slots.map((slot, j) => (
                  <td
                    key={j}
                    className="border-white border-r-[6px] bg-orange-conpec text-white text-center h-0 p-0"
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {slot.candidates.map((candidate, k) => (
                          <p key={k} className="bg-orange-conpec truncate">
                            {candidate}
                          </p>
                        ))}
                      </div>
                      <div>
                        {slot.interviewers.map((interviewer, k) => (
                          <p key={k} className="bg-orange-600 truncate">
                            {interviewer}
                          </p>
                        ))}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          )
        })}
      </table>
      {isOpen && (
        <EditFieldPopup
          data={data}
          selectedSlot={selectedSlot}
          selectedDay={selectedDay}
          names={names}
          slotsType={slotsType}
          setData={setData}
          setIsOpen={setIsOpen}
          setSelectedSlot={setSelectedSlot}
        />
      )}
    </div>
  )
}
