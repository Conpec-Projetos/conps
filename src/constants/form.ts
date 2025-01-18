import { z } from "zod";

const EnrollFormSchema = z.object({
  name: z
    .string({ message: "Nome é obrigatório" })
    .nonempty({ message: "Nome é obrigatório" }),
  email: z
    .string({ message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  cellphone: z
    .string({ message: "Celular é obrigatório" })
    .min(9, { message: "Celular inválido" })
    .max(12, { message: "Celular inválido" })
    .nonempty({ message: "Celular é obrigatório" }),
  course: z
    .string({ message: "Selecionar um curso é obrigatório" })
    .nonempty({ message: "Selecionar um curso é obrigatório" }),
  yearOfAdmission: z
    .number()
    .int()
    .min(1969, { message: "Você entrou antes do curso existir?" })
    .max(2025, { message: "Ano inválido" }),
  state: z
    .string({ message: "Estado é obrigatório" })
    .nonempty({ message: "Estado é obrigatório" }),
  age: z.number().int({ message: "Idade inválida" }),
  gender: z
    .string({ message: "Gênero é obrigatório" })
    .nonempty({ message: "Gênero é obrigatório" }),
  raceOrEthnicity: z
    .string({ message: "Campo obrigatório" })
    .nonempty({ message: "Campo obrigatório" }),
  isLGBTQIAP: z
    .string({ message: "Campo obrigatório" })
    .nonempty({ message: "Campo obrigatório" }),
  accessibilitySuggestions: z.string().optional(),
  whereDidYouHearAboutUs: z
    .string({ message: "Campo obrigatório" })
    .nonempty({ message: "Campo obrigatório" }),
  anyComments: z.string().optional(),
});

const courses = [
  { label: "Ciência da Computação", value: "CC" },
  { label: "Engenharia de Computação", value: "EC" },
  { label: "Outro", value: "OUTRO" },
];

const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
const genders = ["Masculino", "Feminino", "Não-binário", "Outro"];
const races = ["Branca", "Preta", "Parda", "Amarela", "Indígena"];
const lgbtOptions = ["Sim", "Não", "Prefiro não responder"];

export {
    EnrollFormSchema,
    courses,
    states,
    genders,
    races,
    lgbtOptions,
};