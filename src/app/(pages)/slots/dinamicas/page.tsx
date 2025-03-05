"use client";

import { SlotsType } from "../types";
import SlotsTable from "../slots-table";

export default function SlotsDinamicasPage() {
  return <SlotsTable slotsType={SlotsType.dinamicas} />;
}
