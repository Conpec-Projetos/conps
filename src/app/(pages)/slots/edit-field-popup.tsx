import { Button } from "@nextui-org/react";
import { TableSlot, SlotsType, TableData, FirestoreSlot } from "./types";
import { updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
// import { toast } from "sonner";
import Select, { StylesConfig } from "react-select";
import { allDayOptions, timeOptions } from "@/constants/select_options";
import { Option } from "@/constants/select_options";
import {
  convertSlotsToTableData,
  convertTableDataToSlots,
  formatTime,
} from "@/constants/utils";
import { useEffect, useMemo, useState } from "react";

interface EditFieldPopupProps {
  data: TableData[];
  selectedSlot: TableSlot;
  selectedDay: TableData;
  candidates: string[];
  interviewers: string[];
  slotsType: SlotsType;
  places: string[];
  setData: (newData: TableData[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedSlot: (newSelectedSlot: TableSlot) => void;
  setSelectedDay: (newSelectedDay: TableData) => void;
}

function formatDatePopup(dataString: string): string {
  const date = new Date(dataString + "T00:00:00");

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export default function EditFieldPopup({
  data,
  selectedSlot,
  selectedDay,
  candidates,
  interviewers,
  slotsType,
  places,
  setData,
  setIsOpen,
  setSelectedSlot,
  setSelectedDay,
}: EditFieldPopupProps) {
  const numCandidates = slotsType == SlotsType.dinamicas ? 6 : 1;
  const numInterviewers = 2;

  const [oldTime, setOldTime] = useState<string>("");

  useEffect(() => {
    setOldTime(selectedSlot.time);
  }, []); // array vazio: executa apenas ao montar o componente

  const candidateOptions: Option[] = candidates.map((candidate) => ({
    value: candidate,
    label: candidate,
  }));

  const interviewerOptions: Option[] = interviewers.map((interviewer) => ({
    value: interviewer,
    label: interviewer,
  }));

  const getInitialLabels = (): string[] => {
    const initialLabels: string[] = [];
    for (let i = 0; i < numCandidates; i++) {
      initialLabels.push("Candidato");
    }
    for (let i = 0; i < numInterviewers; i++) {
      initialLabels.push("Entrevistador");
    }
    return initialLabels.concat(["Dia", "Horário", "Local"]);
  };

  const moveSelectedSlotToNewDay = (oldDate: string, newDate: string) => {
    const firebaseSlots = convertTableDataToSlots(data);

    // Encontra o slot selecionado no array de slots do Firestore
    const selectedFirestoreSlot = firebaseSlots.find(
      (slot) =>
        slot.date === selectedDay.date &&
        slot.place === selectedDay.place &&
        slot.time === selectedSlot.time
    );

    if (!selectedFirestoreSlot) {
      console.error("Slot não encontrado no Firestore");
      return;
    }

    // Cria um novo slot com os mesmos dados do slot selecionado
    // mas com a data atualizada
    const newFirestoreSlot: FirestoreSlot = {
      ...selectedFirestoreSlot,
      date: newDate,
    };

    // Atualiza o slot no Firestore
    const updatedFirestoreSlots = firebaseSlots.map((slot) =>
      slot === selectedFirestoreSlot ? newFirestoreSlot : slot
    );

    const updatedData = convertSlotsToTableData(updatedFirestoreSlots);

    setData(updatedData);
    setSelectedDay(
      updatedData.find((day) => day.date === newDate) || selectedDay
    );
  };

  const options = useMemo(() => {
    const opts: Option[] = [];

    for (let i = 0; i < numCandidates; i++) {
      opts.push({
        label: selectedSlot.candidates[i],
        value: selectedSlot.candidates[i],
      });
    }
    for (let i = 0; i < numInterviewers; i++) {
      opts.push({
        label: selectedSlot.interviewers[i],
        value: selectedSlot.interviewers[i],
      });
    }
    opts.push({
      label: formatDatePopup(selectedDay.date),
      value: selectedDay.date,
    });
    opts.push({
      label: formatTime(selectedSlot.time),
      value: selectedSlot.time,
    });
    opts.push({ label: selectedDay.place, value: selectedDay.place });

    return opts;
  }, [numCandidates, numInterviewers, selectedSlot, selectedDay]);

  const labels = getInitialLabels();

  const handleSelectChange = (
    index: number,
    newValue: string,
    oldValue: string
  ) => {
    if (index < numCandidates) {
      const updatedCandidates = [...selectedSlot.candidates];
      updatedCandidates[index] = newValue;
      setSelectedSlot({ ...selectedSlot, candidates: updatedCandidates });
    } else if (index < numCandidates + numInterviewers) {
      const updatedInterviewers = [...selectedSlot.interviewers];
      updatedInterviewers[index % numCandidates] = newValue;
      setSelectedSlot({ ...selectedSlot, interviewers: updatedInterviewers });
    } else if (index === numCandidates + numInterviewers) {
      moveSelectedSlotToNewDay(oldValue, newValue);
    } else if (index === numCandidates + numInterviewers + 1) {
      setSelectedSlot({ ...selectedSlot, time: newValue });
    } else if (index === numCandidates + numInterviewers + 2) {
    }
  };

  const handleSave = async () => {
    const updatedData = data.map((day) => {
      if (day.date === selectedDay.date) {
        return {
          ...day,
          slots: day.slots.map((slot) => {
            if (slot.time === oldTime) {
              return {
                ...selectedSlot,
                time: selectedSlot.time,
              };
            }
            return slot;
          }),
        };
      }
      return day;
    });

    const firestoreSlots = convertTableDataToSlots(updatedData);

    try {
      const colRef = collection(db, "latest_matching");
      const querySnapshot = await getDocs(colRef);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { slots: firestoreSlots });
        setData(updatedData);
        // toast.success("Dados atualizados com sucesso!");
      } else {
        // toast.error("Nenhum documento encontrado na coleção latest_matching");
      }
    } catch (error) {
      // toast.error("Erro ao atualizar o documento no Firestore");
      console.error("Erro ao atualizar o documento no Firestore:", error);
    }

    setIsOpen(false);
  };

  const popupSelectStyle =
    "w-full border border-orange-conpec rounded text-[13px] font-bold";

  const popupSelectStylesConfig: StylesConfig = {
    control: (provided) => ({
      ...provided,
      background: "#fff",
      border: "none",
      minHeight: "20px",
      boxShadow: "none",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 0",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "20px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  const getPopupSelectOptions = (index: number): Option[] => {
    if (index < numCandidates) {
      return candidateOptions;
    } else if (index < numCandidates + numInterviewers) {
      return interviewerOptions;
    } else if (index === numCandidates + numInterviewers) {
      return allDayOptions;
    } else if (index === numCandidates + numInterviewers + 1) {
      return timeOptions;
    }
    return places.map((place) => ({ value: place, label: place }));
  };

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 flex items-center justify-center bg-[#fcfcfc] bg-opacity-45"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-[#fff4ef] p-6 w-[506px]"
      >
        <div className="grid grid-cols-2 gap-y-2 gap-x-6 mt-4">
          {options.map((option, index) => (
            <div key={index} className="w-[200px]">
              <label className="text-orange-conpec text-[15px] font-[600]">
                {labels[index]}
              </label>
              <Select
                instanceId={`${selectedDay.place}-${selectedDay.date}-${selectedSlot.time}-${index}`}
                className={popupSelectStyle}
                value={options[index]}
                styles={popupSelectStylesConfig}
                options={getPopupSelectOptions(index)}
                placeholder=""
                onChange={(selected) =>
                  handleSelectChange(
                    index,
                    (selected as Option).value,
                    options[index].value
                  )
                }
              />
            </div>
          ))}
        </div>
        <Button
          className="block mt-4 mx-auto w-[221px] h-[33px] transition bg-orange-conpec text-white rounded-[5px]"
          onPress={() => handleSave()}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
