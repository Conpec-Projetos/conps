"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { algorithm } from "./time_matching";

export default function App() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-2 bg-white font-lato">
      <Button
        className="w-fit"
        size="lg"
        variant="destructive"
        onClick={() => router.push("/enrollment")}
      >
        Se inscreva no PS!
      </Button>
      <Button
        className="w-fit"
        size="lg"
        variant="destructive"
        onClick={() => router.push("/slots/dinamicas")}
      >
        DINÂMICAS
      </Button>
      <Button
        className="w-fit"
        size="lg"
        variant="destructive"
        onClick={() => router.push("/slots/entrevistas")}
      >
        ENTREVISTAS
      </Button>
      <Button
        className="w-fit"
        size="lg"
        variant="destructive"
        onClick={() => router.push("/availability")}
      >
        DISPONIBILIDADE
      </Button>
      <Button
        className="w-fit"
        size="lg"
        variant="destructive"
        onClick={() => algorithm()}
      >
        RODAR ALGORITMO
      </Button>
      <Button
        className="w-fit"
        size="lg"
        variant="destructive"
        onClick={() => router.push("/superscreen")}
      >
        SUPER TELA
      </Button>
    </div>
  );
}