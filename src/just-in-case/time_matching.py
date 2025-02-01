"""
CÓDIGO DEPRECADO

FOI USADA IA PARA CONVERTER ESTE ARQUIVO PARA TYPESCRIPT, O CÓDIGO CONVERTIDO ESTÁ EM src/app/time_matching.ts
ESTE ARQUIVO ESTÁ AQUI APENAS PARA FINS DE REFERÊNCIA
"""

import json
from random import randint

class Candidate:
    def __init__(self, name, gender, availability):
        self.name = name
        self.gender = gender
        self.availability = availability
        self.assigned = False
        self.possible_slots = 0
        for day in availability:
            for time in availability[day]:
                self.possible_slots += 1 if availability[day][time] else 0
        
    def is_f_or_nb(self):
        return True if self.gender == "F" or self.gender == "NB" else False
                

class Interviewer:
    def __init__(self, name, gender, availability):
        self.name = name
        self.gender = gender
        self.availability = availability
        self.possible_slots = 0
        for day in availability:
            for time in day:
                self.possible_slots += 1
        self.slots = []
    
    def is_f_or_nb(self):
        return True if self.gender == "F" or self.gender == "NB" else False

    def has_slot_at(self, date, time):
        for slot in self.slots:
            if slot.date == date and slot.time == time:
                return True
        return False

class Slot:
    def __init__(self, date, time, place):
        self.interviewers = []
        self.candidates = []
        self.date = date
        self.time = time
        self.place = place

def get_info_from_json(file):
    with open(file, 'r') as file:
        db = json.load(file)
    
    # Candidates and interviewer lists ordered by number of possible slots
    candidates = []
    for person in db["Candidates"]:
        candidates.append(Candidate(person["Name"], person["Gender"], person["Availability"]))
    candidates.sort(key=lambda candidate: candidate.possible_slots)
    
    interviewers = []
    for person in db["Interviewers"]:
        interviewers.append(Interviewer(person["Name"], person["Gender"], person["Availability"]))
    interviewers.sort(key=lambda interviewer: interviewer.possible_slots)

    available_slots = []
    for day in db["AvailableSlots"]["datetimes"]:
        for time in db["AvailableSlots"]["datetimes"][day]:
            for place in db["AvailableSlots"]["places"]:
                available_slots.append(Slot(day, time, place))
    
    max_num_cand_per_slot = db["MaxNumCandPerSlot"]
    min_num_cand_per_slot = db["MinNumCandPerSlot"]
    num_int_per_slot = db["NumIntPerSlot"]
    
    return candidates, interviewers, available_slots, max_num_cand_per_slot, min_num_cand_per_slot, num_int_per_slot
    
def print_assignments(available_slots):
    for s in available_slots:
        if s.candidates != []:
            print(f"Candidates on slot {s.date} at {s.time} in {s.place}: {str([c.name for c in s.candidates])}")
            print(f"with interviewer(s): {str([i.name for i in s.interviewers])}")
    # for s in available_slots:
    #     if s.candidates == []:
    #         print(f"No candidates on slot {s.date} at {s.time} in {s.place}")
    print("")

def write_results_to_txt(available_slots):
    with open("results_py.txt", "w") as file:
        for s in available_slots:
            if s.candidates != []:
                file.write(f"{len(s.candidates)} candidate(s) on slot {s.date} at {s.time} in {s.place}: {str([c.name for c in s.candidates])}\n")
                file.write(f"with interviewer(s): {str([i.name for i in s.interviewers])}\n")
        file.close()

def info(interviewers, available_slots):
    with open("info_py.txt", "w") as file:
        for i in interviewers:
            file.write(f"{i.name} has {len(i.slots)} interviews at {str([s.date + ' ' + s.time for s in i.slots])}\n")
        file.write("\n")
        for s in available_slots:    
            file.write(f"Slot {s.date} at {s.time} in {s.place} has {len(s.candidates)} candidates and {len(s.interviewers)} interviewers\n")
            
def greedy_matching(candidates, max_num_cand_per_slot, min_num_cand_per_slot, interviewers, num_int_per_slot, available_slots):
    '''Matching using a greedy choice: assign each candidate starting with the one with the least possible slots to the first available slot'''
    
    def greedy_matching_method_one(slots_with_one_person):
        '''Groups lone people together'''
        for s in available_slots:
            for slot_one in slots_with_one_person:
                for slot_two in slots_with_one_person:
                    if (
                        slot_one != slot_two
                        and s != slot_one
                        and s != slot_two
                        and slots_with_one_person[slot_one] 
                        and slots_with_one_person[slot_two]
                        and slot_one.candidates[0].availability[s.date][s.time] 
                        and slot_two.candidates[0].availability[s.date][s.time]
                        and len(s.candidates) <= max_num_cand_per_slot - 2
                        ):
                        # print(f"Swapping {slot_one.candidates[0].name} and {slot_two.candidates[0].name} from {slot_one.date} at {slot_one.time} and {slot_two.date} at {slot_two.time} to {s.date} at {s.time}")
                        s.candidates.append(slot_one.candidates[0])
                        s.candidates.append(slot_two.candidates[0])
                        slot_one.candidates = []
                        slot_two.candidates = []
                        slots_with_one_person[slot_one] = False
                        slots_with_one_person[slot_two] = False
                        break
    
    def greedy_matching_method_two(slots_with_one_person, slots_with_more_than_two_people):
        '''Groups lone people with an already assigned candidate on their slot'''
        for swop in slots_with_one_person:
            for s in slots_with_more_than_two_people:
                for candidate in s.candidates:
                    if (
                      slots_with_one_person[swop] 
                      and candidate.availability[swop.date][swop.time]
                      ):
                        # print(f"Swapping {swop.candidates[0].name} from {swop.date} at {swop.time} and {candidate.name} from {s.date} at {s.time}")
                        swop.candidates.append(candidate)
                        s.candidates.remove(candidate)
                        slots_with_one_person[swop] = False
                        break
                    
    def greedy_matching_method_three(slots_with_one_person, slots_with_more_than_two_people):
        '''Groups lone people with an already assigned candidate on a new slot'''
        for swop in slots_with_one_person:
            person = swop.candidates[0]
            for s in slots_with_more_than_two_people:
                for candidate in s.candidates:
                    for possible_slot in available_slots:
                        if (
                          possible_slot != s
                          and possible_slot != swop
                          and len(possible_slot.candidates) <= max_num_cand_per_slot - 2
                          and slots_with_one_person[swop]
                          and person.availability[possible_slot.date][possible_slot.time]
                          and candidate.availability[possible_slot.date][possible_slot.time]
                          ):
                            # print(f"Swapping {person.name} from {swop.date} at {swop.time} and {candidate.name} from {s.date} at {s.time} to {possible_slot.date} at {possible_slot.time}")
                            possible_slot.candidates.append(person)
                            possible_slot.candidates.append(candidate)
                            s.candidates.remove(candidate)
                            swop.candidates = []
                            slots_with_one_person[swop] = False
                            break
    
    def update_swops(slots_with_one_person):
        '''Updating the "slots with one person" dictionary'''
        _ = {}
        for s in slots_with_one_person:
            if slots_with_one_person[s]:
                _[s] = True
        slots_with_one_person = _
        return slots_with_one_person
    
    def methods_helper():
        slots_with_one_person = {}
        slots_with_more_than_two_people = []
        for s in available_slots:
            if len(s.candidates) == 1:
                slots_with_one_person[s] = True
            elif len(s.candidates) > 2:
                slots_with_more_than_two_people.append(s)
        return slots_with_one_person, slots_with_more_than_two_people

    def reassignment_if_needed():
        '''Reassigns F or NB candidates if they are alone in a multiple-people slot'''
        if max_num_cand_per_slot > 1:
            slots_with_one_person, slots_with_more_than_two_people = methods_helper()
            while len(slots_with_one_person) > 0:
                greedy_matching_method_one(slots_with_one_person)
                slots_with_one_person = update_swops(slots_with_one_person)
                greedy_matching_method_two(slots_with_one_person, slots_with_more_than_two_people)
                slots_with_one_person = update_swops(slots_with_one_person)
                greedy_matching_method_three(slots_with_one_person, slots_with_more_than_two_people)
                slots_with_one_person = update_swops(slots_with_one_person)
    
    def transfer_to_new_random_slot(candidate, slot, slots_with_people):
        '''Transfers a candidate to a new random slot'''
        while True:
            new_slot = available_slots[randint(0, len(available_slots) - 1)]
            if new_slot != slot and len(new_slot.candidates) <= max_num_cand_per_slot - 1 and candidate.availability[new_slot.date][new_slot.time]:
                new_slot.candidates.append(candidate)
                slots_with_people[new_slot] = True
                break                
    
    # Female and non-binary candidate assignment
    for c in candidates:
        for s in available_slots:
            if len(s.candidates) < max_num_cand_per_slot and c.availability[s.date][s.time] and c.is_f_or_nb() and c.assigned == False:
                s.candidates.append(c)
                c.assigned = True
                break
    
    reassignment_if_needed()
    
    slots_with_people = {}
    for s in available_slots:
        if len(s.candidates) > 0:
            slots_with_people[s] = True
        else:
            slots_with_people[s] = False
    
    # Female and non-binary interviewer assignment - at least one for every slot with candidates
    while any(slots_with_people.values()):
        for s in slots_with_people:
            for i in interviewers:
                if i.is_f_or_nb() and i.availability[s.date][s.time] and not i.has_slot_at(s.date, s.time) and slots_with_people[s]:
                    s.interviewers.append(i)
                    i.slots.append(s)
                    slots_with_people[s] = False
            if s.interviewers == []:
                for c in s.candidates:
                    transfer_to_new_random_slot(c, s, slots_with_people)
                s.candidates = []
                slots_with_people[s] = False
                reassignment_if_needed()
    
    # Male candidate assignment
    for c in candidates:
        for s in available_slots:
            if len(s.candidates) < max_num_cand_per_slot and c.availability[s.date][s.time] and not c.is_f_or_nb() and c.assigned == False:
                s.candidates.append(c)
                c.assigned = True
                break
    
    # Evening out the male candidates on the slots with few people in case of multiple-people slots
    if max_num_cand_per_slot > 1:
        slots_with_few_people = [] # but not zero
        for s in available_slots:
            if len(s.candidates) < min_num_cand_per_slot and len(s.candidates) > 0:
                slots_with_few_people.append(s)
                
        for swfp in slots_with_few_people:
            for s in available_slots:
                for c in s.candidates:
                    if (
                    s != swfp 
                      and len(swfp.candidates) < max_num_cand_per_slot
                      and len(s.candidates) > min_num_cand_per_slot
                      and c.availability[swfp.date][swfp.time] 
                      and not c.is_f_or_nb()
                    ):
                        swfp.candidates.append(c)
                        s.candidates.remove(c)
                        break
    
    # Assigning interviewers to the remaining slots
    remaining_slots = {}
    for s in available_slots:
        if len(s.interviewers) < num_int_per_slot and len(s.candidates) > 0:
            remaining_slots[s] = True
    
    while any(remaining_slots.values()):
        for i in interviewers:
            for s in remaining_slots:
                if len(s.interviewers) < num_int_per_slot and i.availability[s.date][s.time] and not i.has_slot_at(s.date, s.time):
                    s.interviewers.append(i)
                    i.slots.append(s)
                    if len(s.interviewers) == num_int_per_slot:
                        remaining_slots[s] = False
                    break
    
def main():
    candidates, interviewers, available_slots, max_num_cand_per_slot, min_num_cand_per_slot, num_int_per_slot = get_info_from_json("backend/tests_2.json")
    greedy_matching(candidates, max_num_cand_per_slot, min_num_cand_per_slot, interviewers, num_int_per_slot, available_slots)
    write_results_to_txt(available_slots)   
    info(interviewers, available_slots)   

if __name__ == "__main__":
    main()