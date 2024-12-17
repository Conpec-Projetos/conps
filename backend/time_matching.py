def find_matching_slots(candidate_availability, interviewer_availability):
    matching_slots = []
    for c_slot in candidate_availability:
        for i_slot in interviewer_availability:
            if c_slot["date"] == i_slot["date"] and c_slot["slot"] in i_slot["slots"]:
                matching_slots.append({"date": c_slot["date"], "slot": c_slot["slot"]})
    return matching_slots