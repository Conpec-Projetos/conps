import { Button } from '@nextui-org/react'
import { TableSlot, SlotsType, TableData } from './types'

interface EditFieldPopupProps {
  data: TableData[]
  selectedSlot: TableSlot
  selectedDay: TableData
  names: string[]
  slotsType: SlotsType
  setData: (newData: TableData[]) => void
  setIsOpen: (isOpen: boolean) => void
  setSelectedSlot: (newSelectedSlot: TableSlot) => void
}

export default function EditFieldPopup({
  data,
  selectedSlot,
  selectedDay,
  names,
  slotsType,
  setData,
  setIsOpen,
  setSelectedSlot,
}: EditFieldPopupProps) {
  const numCandidates = slotsType == SlotsType.dinamicas ? 6 : 1
  const numInterviewers = 2

  let fields: { label: string; value: string }[] = []

  for (let i = 0; i < numCandidates; i++) {
    fields.push({
      label: `Candidato ${i + 1}`,
      value: selectedSlot.candidates[i],
    })
  }
  for (let i = 0; i < numInterviewers; i++) {
    fields.push({
      label: `Entrevistador ${i + 1}`,
      value: selectedSlot.interviewers[i],
    })
  }
  fields = fields.concat([
    { label: 'Dia', value: selectedDay.date },
    { label: 'Horário', value: selectedSlot.time },
    { label: 'Local', value: selectedDay.place },
  ])

  const handleSelectChange = (index: number, value: string) => {
    if (index < numCandidates) {
      const updatedCandidates = [...selectedSlot.candidates]
      updatedCandidates[index] = value

      setSelectedSlot({ ...selectedSlot, candidates: updatedCandidates })
    } else if (index < numCandidates + numInterviewers) {
      const updatedInterviewers = [...selectedSlot.interviewers]
      updatedInterviewers[index % numCandidates] = value

      setSelectedSlot({ ...selectedSlot, interviewers: updatedInterviewers })
    }
  }

  const handleSave = () => {
    const updatedData = data.map((day) => {
      if (day.date === selectedDay.date) {
        return {
          ...day,
          slots: day.slots.map((slot) => {
            if (slot.time === selectedSlot.time) {
              return {
                ...selectedSlot,
              }
            }
            return slot
          }),
        }
      }
      return day
    })
    setData(updatedData)
    setIsOpen(false)
  }

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 flex items-center justify-center bg-[#fcfcfc] bg-opacity-45"
    >
      <div
        onClick={(e) => {
          e.stopPropagation()
        }}
        className="bg-[#fff4ef] p-6 w-[506px]"
      >
        <div className="grid grid-cols-2 gap-y-2 gap-x-6 mt-4">
          {fields.map((field, index) => (
            <div key={index} className="w-[200px]">
              <label className="text-orange-conpec text-[15px] font-[600]">
                {field.label}
              </label>
              <select
                className="w-full border border-orange-conpec rounded text-[13px] font-bold"
                onChange={(e) => handleSelectChange(index, e.target.value)}
              >
                <option value="">{field.value}</option>
                {index < numCandidates &&
                  names.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>
        <Button
          className="block mt-4 mx-auto w-[221px] h-[33px] transition bg-orange-conpec text-white rounded-[5px]"
          onPress={() => handleSave()}
        >
          Salvar
        </Button>
      </div>
    </div>
  )
}
