import Image from "next/image"
import LogoStylized from "@assets/conpec-styled.png";

export const ConpecBar = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full lg:h-auto lg:w-[25%] bg-orange-700">
        <Image src={LogoStylized} alt="Conpec" width={250} height={250} />
      </div>  
    )
}

export default ConpecBar