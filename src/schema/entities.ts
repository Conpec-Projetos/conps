enum Role {
    candidate = "candidate",
    interviewer = "interviewer",
    admin = "admin"
}

interface User {
    name: string;
    gender: string;
    availability?: { [key: string]: string[] };
    possible_slots?: number;
    role: Role;
}
        
interface Slot {
    interviewers: string[];
    candidates: string[];
    date: string;
    time: string;
}

export { User, Slot, Role };