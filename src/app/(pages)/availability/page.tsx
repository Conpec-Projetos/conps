'use client'
import ConpecBar from '@/components/ui/conpec-bar'
import Logo from '@assets/conpec-full.png'
import Image from 'next/image'
import { useState } from 'react'
import { /*toast,*/ Toaster } from 'sonner'
// import { db } from "@/firebase/firebase-config";
// import { collection, addDoc } from "firebase/firestore";
// import { Button } from "@nextui-org/react";

type Selecionados = Record<string, boolean>

export default function TimetablePage() {
  const dias = ['20/03', '21/03', '22/03', '23/03']
  const horarios = ['8h - 10h', '10h - 12h', '14h - 16h', '16h - 18h']

  const [selecionados, setSelecionados] = useState<Selecionados>({})

  const toggleHorario = (dia: string, horario: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelecionados((prev: any) => {
      const chave = `${dia}-${horario}`
      const novoEstado = { ...prev }

      if (novoEstado[chave]) {
        delete novoEstado[chave] // Se já estiver selecionado, remove
      } else {
        novoEstado[chave] = true // Caso contrário, adiciona
      }

      return novoEstado
    })
  }

  return (
    <div className="custom-scrollbar overflow-auto h-screen w-screen flex flex-col lg:flex-row bg-white font-lato">
      {' '}
      {/* Copie o div acima em todas as páginas com borda lateral */}
      <div className="flex flex-row lg:w-[75%]">
        {' '}
        {/* Copie o div acima em todas as páginas com borda lateral */}
        <div className="flex flex-col h-[95%]">
          <div className="flex flex-col items-start justify-start lg:w-[90%] mx-6 lg:ml-6 mt-6 mb-4 text-zinc-600">
            <div className="flex flex-row w-full justify-end items-center">
              <Image
                src={Logo}
                alt="Conpec"
                width={150}
                height={150}
                className="select-none"
                draggable={false}
              />
            </div>
            <h1 className="font-poppins text-3xl font-extrabold text-zinc-900">
              Disponibilidade de Horários
            </h1>
            <h2 className="text-base font-bold">
              Escolha os melhores horários para marcarmos a dinâmica em grupo
              {/* (você pode alterá-los mais tarde, caso precise) */}.
            </h2>

            <div className="mt-6 space-y-4">
              {dias.map((dia) => (
                <div key={dia} className="flex items-center">
                  <h2 className="text-lg font-semibold">{dia}</h2>
                  <div className="flex gap-8 mt-2 ml-8">
                    {horarios.map((horario) => {
                      const chave = `${dia}-${horario}`
                      const selecionado = selecionados[chave]

                      return (
                        <button
                          key={horario}
                          className={`w-28 h-14 rounded-2xl text-sm font-medium transition text-white text-[15px] ${
                            selecionado
                              ? 'bg-orange-conpec'
                              : 'bg-[#676767] hover:bg-neutral-500'
                          }`}
                          onClick={() => toggleHorario(dia, horario)}
                        >
                          {horario}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ConpecBar />{' '}
      {/* Copie o componente acima em todas as páginas com borda lateral */}
      <Toaster richColors closeButton position="bottom-right" />
    </div>
  )
}
