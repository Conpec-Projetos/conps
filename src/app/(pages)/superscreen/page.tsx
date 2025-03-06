"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@assets/conpec-full.png";
import { algorithm } from "../../time_matching";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { Phase } from "@/constants/utils";
interface Candidate {
  TransformedAvailability: { day: string; hours: string[] }[];
  Name: string;
  Gender: string;
  Candidates: Array<Candidate>;
  Availability: { [key: string]: { [key: string]: boolean } };
}

interface Interviewer {
  TransformedAvailability: { day: string; hours: string[] }[];
  Name: string;
  Gender: string;
  Availability: { [key: string]: { [key: string]: boolean } };
}

export default function Superscreen() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [selected, setSelected] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = collection(db, "tests_2");
      const tests = (await getDocs(snapshot)).docs.map((doc) => doc.data());
      tests[0].Candidates.map((cand: Candidate) => {
        console.log(cand);
        const keys = Object.keys(cand.Availability);
        keys.sort();
        const avals = [];
        for (const key of keys) {
          const hoursKeys = Object.keys(cand.Availability[key]);
          const list_hours = [];
          for (const hourKey of hoursKeys) {
            if (cand.Availability[key][hourKey]) {
              list_hours.push(hourKey);
            }
            list_hours.sort();
          }
          if (list_hours.length > 0) {
            const avalObj = {
              day: key,
              hours: list_hours,
            };
            avals.push(avalObj);
          }
        }
        cand.TransformedAvailability = avals;
      });
      setCandidates(tests[0].Candidates);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = collection(db, "tests_2");
      const tests2 = (await getDocs(snapshot)).docs.map((doc) => doc.data());
      tests2[0].Interviewers.map((inter: Interviewer) => {
        const keys2 = Object.keys(inter.Availability);
        keys2.sort();
        const avals_inter = [];
        for (const key of keys2) {
          const hoursKeys_inter = Object.keys(inter.Availability[key]);
          const list_hours_inter = [];
          for (const hourKey of hoursKeys_inter) {
            if (inter.Availability[key][hourKey]) {
              list_hours_inter.push(hourKey);
            }
            list_hours_inter.sort();
          }
          if (list_hours_inter.length > 0) {
            const avalObj = {
              day: key,
              hours: list_hours_inter,
            };
            avals_inter.push(avalObj);
          }
        }
        inter.TransformedAvailability = avals_inter;
      });
      setInterviewers(tests2[0].Interviewers);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row w-full justify-end items-center pt-4 pr-4 select-none">
        <Image src={Logo} alt="description" width={150} height={150} />
      </div>
      <div className="flex flex-row justify-between bg-white font-lato pt-2 space-x-4 select-none">
        <div className="ml-5 font-lato font-extrabold text-3xl">Supertela</div>
        <div className="h-fit w-fit flex gap-5 pr-10">
          <Button
            className="w-fit bg-orange-conpec font-bold font-lato text-[#FCFCFC] hover:bg-orange-600"
            size="lg"
            variant="default"
            onClick={() => router.push("/steps-info")}
          >
            Informações da etapa
          </Button>
          <Button
            className="w-fit bg-orange-conpec font-bold font-lato text-[#FCFCFC] hover:bg-orange-600"
            size="lg"
            variant="default"
          >
            Pedidos de mudança
          </Button>
          <Button
            className="w-fit bg-orange-conpec font-bold font-lato text-[#FCFCFC] hover:bg-orange-600"
            size="lg"
            variant="default"
          >
            Tela de slots
          </Button>
        </div>
      </div>
      <div className="flex flex-row pt-5 justify-center w-full font-lato select-none">
        <Select
          onValueChange={(value) => setSelected(parseInt(value))}
          value={selected.toString()}
        >
          <SelectTrigger className="w-fit text-center text-[#FCFCFC] font-bold text-xl bg-orange-conpec">
            Selecione o tipo de usuário
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipo</SelectLabel>
              <SelectItem value="0">Candidato</SelectItem>
              <SelectItem value="1">Entrevistador</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selected === 0 && <Candidates candidates={candidates} />}
      {selected === 1 && <Interviewers interviewers={interviewers} />}

      {/* empurra o botão para baixo */}
      <div className="flex-grow"></div>
      {/* botão de rodar o algoritmo - Final Screen */}
      <div className="flex flex-row w-full justify-center items-center pb-3 mt-5">
        <Button
          className="w-fit"
          size="lg"
          variant="destructive"
          onClick={() => {
            algorithm(Phase.Dinamicas);
            algorithm(Phase.Entrevistas);
          }}
        >
          Rodar Algoritmo
        </Button>
      </div>
    </div>
  );
}

const Candidates = ({ candidates }: { candidates: Candidate[] }) => {
  return (
    <div className="flex flex-col justify-start items-start pt-10 pl-5 font-bold text-xl gap-5">
      Candidatos
      <div className="w-full grid grid-cols-2 gap-5 pt-10">
        {candidates.map((cand, index) => (
          <Table key={index} className="border border-orange-500 w-full">
            {/* Cabeçalho */}
            <TableHeader className="bg-orange-500 text-white text-center">
              <TableRow>
                <TableHead className="border border-orange-500 text-center w-40 text-black">
                  Nome
                </TableHead>
                <TableHead className="bg-stone-50 w-35 text-center text-black">
                  Gênero
                </TableHead>
                <TableHead className="border border-orange-500 text-center w-80 text-black">
                  Disponibilidade
                </TableHead>
                <TableHead className="bg-stone-50 w-40 text-center text-black">
                  Situação
                </TableHead>
              </TableRow>
            </TableHeader>
            {/* Corpo da Tabela */}
            <TableBody>
              <TableRow>
                <TableCell
                  className="border border-orange-500 font-semibold text-center align-middle"
                  rowSpan={2}
                >
                  {cand.Name}
                </TableCell>
                <TableCell
                  className="border border-orange-500 text-center align-middle"
                  rowSpan={2}
                >
                  {cand.Gender}
                </TableCell>
                <TableCell className="border border-orange-500 p-2">
                  {cand.TransformedAvailability.map(
                    (aval: { day: string; hours: string[] }, index) => (
                      <div
                        key={index}
                        className="flex flex-row flex-grow w-full"
                      >
                        <strong
                          className={`${
                            index % 2 == 0 ? "bg-slate-300" : "bg-slate-100"
                          }`}
                        >
                          {aval.day}: {aval.hours.join(" - ")}
                        </strong>
                      </div>
                    )
                  )}
                </TableCell>
                <TableCell
                  className="border border-orange-500 text-center align-middle"
                  rowSpan={2}
                >
                  <span className="font-bold">Aprovado</span> pra próxima etapa
                  ou não aprovado
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ))}
      </div>
    </div>
  );
};

const Interviewers = ({ interviewers }: { interviewers: Interviewer[] }) => {
  return (
    <div className="flex flex-col justify-start items-start pt-8 pl-5 font-bold text-xl gap-5">
      Entrevistadores
      <div className="w-full grid grid-cols-2 gap-5 pt-10">
        {interviewers.map((inter, index) => (
          <Table key={index} className="border border-orange-500 w-full">
            {/* Cabeçalho */}
            <TableHeader className="bg-orange-500 text-white text-center">
              <TableRow>
                <TableHead className="border border-orange-500 text-center w-40 text-black">
                  Nome
                </TableHead>
                <TableHead className="bg-stone-50 w-35 text-center text-black">
                  Gênero
                </TableHead>
                <TableHead className="border border-orange-500 text-center w-80 text-black">
                  Disponibilidade
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Corpo da Tabela */}
            <TableBody>
              <TableRow>
                <TableCell
                  className="border border-orange-500 font-semibold text-center align-middle"
                  rowSpan={2}
                >
                  {inter.Name}
                </TableCell>
                <TableCell
                  className="border border-orange-500 text-center align-middle"
                  rowSpan={2}
                >
                  {inter.Gender}
                </TableCell>
                <TableCell className="border border-orange-500 p-2">
                  {inter.TransformedAvailability.map(
                    (aval: { day: string; hours: string[] }, index) => (
                      <div
                        key={index}
                        className="flex flex-row flex-grow w-full"
                      >
                        <strong
                          className={`${
                            index % 2 == 0 ? "bg-slate-300" : "bg-slate-100"
                          }`}
                        >
                          {aval.day}: {aval.hours.join(" - ")}
                        </strong>
                      </div>
                    )
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ))}
      </div>
    </div>
  );
};
