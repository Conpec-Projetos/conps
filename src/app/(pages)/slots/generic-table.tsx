import { useState } from 'react'
import { Horario, SlotsType, TableData } from './types'
import { Button } from '@nextui-org/react'
import EditFieldIcon from './edit-field-icon'
import EditFieldPopup from './edit-field-popup'

type GenericTableProps = {
  slotsType: SlotsType
  data: TableData[]
  names: string[]
}

export default function GenericTable({
  slotsType,
  data,
  names,
}: GenericTableProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedHorario, setSelectedHorario] = useState<Horario>(
    data[0].horarios[0]
  )
  const [selectedDay, setSelectedDay] = useState<TableData>(data[0])

  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-4 font-poppins">
        Horários -{' '}
        {slotsType == SlotsType.dinamicas ? 'Dinâmicas' : 'Entrevistas'}
      </h1>
      <table className="w-full border-collapse border-orange-conpec text-[13px] font-lato">
        {data.map((day, i) => (
          <tbody key={i}>
            <tr className="bg-[#FFF4EF]">
              <th className="border border-orange-conpec bg-orange-conpec text-white w-[15%]">
                {day.day}
              </th>
              {day.horarios.map((horario, k) => (
                <th key={k} className="border-white border-r-[6px] pt-2 pb-2">
                  <div className="relative flex items-center">
                    <p className="w-full text-center">{horario.horario}</p>
                    <Button
                      className="absolute right-0 p-2 rounded mr-3"
                      onPress={() => {
                        setIsOpen(true)
                        setSelectedHorario(horario)
                        setSelectedDay(day)
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
                {day.local}
              </td>
              {day.horarios.map((horario, k) => (
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
      {isOpen && (
        <EditFieldPopup
          horario={selectedHorario}
          day={selectedDay.day}
          local={selectedDay.local}
          setIsOpen={setIsOpen}
          names={names}
        />
      )}
    </div>
  )
}
