import React from 'react'
import Image from 'next/image'
import Logo from "@assets/conpec-full.png";
import { Bold } from 'lucide-react';
import { Button } from "@/components/ui/button";
const page = () => {
  return (
    <div className="flex flex-col min-h-screen">
        <div className="flex flex-row w-full justify-end items-center pt-4 pr-4">
        <Image src={Logo} alt="description" width={150} height={150} />
        </div>
        <div className='flex flex-row justify-start items-center pt-3 pl-8 font-bold text-3xl'>
            Supertela
        </div>
        <div className="flex flex-row justify-center bg-white font-lato pt-2 space-x-4">
            <Button className="w-fit" size="lg" variant="destructive">
                Informações da etapa
            </Button>
            <Button className="w-fit" size="lg" variant="destructive">
                Pedidos de mudança
            </Button>
            <Button className="w-fit" size="lg" variant="destructive">
                Tela de slots
            </Button>
        </div>
        <div className='flex flex-row justify-start items-center pt-10 pl-8 font-bold text-xl'>
            Candidados
        </div>
        <div className='flex flex-row justify-start items-center mt-80 pl-8 font-bold text-xl'>
            Entrevistadores
        </div>
        {/* empurra o botão para baixo */}
        <div className="flex-grow"></div>
        {/* botão de rodar o algoritmo - Final Screen */}
        <div className='flex flex-row w-full justify-center items-center pb-10'>
            <Button className="w-fit" size="lg" variant="destructive">
                Rodar Algoritmo
            </Button>
        </div>
        
    </div>
  )
}

export default page