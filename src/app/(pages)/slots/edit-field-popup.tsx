import { Button } from "@nextui-org/react";
import { TableSlot, SlotsType, TableData } from "./types";
import { updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { toast } from "sonner";
import Select, { StylesConfig } from "react-select";
import { getAllDayOptions, timeOptions } from "@/constants/select_options";
import { Option } from "@/constants/select_options";
import { convertTableDataToSlots, formatTime } from "@/constants/utils";
import { useEffect, useMemo, useState } from "react";

interface EditFieldPopupProps {
  data: TableData[];
  selectedSlot: TableSlot;
  selectedDay: TableData;
  candidates: string[];
  interviewers: string[];
  slotsType: SlotsType;
  places: string[];
  maxCandidates: number;
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

  return formattedDate;
}

export default function EditFieldPopup({
  data,
  selectedSlot,
  selectedDay,
  candidates,
  interviewers,
  slotsType,
  places,
  maxCandidates,
  setData,
  setIsOpen,
  setSelectedSlot,
  setSelectedDay,
}: EditFieldPopupProps) {
  const numCandidates = maxCandidates;
  const numInterviewers = 2;

  const [oldTime, setOldTime] = useState<string>();
  const [oldDate, setOldDate] = useState<string>();
  const [oldPlace, setOldPlace] = useState<string>();
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);

  useEffect(() => {
    setOldTime(selectedSlot.time);
    setOldDate(selectedDay.date);
    setOldPlace(selectedDay.place);
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
      initialLabels.push(`Candidato ${i + 1}`);
    }
    for (let i = 0; i < numInterviewers; i++) {
      initialLabels.push(`Entrevistador ${i + 1}`);
    }
    return initialLabels.concat(["Dia", "Horário", "Local"]);
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

  const isTargetedSlotFilled = (
    date: string,
    time: string,
    place: string
  ): boolean => {
    const slot = convertTableDataToSlots(data).find(
      (slot) => slot.date === date && slot.time === time && slot.place === place
    );

    if (!slot) return false;

    for (const candidate of slot.candidates) {
      if (candidate !== "") return true;
    }

    for (const interviewer of slot.interviewers) {
      if (interviewer !== "") return true;
    }

    return false;
  };

  const handleSelectChange = (index: number, newValue: string) => {
    if (index < numCandidates) {
      const updatedCandidates = [...selectedSlot.candidates];
      updatedCandidates[index] = newValue;
      setSelectedSlot({ ...selectedSlot, candidates: updatedCandidates });
    } else if (index < numCandidates + numInterviewers) {
      const updatedInterviewers = [...selectedSlot.interviewers];
      updatedInterviewers[index - numCandidates] = newValue;
      setSelectedSlot({ ...selectedSlot, interviewers: updatedInterviewers });
    } else if (index === numCandidates + numInterviewers) {
      setSelectedDay({ ...selectedDay, date: newValue });
      setDisableSaveButton(
        isTargetedSlotFilled(newValue, selectedSlot.time, selectedDay.place) &&
          (newValue !== oldDate ||
            selectedSlot.time !== oldTime ||
            selectedDay.place !== oldPlace)
      );
    } else if (index === numCandidates + numInterviewers + 1) {
      setSelectedSlot({ ...selectedSlot, time: newValue });
      setDisableSaveButton(
        isTargetedSlotFilled(selectedDay.date, newValue, selectedDay.place) &&
          (newValue !== oldTime ||
            selectedDay.date !== oldDate ||
            selectedDay.place !== oldPlace)
      );
    } else if (index === numCandidates + numInterviewers + 2) {
      setSelectedDay({ ...selectedDay, place: newValue });
      setDisableSaveButton(
        isTargetedSlotFilled(selectedDay.date, selectedSlot.time, newValue) &&
          (newValue !== oldPlace ||
            selectedDay.date !== oldDate ||
            selectedSlot.time !== oldTime)
      );
    }
  };

  const emptyOriginalSlot = (data: TableData[]) => {
    return data.map((day) => {
      if (day.date === oldDate && day.place === oldPlace) {
        return {
          ...day,
          slots: day.slots.map((slot) =>
            slot.time === oldTime
              ? {
                  time: slot.time,
                  candidates: [],
                  interviewers: [],
                }
              : slot
          ),
        };
      }
      return day;
    });
  };

  const fillNewSlot = (data: TableData[]) => {
    // change time to new time
    if (oldTime !== selectedSlot.time) {
      setData(
        data.map((day) => {
          if (day.date === oldDate && day.place === oldPlace) {
            return {
              ...day,
              slots: day.slots.map((slot) =>
                slot.time === oldTime ? { ...selectedSlot } : slot
              ),
            };
          }
          return day;
        })
      );
    }

    // if day/place does not exist, create it
    if (
      !data.some(
        (day) =>
          day.date === selectedDay.date && day.place === selectedDay.place
      )
    ) {
      return [
        ...data,
        {
          date: selectedDay.date,
          place: selectedDay.place,
          slots: timeOptions.map((time) => {
            if (time.value === selectedSlot.time) return { ...selectedSlot };
            return { time: time.value, candidates: [], interviewers: [] };
          }),
        },
      ];
    }

    return data.map((day) => {
      if (day.date === selectedDay.date && day.place === selectedDay.place) {
        const newSlots = day.slots.map((slot) => {
          if (slot.time === selectedSlot.time) {
            // Atualize os dados desse slot conforme necessário.
            return { ...selectedSlot };
          } else if (slot.time === oldTime) {
            // Esvazie o slot com o horário antigo.
            return {
              time: slot.time,
              candidates: [],
              interviewers: [],
            };
          }
          return slot;
        });
        return {
          ...day,
          slots: newSlots,
        };
      }
      return day;
    });
  };

  const handleSave = async () => {
    let newData: TableData[] = emptyOriginalSlot(data);
    newData = fillNewSlot(newData);

    // Converte para o formato flat para enviar ao Firestore
    const firestoreSlots = convertTableDataToSlots(newData);

    try {
      const colRef =
        slotsType === SlotsType.dinamicas
          ? collection(db, "latest_matching_1")
          : collection(db, "latest_matching_2");
      const querySnapshot = await getDocs(colRef);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { slots: firestoreSlots });
        setData(newData);
        toast.success("Dados atualizados com sucesso!");
      } else {
        toast.error("Nenhum documento encontrado na coleção latest_matching");
      }
    } catch (error) {
      console.error("Erro ao atualizar o documento no Firestore:", error);
      toast.error("Erro ao atualizar o documento no Firestore");
    }

    setIsOpen(false);
  };

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
      return [{ value: "", label: "" }].concat(candidateOptions);
    } else if (index < numCandidates + numInterviewers) {
      return [{ value: "", label: "" }].concat(interviewerOptions);
    } else if (index === numCandidates + numInterviewers) {
      return getAllDayOptions(slotsType);
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
                className="w-full border border-orange-conpec rounded text-[13px] font-bold"
                value={options[index]}
                styles={popupSelectStylesConfig}
                options={getPopupSelectOptions(index)}
                placeholder=""
                onChange={(selected) =>
                  handleSelectChange(index, (selected as Option).value)
                }
              />
            </div>
          ))}
        </div>
        <Button
          className={`block mt-4 mx-auto w-[221px] h-[33px] transition ${
            disableSaveButton ? "bg-slate-400" : "bg-orange-conpec"
          } text-white rounded-[5px]`}
          onPress={() => handleSave()}
          isDisabled={disableSaveButton}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
