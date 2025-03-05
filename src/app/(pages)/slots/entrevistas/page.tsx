"use client";

import { SlotsType } from "../types";
import SlotsTable from "../slots-table";

export default function SlotsEntrevistasPage() {
  return <SlotsTable slotsType={SlotsType.entrevistas} />;
}
