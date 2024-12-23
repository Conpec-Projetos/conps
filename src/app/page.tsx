"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function App() {

  const router = useRouter();

  const handleClick = () => {
    router.push('/enrollment');
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white font-lato">
      <Button className="w-fit" size="lg" variant="destructive" onClick={handleClick}>Se inscreva no PS!</Button>
    </div>
  );
}