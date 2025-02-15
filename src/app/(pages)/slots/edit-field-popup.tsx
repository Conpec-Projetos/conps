import { Button } from '@nextui-org/react'
import { Horario } from './types'

type EditFieldPopupProps = {
  horario: Horario
  day: string
  local: string
  setIsOpen: (isOpen: boolean) => void
  names: string[]
}

export default function EditFieldPopup({
  horario,
  day,
  local,
  setIsOpen,
  names,
}: EditFieldPopupProps) {
  const otherFields = [
    { label: 'Dia', value: day },
    { label: 'Horário', value: horario.horario },
    { label: 'Local', value: local },
  ]
  console.log(names)
  let fields: { label: string; value: string }[] = []

  for (let i = 0; i < horario.candidatos.length; i++) {
    fields.push({
      label: `Candidato ${i + 1}`,
      value: horario.candidatos[i],
    })
  }
  for (let i = 0; i < horario.entrevistadores.length; i++) {
    fields.push({
      label: `Entrevistador ${i + 1}`,
      value: horario.entrevistadores[i],
    })
  }
  fields = fields.concat(otherFields)

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
              <select className="w-full border border-orange-conpec rounded text-[13px] font-bold">
                <option value="">{field.value}</option>
                {index < horario.candidatos.length &&
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
          onPress={() => setIsOpen(false)}
        >
          Salvar
        </Button>
      </div>
    </div>
  )
}
