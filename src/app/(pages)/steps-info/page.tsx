"use client";

import Image from "next/image";
import Logo from "@assets/conpec-full.png";
import { useState } from "react";
import Select, { StylesConfig } from "react-select";
import { db } from "@/firebase/firebase-config";
import { collection, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import { Option, DayTimes, Place } from "@/constants/select_options";
import { toast, Toaster } from "sonner";

export default function StepsInfoPage() {
  const [minCandidates, setMinCandidates] = useState<Option>({
    value: "1",
    label: "1",
  });
  const [maxCandidates, setMaxCandidates] = useState<Option>({
    value: "1",
    label: "1",
  });
  const [numInterviewers, setNumInterviewers] = useState<Option>({
    value: "1",
    label: "1",
  });

  const [daysTimes, setDaysTimes] = useState<DayTimes[]>([
    { date: "", times: [] },
  ]);

  const [places, setPlaces] = useState<Place[]>([
    { place: "", date: "", times: [] },
  ]);

  const numInterviewersOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
  ];

  const timeOptions: Option[] = [
    { value: "08:00", label: "08h00 - 10h00" },
    { value: "10:00", label: "10h00 - 12h00" },
    { value: "12:00", label: "12h00 - 14h00" },
    { value: "14:00", label: "14h00 - 16h00" },
    { value: "16:00", label: "16h00 - 18h00" },
  ];

  const allDayOptions: Option[] = [
    { value: "2025-03-11", label: "11/03" },
    { value: "2025-03-12", label: "12/03" },
    { value: "2025-03-13", label: "13/03" },
    { value: "2025-03-24", label: "24/03" },
    { value: "2025-03-25", label: "25/03" },
    { value: "2025-03-26", label: "26/03" },
    { value: "2025-03-27", label: "27/03" },
    { value: "2025-03-28", label: "28/03" },
  ];

  const getDayOptions = (currentIndex: number) => {
    // Pegue as datas já selecionadas em outros índices (excluindo o atual)
    const selectedDays = daysTimes
      .filter((_, index) => index !== currentIndex)
      .map((item) => item.date)
      .filter(Boolean);

    // Filtre as opções: se já foi selecionada, não deve aparecer, a não ser que seja a opção atual
    return allDayOptions.filter(
      (option) =>
        !selectedDays.includes(option.value) ||
        daysTimes[currentIndex].date === option.value
    );
  };

  const getMinCandidatesOptions = () => {
    return [...Array(6)].map((_, i) => ({
      value: i + 1,
      label: i + 1,
    }));
  };

  const getMaxCandidatesOptions = () => {
    return [...Array(6 - Number(minCandidates.value) + 1)].map((_, i) => ({
      value: minCandidates.value + i,
      label: minCandidates.value + i,
    }));
  };

  const selectStyle = "w-full border-2 border-orange-conpec rounded-[5px]";

  const selectStylesConfig: StylesConfig = {
    control: (provided) => ({
      ...provided,
      background: "#fff",
      border: "none",
      minHeight: "33px",
      boxShadow: "none",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 6px",
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
      height: "33px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  // Funções para adicionar mais dias/horários
  const handleAddDayTimes = () => {
    setDaysTimes([...daysTimes, { date: "", times: [] }]);
  };

  const handleDayTimesChange = (
    index: number,
    field: "day" | "times",
    value: string | Option[]
  ) => {
    const updatedDaysTimes = [...daysTimes];

    if (field === "day") {
      updatedDaysTimes[index].date = value as string;
    } else {
      updatedDaysTimes[index].times = value as Option[];
    }

    setDaysTimes(updatedDaysTimes);
  };

  // Funções para adicionar mais locais
  const handleAddLocal = () => {
    setPlaces([
      ...places,
      {
        place: "",
        date: "",
        times: [],
      },
    ]);
  };

  const handleLocalChange = (
    index: number,
    field: "place" | "date" | "times",
    value: string | Option[]
  ) => {
    const updatedPlaces = [...places];

    if (field === "times") {
      updatedPlaces[index].times = value as Option[];
    } else {
      updatedPlaces[index][field] = value as string;
    }

    setPlaces(updatedPlaces);
  };

  const daysTimesToMap = (
    datetimes: DayTimes[]
  ): { [key: string]: string[] } => {
    return datetimes.reduce((acc, item) => {
      acc[item.date] = item.times.map((option) => option.value);
      return acc;
    }, {} as { [key: string]: string[] });
  };

  // Função para salvar as informações
  const handleSave = async () => {
    const dataToSave = {
      AvailableSlots: {
        datetimes: daysTimesToMap(daysTimes),
        places: places.map((item) => item.place),
        // places: places.map((item) => ({
        //   place: item.place,
        //   day: item.date,
        //   times: item.times.map((option) => option.value),
        // })),
      },
      Candidates: [],
      Interviewers: [],
      MaxNumCandPerSlot: Number(maxCandidates.value),
      MinNumCandPerSlot: Number(minCandidates.value),
      NumIntPerSlot: Number(numInterviewers.value),
    };

    try {
      const dataCollectionRef = collection(db, "data");
      const querySnapshot = await getDocs(dataCollectionRef);
      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
      });

      const docRef = await addDoc(dataCollectionRef, dataToSave);
      console.log("Documento salvo com ID:", docRef.id);
      toast.success("Dados salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      toast.error("Erro ao salvar os dados");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-end">
        <Image
          src={Logo}
          alt="Conpec"
          width={150}
          height={150}
          className="select-none"
          draggable={false}
        />
      </div>

      <h1 className="text-5xl font-bold mb-4 font-poppins">
        Informações das etapas
      </h1>

      {/* Campos iniciais */}
      <div className="flex gap-24 mb-10 ml-2">
        <div className="w-[325px]">
          <label className="block mb-1 font-semibold text-orange-conpec text-[15px]">
            Número mínimo de candidatos por slot
          </label>
          <Select
            instanceId="minCandidates"
            className={selectStyle}
            value={minCandidates}
            styles={selectStylesConfig}
            options={getMinCandidatesOptions()}
            placeholder=""
            onChange={(selected) => {
              setMinCandidates(selected as Option);
              if (
                Number(maxCandidates.value) < Number((selected as Option).value)
              ) {
                setMaxCandidates(selected as Option);
              }
            }}
          />
        </div>
        <div className="w-[325px]">
          <label className="block mb-1 font-semibold text-orange-conpec text-[15px]">
            Número máximo de candidatos por slot
          </label>
          <Select
            instanceId="maxCandidates"
            className={selectStyle}
            value={maxCandidates}
            styles={selectStylesConfig}
            options={getMaxCandidatesOptions()}
            placeholder=""
            onChange={(selected) => setMaxCandidates(selected as Option)}
          />
        </div>
        <div className="w-[325px]">
          <label className="block mb-1 font-semibold text-orange-conpec text-[15px]">
            Número de entrevistadores por slot
          </label>
          <Select
            instanceId="numInterviewers"
            className={selectStyle}
            value={numInterviewers}
            styles={selectStylesConfig}
            options={numInterviewersOptions}
            placeholder=""
            onChange={(selected) => setNumInterviewers(selected as Option)}
          />
        </div>
      </div>

      {/* Dias e horários */}
      <div className="mb-10">
        <div className="flex items-center mb-2">
          <h2 className="text-4xl font-bold font-poppins">Dias e horários</h2>
          <button
            type="button"
            onClick={handleAddDayTimes}
            className="bg-orange-conpec hover:bg-orange-600 text-white w-8 h-8 rounded-full ml-5"
          >
            +
          </button>
        </div>
        {daysTimes.map((item, index) => (
          <div key={index} className="flex gap-24 mb-2 ml-2">
            <div className="w-[325px]">
              <label className="block mb-1 font-semibold text-[15px] text-orange-conpec">
                Dia
              </label>
              <Select
                instanceId={`day-daysTimes-${index}`}
                className={selectStyle}
                value={
                  allDayOptions.find((option) => option.value === item.date) ||
                  undefined
                }
                styles={selectStylesConfig}
                options={getDayOptions(index)}
                placeholder=""
                onChange={(selected) =>
                  handleDayTimesChange(index, "day", (selected as Option).value)
                }
              />
            </div>
            <div className="w-[325px]">
              <label className="block mb-1 font-semibold text-[15px] text-orange-conpec">
                Horários
              </label>
              <Select
                instanceId={`times-daysTimes-${index}`}
                isMulti
                className={selectStyle}
                styles={selectStylesConfig}
                options={timeOptions}
                value={item.times}
                placeholder=""
                onChange={(selected) =>
                  handleDayTimesChange(index, "times", selected as Option[])
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Locais */}
      <div className="mb-10">
        <div className="flex items-center mb-2">
          <h2 className="text-4xl font-bold font-poppins">Locais</h2>
          <button
            type="button"
            onClick={handleAddLocal}
            className="bg-orange-conpec hover:bg-orange-600 text-white w-8 h-8 rounded-full ml-5"
          >
            +
          </button>
        </div>
        {places.map((item, index) => (
          <div key={index} className="flex gap-24 mb-2 ml-2">
            <div className="w-[325px]">
              <label className="block mb-1 font-semibold text-[15px] text-orange-conpec">
                Local
              </label>
              <input
                type="text"
                className="w-full pl-1 border-2 border-orange-conpec rounded-[5px] h-[37px]"
                value={item.place}
                onChange={(e) =>
                  handleLocalChange(index, "place", e.target.value)
                }
              />
            </div>
            <div className="w-[325px]">
              <label className="block mb-1 font-semibold text-[15px] text-orange-conpec">
                Dia
              </label>
              <Select
                instanceId={`day-places-${index}`}
                className={selectStyle}
                value={
                  allDayOptions.find((option) => option.value === item.date) ||
                  undefined
                }
                styles={selectStylesConfig}
                options={allDayOptions}
                placeholder=""
                onChange={(selected) =>
                  handleLocalChange(index, "date", (selected as Option).value)
                }
              />
            </div>
            <div className="w-[325px]">
              <label className="block mb-1 font-semibold text-[15px] text-orange-conpec">
                Horários
              </label>
              <Select
                instanceId={`times-places-${index}`}
                isMulti
                className={selectStyle}
                styles={selectStylesConfig}
                options={timeOptions}
                value={item.times}
                placeholder=""
                onChange={(selected) =>
                  handleLocalChange(index, "times", selected as Option[])
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Botão de salvar */}
      <button
        type="button"
        onClick={handleSave}
        className="block mx-auto font-bold bg-orange-conpec hover:bg-orange-600 text-white text-[15px] w-[261px] py-2 rounded-[5px]"
      >
        Salvar informações
      </button>
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}
