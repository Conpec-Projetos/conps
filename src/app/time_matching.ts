import { db } from "./../firebase/firebase-config";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { Phase } from "./../constants/utils";

type Availability = { [day: string]: { [time: string]: boolean } };

class Candidate {
  name: string;
  gender: string;
  availability: Availability;
  assigned: boolean;
  possibleSlots: number;

  constructor(name: string, gender: string, availability: Availability) {
    this.name = name;
    this.gender = gender;
    this.availability = availability;
    this.assigned = false;
    this.possibleSlots = 0;

    for (const day in availability) {
      for (const time in availability[day]) {
        if (availability[day][time]) {
          this.possibleSlots++;
        }
      }
    }
  }

  isFOrNB(): boolean {
    return this.gender === "F" || this.gender === "NB";
  }
}

class Interviewer {
  name: string;
  gender: string;
  availability: Availability;
  possibleSlots: number;
  slots: Slot[];

  constructor(name: string, gender: string, availability: Availability) {
    this.name = name;
    this.gender = gender;
    this.availability = availability;
    this.possibleSlots = 0;
    this.slots = [];

    for (const day in availability) {
      for (const time in availability[day]) {
        if (availability[day][time]) {
          this.possibleSlots++;
        }
      }
    }
  }

  isFOrNB(): boolean {
    return this.gender === "F" || this.gender === "NB";
  }

  hasSlotAt(date: string, time: string): boolean {
    return this.slots.some((slot) => slot.date === date && slot.time === time);
  }
}

class Slot {
  interviewers: Interviewer[];
  candidates: Candidate[];
  date: string;
  time: string;
  place: string;

  constructor(date: string, time: string, place: string) {
    this.interviewers = [];
    this.candidates = [];
    this.date = date;
    this.time = time;
    this.place = place;
  }
}

async function saveSlotsToDB(slots: Slot[], phase: Phase) {
  try {
    // Save the previous matchings to "previous_matchings" collection
    const latestMatchingRef =
      phase === Phase.Dinamicas
        ? collection(db, "latest_matching_1")
        : collection(db, "latest_matching_2");
    const previousMatchingRef = collection(db, "previous_matchings");
    const latestSnapshot = await getDocs(latestMatchingRef);

    if (!latestSnapshot.empty) {
      const timestamp = latestSnapshot.docs[0].data().timestamp;
      const previousSlots = latestSnapshot.docs[0].data().slots;

      await setDoc(doc(previousMatchingRef, timestamp), {
        slots: previousSlots,
      });

      for (const doc of latestSnapshot.docs) {
        await deleteDoc(doc.ref);
      }
    }

    // Save the latest matchings to "latest_matching" collection
    const slotsData = slots.map((slot) => ({
      date: slot.date,
      time: slot.time,
      place: slot.place,
      interviewers: slot.interviewers.map((interviewer) => interviewer.name),
      candidates: slot.candidates.map((candidate) => candidate.name),
    }));

    const newTimestamp = new Date().toISOString();
    await addDoc(latestMatchingRef, {
      slots: slotsData,
      timestamp: newTimestamp,
    });
  } catch (error) {
    console.error("Error saving slots to Firestore: ", error);
  }
}

async function getInfo(
  phase: Phase
): Promise<[Candidate[], Interviewer[], Slot[], number, number, number]> {
  const data =
    phase === Phase.Dinamicas
      ? await getDocs(collection(db, "tests_1"))
      : await getDocs(collection(db, "tests_2"));
  const info = data.docs[0].data();

  const candidates: Candidate[] = info.Candidates.map(
    (person: any) =>
      new Candidate(person.Name, person.Gender, person.Availability)
  );
  candidates.sort((a, b) => a.possibleSlots - b.possibleSlots);

  const interviewers: Interviewer[] = info.Interviewers.map(
    (person: any) =>
      new Interviewer(person.Name, person.Gender, person.Availability)
  );
  interviewers.sort((a, b) => a.possibleSlots - b.possibleSlots);

  const availableSlots: Slot[] = [];
  for (const day in info.AvailableSlots.datetimes) {
    const times =
      info.AvailableSlots.datetimes[
        day as keyof typeof info.AvailableSlots.datetimes
      ];
    for (const time of times) {
      for (const place of info.AvailableSlots.places) {
        availableSlots.push(new Slot(day, time, place));
      }
    }
  }

  const maxNumCandPerSlot: number = info.MaxNumCandPerSlot;
  const minNumCandPerSlot: number = info.MinNumCandPerSlot;
  const numIntPerSlot: number = info.NumIntPerSlot;

  return [
    candidates,
    interviewers,
    availableSlots,
    maxNumCandPerSlot,
    minNumCandPerSlot,
    numIntPerSlot,
  ];
}

// function printAssignments(availableSlots: Slot[]): void {
//     availableSlots.forEach(slot => {
//         if (slot.candidates.length > 0) {
//             console.log(`Candidates on slot ${slot.date} at ${slot.time} in ${slot.place}: ${slot.candidates.map(c => c.name)}`);
//             console.log(`with interviewer(s): ${slot.interviewers.map(i => i.name)}`);
//         }
//     });
// }

// function writeResultsToTxt(availableSlots: Slot[]): void {
//     const result = availableSlots
//         .filter(slot => slot.candidates.length > 0)
//         .map(slot => `${slot.candidates.length} candidate(s) on slot ${slot.date} at ${slot.time} in ${slot.place}: ${slot.candidates.map(c => c.name).join(", ")}\nwith interviewer(s): ${slot.interviewers.map(i => i.name).join(", ")}`)
//         .join("\n");

//     fs.writeFileSync("results.txt", result);
// }

// function info(interviewers: Interviewer[], availableSlots: Slot[]): void {
//     const interviewerInfo = interviewers.map(i =>
//         `${i.name} has ${i.slots.length} interviews at ${i.slots.map(s => `${s.date} ${s.time}`).join(", ")}`
//     ).join("\n");

//     const slotInfo = availableSlots.map(s =>
//         `Slot ${s.date} at ${s.time} in ${s.place} has ${s.candidates.length} candidates and ${s.interviewers.length} interviewers`
//     ).join("\n");

//     fs.writeFileSync("info.txt", `${interviewerInfo}\n\n${slotInfo}`);
// }

function greedyMatching(
  candidates: Candidate[],
  maxNumCandPerSlot: number,
  minNumCandPerSlot: number,
  interviewers: Interviewer[],
  numIntPerSlot: number,
  availableSlots: Slot[]
): void {
  // Helper functions
  const greedyMatchingMethodOne = (slotsWithOnePerson: Map<Slot, boolean>) => {
    for (const slot of availableSlots) {
      for (const [slotOne, isSlotOneValid] of slotsWithOnePerson) {
        for (const [slotTwo, isSlotTwoValid] of slotsWithOnePerson) {
          if (
            slotOne !== slotTwo &&
            slot !== slotOne &&
            slot !== slotTwo &&
            isSlotOneValid &&
            isSlotTwoValid &&
            slotOne.candidates[0].availability[slot.date]?.[slot.time] &&
            slotTwo.candidates[0].availability[slot.date]?.[slot.time] &&
            slot.candidates.length <= maxNumCandPerSlot - 2
          ) {
            slot.candidates.push(slotOne.candidates[0]);
            slot.candidates.push(slotTwo.candidates[0]);
            slotOne.candidates = [];
            slotTwo.candidates = [];
            slotsWithOnePerson.set(slotOne, false);
            slotsWithOnePerson.set(slotTwo, false);
            break;
          }
        }
      }
    }
  };

  const greedyMatchingMethodTwo = (
    slotsWithOnePerson: Map<Slot, boolean>,
    slotsWithMoreThanTwoPeople: Slot[]
  ) => {
    for (const [swop, isSwopValid] of slotsWithOnePerson) {
      for (const s of slotsWithMoreThanTwoPeople) {
        for (const candidate of s.candidates) {
          if (isSwopValid && candidate.availability[swop.date]?.[swop.time]) {
            swop.candidates.push(candidate);
            s.candidates = s.candidates.filter((c) => c !== candidate);
            slotsWithOnePerson.set(swop, false);
            break;
          }
        }
      }
    }
  };

  const greedyMatchingMethodThree = (
    slotsWithOnePerson: Map<Slot, boolean>,
    slotsWithMoreThanTwoPeople: Slot[]
  ) => {
    for (const [swop, isSwopValid] of slotsWithOnePerson) {
      const person = swop.candidates[0];
      for (const s of slotsWithMoreThanTwoPeople) {
        for (const candidate of s.candidates) {
          for (const possibleSlot of availableSlots) {
            if (
              possibleSlot !== s &&
              possibleSlot !== swop &&
              possibleSlot.candidates.length <= maxNumCandPerSlot - 2 &&
              isSwopValid &&
              person.availability[possibleSlot.date]?.[possibleSlot.time] &&
              candidate.availability[possibleSlot.date]?.[possibleSlot.time]
            ) {
              possibleSlot.candidates.push(person);
              possibleSlot.candidates.push(candidate);
              s.candidates = s.candidates.filter((c) => c !== candidate);
              swop.candidates = [];
              slotsWithOnePerson.set(swop, false);
              break;
            }
          }
        }
      }
    }
  };

  const updateSwops = (
    slotsWithOnePerson: Map<Slot, boolean>
  ): Map<Slot, boolean> => {
    const updatedSlots = new Map<Slot, boolean>();
    for (const [slot, isValid] of slotsWithOnePerson) {
      if (isValid) {
        updatedSlots.set(slot, true);
      }
    }
    return updatedSlots;
  };

  const methodsHelper = (): [Map<Slot, boolean>, Slot[]] => {
    const slotsWithOnePerson = new Map<Slot, boolean>();
    const slotsWithMoreThanTwoPeople: Slot[] = [];

    for (const slot of availableSlots) {
      if (slot.candidates.length === 1) {
        slotsWithOnePerson.set(slot, true);
      } else if (slot.candidates.length > 2) {
        slotsWithMoreThanTwoPeople.push(slot);
      }
    }

    return [slotsWithOnePerson, slotsWithMoreThanTwoPeople];
  };

  const reassignmentIfNeeded = () => {
    if (maxNumCandPerSlot > 1) {
      let [slotsWithOnePerson, slotsWithMoreThanTwoPeople] = methodsHelper();
      while (slotsWithOnePerson.size > 0) {
        greedyMatchingMethodOne(slotsWithOnePerson);
        slotsWithOnePerson = updateSwops(slotsWithOnePerson);
        greedyMatchingMethodTwo(slotsWithOnePerson, slotsWithMoreThanTwoPeople);
        slotsWithOnePerson = updateSwops(slotsWithOnePerson);
        greedyMatchingMethodThree(
          slotsWithOnePerson,
          slotsWithMoreThanTwoPeople
        );
        slotsWithOnePerson = updateSwops(slotsWithOnePerson);
      }
    }
  };

  const transferToNewRandomSlot = (
    candidate: Candidate,
    slot: Slot,
    slotsWithPeople: Map<Slot, boolean>
  ) => {
    while (true) {
      const randomSlot =
        availableSlots[Math.floor(Math.random() * availableSlots.length)];
      if (
        randomSlot !== slot &&
        randomSlot.candidates.length <= maxNumCandPerSlot - 1 &&
        candidate.availability[randomSlot.date]?.[randomSlot.time]
      ) {
        randomSlot.candidates.push(candidate);
        slotsWithPeople.set(randomSlot, true);
        break;
      }
    }
  };

  // Assign female and non-binary candidates
  for (const candidate of candidates) {
    if (candidate.isFOrNB() && !candidate.assigned) {
      for (const slot of availableSlots) {
        if (
          slot.candidates.length < maxNumCandPerSlot &&
          candidate.availability[slot.date]?.[slot.time]
        ) {
          slot.candidates.push(candidate);
          candidate.assigned = true;
          break;
        }
      }
    }
  }

  reassignmentIfNeeded();

  const slotsWithPeople = new Map<Slot, boolean>();
  for (const slot of availableSlots) {
    slotsWithPeople.set(slot, slot.candidates.length > 0);
  }

  // Assign female and non-binary interviewers
  while (Array.from(slotsWithPeople.values()).some((value) => value)) {
    for (const [slot, hasPeople] of slotsWithPeople) {
      for (const interviewer of interviewers) {
        if (
          interviewer.isFOrNB() &&
          interviewer.availability[slot.date]?.[slot.time] &&
          !interviewer.hasSlotAt(slot.date, slot.time) &&
          hasPeople
        ) {
          slot.interviewers.push(interviewer);
          interviewer.slots.push(slot);
          slotsWithPeople.set(slot, false);
          break;
        }
      }

      if (slot.interviewers.length === 0) {
        for (const candidate of slot.candidates) {
          transferToNewRandomSlot(candidate, slot, slotsWithPeople);
        }
        slot.candidates = [];
        slotsWithPeople.set(slot, false);
        reassignmentIfNeeded();
      }
    }
  }

  // Assign male candidates
  for (const candidate of candidates) {
    if (!candidate.isFOrNB() && !candidate.assigned) {
      for (const slot of availableSlots) {
        if (
          slot.candidates.length < maxNumCandPerSlot &&
          candidate.availability[slot.date]?.[slot.time]
        ) {
          slot.candidates.push(candidate);
          candidate.assigned = true;
          break;
        }
      }
    }
  }

  // Balance candidates in slots with too few people
  if (maxNumCandPerSlot > 1) {
    const slotsWithFewPeople = availableSlots.filter(
      (slot) =>
        slot.candidates.length < minNumCandPerSlot && slot.candidates.length > 0
    );

    for (const swfp of slotsWithFewPeople) {
      for (const slot of availableSlots) {
        for (const candidate of slot.candidates) {
          if (
            slot !== swfp &&
            swfp.candidates.length < maxNumCandPerSlot &&
            slot.candidates.length > minNumCandPerSlot &&
            candidate.availability[swfp.date]?.[swfp.time] &&
            !candidate.isFOrNB()
          ) {
            swfp.candidates.push(candidate);
            slot.candidates = slot.candidates.filter((c) => c !== candidate);
            break;
          }
        }
      }
    }
  }

  // Assign interviewers to remaining slots
  const remainingSlots = new Map<Slot, boolean>();
  for (const slot of availableSlots) {
    if (
      slot.interviewers.length < numIntPerSlot &&
      slot.candidates.length > 0
    ) {
      remainingSlots.set(slot, true);
    }
  }

  while (Array.from(remainingSlots.values()).some((value) => value)) {
    for (const interviewer of interviewers) {
      for (const [slot, isRemaining] of remainingSlots) {
        if (
          slot.interviewers.length < numIntPerSlot &&
          interviewer.availability[slot.date]?.[slot.time] &&
          !interviewer.hasSlotAt(slot.date, slot.time)
        ) {
          slot.interviewers.push(interviewer);
          interviewer.slots.push(slot);
          if (slot.interviewers.length === numIntPerSlot) {
            remainingSlots.set(slot, false);
          }
          break;
        }
      }
    }
  }
}

async function algorithm(phase: Phase) {
  const [
    candidates,
    interviewers,
    availableSlots,
    maxNumCandPerSlot,
    minNumCandPerSlot,
    numIntPerSlot,
  ] = await getInfo(phase);
  greedyMatching(
    candidates,
    maxNumCandPerSlot,
    minNumCandPerSlot,
    interviewers,
    numIntPerSlot,
    availableSlots
  );
  saveSlotsToDB(availableSlots, phase);
  // writeResultsToTxt(availableSlots);
  // info(interviewers, availableSlots);
}

export { algorithm };
