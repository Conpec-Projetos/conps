"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { algorithm } from "./time_matching";

export default function App() {

  const router = useRouter();
  const consoleClick = () => {
    algorithm();  
  }

  const handleClick = () => {
    router.push('/enrollment');
  }

  const superscreen = () => {
    router.push('/superscreen');
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white font-lato">
      <Button className="w-fit" size="lg" variant="destructive" onClick={handleClick}>Se inscreva no PS!</Button>
      <Button className="w-fit" size="lg" variant="destructive" onClick={consoleClick}>RODAR ALGORITMO</Button>
      <Button className="w-fit" size="lg" variant="destructive" onClick={superscreen}>Ir para a Super Tela</Button>
    </div>
  );
}