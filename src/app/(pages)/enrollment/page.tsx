import FormsEnroll from "@/components/ui/forms-enroll";
import Logo from "@assets/conpec-logo.svg";
import LogoStylized from "@assets/conpec-stylized.svg";
import Image from "next/image";

export default function EnrollmentPage() {
  return (
    <div className="custom-scrollbar overflow-auto h-screen w-screen flex flex-col lg:flex-row bg-white font-lato">
      <div className="flex flex-row lg:w-[75%]">
        <div className="flex flex-col h-[95%]">
          <div className="flex flex-col items-start justify-start lg:w-[90%] mx-6 lg:ml-6 mt-6 mb-4 text-zinc-600">
            <div className="flex flex-row w-full justify-end items-center">
              <Image src={Logo} alt="Conpec" width={150} height={150} />
            </div>
            <h1 className="font-poppins text-3xl font-extrabold text-zinc-900">Informações Básicas</h1>
            <h2 className="text-base font-bold">Agradecemos por escolher participar do nosso processo seletivo!</h2>
            <h2 className="text-base font-bold">Prepare-se para iniciar uma das mais empolgantes e desafiadoras jornadas da sua vida acadêmica. Estamos ansiosos para embarcar nessa aventura extraordinária ao seu lado!</h2>
          </div>
          <div className="custom-scrollbar flex flex-row justify-start lg:overflow-auto lg:w-[90%] mx-6 lg:ml-6 text-orange-600">
            <FormsEnroll />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full lg:h-auto lg:w-[25%] bg-orange-700">
        <Image src={LogoStylized} alt="Conpec" width={250} height={250} />
      </div>
      
      
    </div>
  );
}