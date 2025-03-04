export interface DayTimes {
  date: string;
  times: Option[];
}

export interface Place {
  place: string;
  date: string;
  times: Option[];
}

export interface Option {
  value: string;
  label: string;
}

export const timeOptions: Option[] = [
    { value: "08:00", label: "08h00 - 10h00" },
    { value: "10:00", label: "10h00 - 12h00" },
    { value: "12:00", label: "12h00 - 14h00" },
    { value: "14:00", label: "14h00 - 16h00" },
    { value: "16:00", label: "16h00 - 18h00" },
  ];

export const allDayOptions: Option[] = [
    { value: "2025-03-11", label: "11/03" },
    { value: "2025-03-12", label: "12/03" },
    { value: "2025-03-13", label: "13/03" },
    { value: "2025-03-24", label: "24/03" },
    { value: "2025-03-25", label: "25/03" },
    { value: "2025-03-26", label: "26/03" },
    { value: "2025-03-27", label: "27/03" },
    { value: "2025-03-28", label: "28/03" },
  ];