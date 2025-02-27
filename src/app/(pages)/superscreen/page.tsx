"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Logo from "@assets/conpec-full.png";
import { algorithm } from "../../time_matching";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from '@/firebase/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
interface Candidate {
  Name: string;
  Gender: string;
  // Add other properties as needed
}

const page = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = collection(db, "tests_2")
      const tests = (await getDocs(snapshot)).docs.map(doc => doc.data())
      setCandidates(tests[0].Candidates)
    }
    fetchData()
    console.log(candidates)
  }, [])

  const consoleClick = () => {
    algorithm();
  }
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
      <div className='flex flex-row justify-start items-start pt-10 pl-5 font-bold text-xl gap-5'>
        Candidados
        <div className='w-full grid grid-cols-2 gap-5 pt-10'> {/* Alterado aqui para grid-cols-2 */}
          {candidates.map((cand) => (
            <Table className="border border-orange-500 w-full"> {/* Removido w-full da div envolvente */}
              {/* Cabeçalho */}
              <TableHeader className="bg-orange-500 text-white text-center">
                <TableRow>
                  <TableHead className="border border-orange-500 text-center w-40 text-black">Nome</TableHead>
                  <TableHead className="bg-stone-50 w-35 text-center text-black">Gênero</TableHead>
                  <TableHead className="border border-orange-500 text-center w-80 text-black">Disponibilidade</TableHead>
                  <TableHead className="bg-stone-50 w-40 text-center text-black">Situação</TableHead>
                </TableRow>
              </TableHeader>

              {/* Corpo da Tabela */}
              <TableBody>
                <TableRow>
                  <TableCell className="border border-orange-500 font-semibold text-center align-middle" rowSpan={2}>
                    {cand.Name}
                  </TableCell>
                  <TableCell className="border border-orange-500 text-center align-middle" rowSpan={2}>
                    {cand.Gender}
                  </TableCell>
                  <TableCell className="border border-orange-500 p-2">
                    <strong>Dia 1:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                    <br />
                    <strong>Dia 2:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                    <br />
                    <strong>Dia 3:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                    <br />
                    <strong>Dia 4:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                    <br />
                    <strong>Dia 5:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                  </TableCell>
                  <TableCell className="border border-orange-500 text-center align-middle" rowSpan={2}>
                    <span className="font-bold">Aprovado</span> pra próxima etapa ou não aprovado
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ))}
        </div>
      </div>

      <div className='flex flex-row justify-start items-start pt-8 pl-5 font-bold text-xl gap-5'>
        Entrevistadores
        <div className="flex flex-row gap-4 justify-start items-start pt-10 w-full">
          <Table className="border border-orange-500 w-[80%]">
            {/* Cabeçalho */}
            <TableHeader className="bg-orange-500 text-white text-center">
              <TableRow>
                <TableHead className="border border-orange-500 text-center w-40 text-black">Nome</TableHead>
                <TableHead className="bg-stone-50 w-35 text-center text-black">Gênero</TableHead>
                <TableHead className="border border-orange-500 text-center w-80 text-black">Disponibilidade</TableHead>
              </TableRow>
            </TableHeader>

            {/* Corpo da Tabela */}
            <TableBody>
              <TableRow>
                <TableCell className="border border-orange-500 font-semibold text-center align-middle" rowSpan={2}>
                  Nome do Entrevistador
                </TableCell>
                <TableCell className="border border-orange-500 text-center align-middle" rowSpan={2}>
                  F ou M ou etc
                </TableCell>
                <TableCell className="border border-orange-500 p-2">
                  <strong>Dia 1:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                  <br />
                  <strong>Dia 2:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                  <br />
                  <strong>Dia 3:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                  <br />
                  <strong>Dia 4:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                  <br />
                  <strong>Dia 5:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table className="border border-orange-500 w-[80%]">
            {/* Cabeçalho */}
            <TableHeader className="bg-orange-500 text-white text-center">
              <TableRow>
                <TableHead className="border border-orange-500 text-center w-40 text-black">Nome</TableHead>
                <TableHead className="bg-stone-50 w-35 text-center text-black">Gênero</TableHead>
                <TableHead className="border border-orange-500 text-center w-80 text-black">Disponibilidade</TableHead>
              </TableRow>
            </TableHeader>

            {/* Corpo da Tabela */}
            <TableBody>
              <TableRow>
                <TableCell className="border border-orange-500 font-semibold text-center align-middle" rowSpan={2}>
                  Nome do Entrevistador
                </TableCell>
                <TableCell className="border border-orange-500 text-center align-middle" rowSpan={2}>
                  F ou M ou etc
                </TableCell>
                <TableCell className="border border-orange-500 p-2">
                  <strong>Dia 1:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                  <br />
                  <strong>Dia 2:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                  <br />
                  <strong>Dia 3:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                  <br />
                  <strong>Dia 4:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                  <br />
                  <strong>Dia 5:</strong> xxhyy - wwhzz, xxhyy - wwhzz, xxhyy - wwhzz
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

        </div>
      </div>


      {/* empurra o botão para baixo */}
      <div className="flex-grow"></div>
      {/* botão de rodar o algoritmo - Final Screen */}
      <div className='flex flex-row w-full justify-center items-center pb-3 mt-5'>
        <Button className="w-fit" size="lg" variant="destructive" onClick={consoleClick}>
          Rodar Algoritmo
        </Button>
      </div>

    </div>
  )
}

export default page