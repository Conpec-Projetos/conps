"use client";
import ConpecBar from "@/components/ui/conpec-bar";
import FormsEnroll from "@/components/ui/forms-enroll";
import Logo from "@assets/conpec-full.png";
import Image from "next/image";
import { useState } from "react";
import { EnrollFormSchema } from "@/constants/form";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { db } from "@/firebase/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@nextui-org/react";

export default function EnrollmentPage() {
  const [currentPage, setCurrentPage] = useState<string>("form");
  const [enrollmentValues, setEnrollmentValues] = useState<z.infer<typeof EnrollFormSchema>>();

  const handleFormSubmit = (data: z.infer<typeof EnrollFormSchema>) => {
    console.log("Dados do forms: ", data);
    setEnrollmentValues(data);
    toast.success("Formulário enviado com sucesso!");
    setCurrentPage("availability");
  };

  const finalSubmit = () => {
    console.log("Cadastro finalizado");
    const enrollmentsCollection = collection(db, "enrollments");
    addDoc(enrollmentsCollection, enrollmentValues);
  }

  return (
    <div className="custom-scrollbar overflow-auto h-screen w-screen flex flex-col lg:flex-row bg-white font-lato">
      {" "}
      {/* Copie o div acima em todas as páginas com borda lateral */}
      <div className="flex flex-row lg:w-[75%]">
        {" "}
        {/* Copie o div acima em todas as páginas com borda lateral */}
        {currentPage === "form" ? (
          <div className="flex flex-col h-[95%]">
            <div className="flex flex-col items-start justify-start lg:w-[90%] mx-6 lg:ml-6 mt-6 mb-4 text-zinc-600">
              <div className="flex flex-row w-full justify-end items-center">
                <Image src={Logo} alt="Conpec" width={150} height={150} />
              </div>
              <h1 className="font-poppins text-3xl font-extrabold text-zinc-900">
                Informações Básicas
              </h1>
              <h2 className="text-base font-bold">
                Agradecemos por escolher participar do nosso processo seletivo!
              </h2>
              <h2 className="text-base font-bold">
                Prepare-se para iniciar uma das mais empolgantes e desafiadoras
                jornadas da sua vida acadêmica. Estamos ansiosos para embarcar
                nessa aventura extraordinária ao seu lado!
              </h2>
            </div>
            <div className="custom-scrollbar flex flex-row justify-start lg:overflow-auto lg:w-[90%] mx-6 lg:ml-6 text-orange-600">
              <FormsEnroll onSubmit={handleFormSubmit} />
            </div>
          </div>
        ) : currentPage === "availability" ? (
          <div className="flex flex-col h-[95%]">
              <p>Página de Adicionar a Disponibilidade Horários</p>
              <Button onPress={() => setCurrentPage("auth")}>Próximo</Button>
          </div>
        ) : (
          <div className="flex flex-col h-[95%]">
                <p>Página de Autenticação</p>
                <Button onPress={finalSubmit}>Finalizar Cadastro</Button>
          </div>
        )}
      </div>
      <ConpecBar />{" "}
      {/* Copie o componente acima em todas as páginas com borda lateral */}
      <Toaster richColors closeButton position="bottom-left" />
    </div>
  );
}
