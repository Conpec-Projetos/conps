import { useEffect, useState } from "react";
import { TableSlot, SlotsType, TableData, Person } from "./types";
import { Button } from "@nextui-org/react";
import EditFieldIcon from "./edit-field-icon";
import EditFieldPopup from "./edit-field-popup";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { toast, Toaster } from "sonner";
import { convertSlotsToTableData, formatTime } from "@/constants/utils";

interface SlotsTableProps {
  slotsType: SlotsType;
}

async function getLatestMatchingSlots(slotsType: SlotsType) {
  try {
    const querySnapshot =
      slotsType == SlotsType.dinamicas
        ? await getDocs(collection(db, "latest_matching_1"))
        : await getDocs(collection(db, "latest_matching_2"));

    if (querySnapshot.empty) {
      console.log("Nenhum documento encontrado na coleção");
      return [];
    }

    const data = querySnapshot.docs[0].data();
    const slots = data.slots || [];

    return convertSlotsToTableData(slots);
  } catch (error) {
    console.error("Erro ao obter os slots:", error);
    return [];
  }
}

function formatDateTable(dataString: string): string {
  const date = new Date(dataString + "T00:00:00");

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export default function SlotsTable({ slotsType }: SlotsTableProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<TableSlot>();
  const [selectedDay, setSelectedDay] = useState<TableData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TableData[]>([]);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [interviewers, setInterviewers] = useState<string[]>([]);
  const [places, setPlaces] = useState<string[]>([]);
  const [maxCandidates, setMaxCandidates] = useState<number>(6);

  useEffect(() => {
    getLatestMatchingSlots(slotsType).then((tableData) => {
      setData(tableData);
    });
  }, [slotsType]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const querySnapshot = await getDocs(collection(db, "data"));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();

          const interviewersNames = data.Interviewers.map(
            (interviewer: Person) => {
              return interviewer.Name;
            }
          );
          const candidatesNames = data.Candidates.map((candidate: Person) => {
            return candidate.Name;
          });
          const places = data.AvailableSlots.places;

          setInterviewers(interviewersNames);
          setPlaces(places);
          setCandidates(candidatesNames);
          setMaxCandidates(data.MaxNumCandPerSlot);
        } else {
          toast.error("Nenhum documento encontrado na coleção tests_1");
        }
        toast.success("Dados carregados com sucesso!");
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
        toast.error("Erro ao buscar dados");
      } finally {
        setLoading(false);
      }
    }

    fetchOptions();
  }, [slotsType]);

  return loading ? (
    <div className="flex h-screen justify-center items-center">
      <h1 className="text-orange-conpec font-bold text-2xl">Carregando...</h1>
    </div>
  ) : (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-4 font-poppins">
        Horários -{" "}
        {slotsType == SlotsType.dinamicas ? "Dinâmicas" : "Entrevistas"}
      </h1>
      <table className="w-full border-l table-fixed border-orange-conpec text-[13px] font-lato">
        {data.map((day, i) => {
          return (
            <tbody key={i}>
              <tr className="bg-[#FFF4EF]">
                <th className="bg-orange-conpec text-white w-[200px]">
                  {formatDateTable(day.date)}
                </th>
                {day.slots.map((slot, j) => {
                  const formattedTime = formatTime(slot.time);
                  return (
                    <th
                      key={j}
                      className="border-white border-r-[6px] pt-2 pb-2 w-[250px]"
                    >
                      <div className="relative flex items-center">
                        <p className="w-full text-center">{formattedTime}</p>
                        <Button
                          className="absolute right-0 p-2 rounded mr-3"
                          onPress={() => {
                            setIsOpen(true);
                            setSelectedSlot(slot);
                            setSelectedDay(day);
                          }}
                        >
                          <EditFieldIcon />
                        </Button>
                      </div>
                    </th>
                  );
                })}
              </tr>
              <tr>
                <td className="border-b border-orange-conpec text-center font-bold bg-[#FFF4EF]">
                  {day.place}
                </td>
                {day.slots.map((slot, j) => (
                  <td
                    key={j}
                    className="border-white border-r-[6px] bg-orange-conpec text-white text-center h-0 p-0"
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {slot.candidates.map((candidate, k) => (
                          <p key={k} className="bg-orange-conpec truncate">
                            {candidate}
                          </p>
                        ))}
                      </div>
                      <div>
                        {slot.interviewers.map((interviewer, k) => (
                          <p key={k} className="bg-orange-600 truncate">
                            {interviewer}
                          </p>
                        ))}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          );
        })}
      </table>
      {isOpen && selectedSlot && selectedDay && (
        <EditFieldPopup
          data={data}
          selectedSlot={selectedSlot}
          selectedDay={selectedDay}
          candidates={candidates}
          interviewers={interviewers}
          slotsType={slotsType}
          places={places}
          maxCandidates={maxCandidates}
          setData={setData}
          setIsOpen={setIsOpen}
          setSelectedSlot={setSelectedSlot}
          setSelectedDay={setSelectedDay}
        />
      )}
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}
