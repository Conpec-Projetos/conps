import { FirestoreSlot, Slot, TableData } from "@/app/(pages)/slots/types";

export enum Phase {
  Dinamicas,
  Entrevistas,
}

export function formatTime(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const finalHour = (hour + 2) % 24;
  const formattedHour = hour.toString().padStart(2, "0");
  const formattedFinalHour = finalHour.toString().padStart(2, "0");
  const formattedMinute = minute.toString().padStart(2, "0");

  return `${formattedHour}h${formattedMinute} - ${formattedFinalHour}h${formattedMinute}`;
}

export function convertTableDataToSlots(data: TableData[]): FirestoreSlot[] {
  return data.flatMap((day) =>
    day.slots.map((slot) => ({
      date: day.date,
      place: day.place,
      time: slot.time,
      candidates: slot.candidates,
      interviewers: slot.interviewers,
    }))
  );
}

export function convertSlotsToTableData(slots: Slot[]): TableData[] {
  const grouped: Record<string, TableData> = {};

  slots.forEach((slot: Slot) => {
    // Extraia as propriedades de cada slot
    const { date, place, time, candidates, interviewers } = slot;
    const key = `${date}_${place}`;

    // Se ainda não existir o grupo para essa chave, cria-o
    if (!grouped[key]) {
      grouped[key] = {
        date: date,
        place: place,
        slots: [],
      };
    }

    // Adiciona o horário (no formato Horario) ao array "horarios"
    grouped[key].slots.push({
      time,
      candidates,
      interviewers,
    });
  });

  // Retorna um array de TableData
  return Object.values(grouped).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime(); // Ordena em ordem crescente
  });
}
