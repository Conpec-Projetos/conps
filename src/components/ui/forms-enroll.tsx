"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import Combobox from "@components/ui/combobox";
import { Input } from "@components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@components/ui/form";
import { Button } from "@components/ui/button";
import { useEffect } from "react";

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

export const FormsEnroll = () => {
  const form = useForm<z.infer<typeof EnrollFormSchema>>({
    resolver: zodResolver(EnrollFormSchema),
  });

  useEffect(() => {
    console.log(form.getValues());
  }, [form.formState, form]);

  const onSubmit: SubmitHandler<z.infer<typeof EnrollFormSchema>> = (data) => {
    toast.success("Envio realizado com sucesso!");
    console.log(data);
  };

  return (
    <Form {...form}>
      <Toaster richColors closeButton />
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Validation Errors:", errors);
          toast.error("Erro ao enviar formulário");
        })}
        className="w-full mx-1 flex flex-col gap-4"
      >
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-6 sm:col-span-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-6 sm:col-span-6 md:col-span-3 xl:col-span-3">
            <FormField
              control={form.control}
              name="cellphone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Celular</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="(99) 99999-9999"
                      className="border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6 sm:col-span-6 md:col-span-3 xl:col-span-3 flex-row justify-around gap-2 flex md:justify-between">
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual o seu curso?</FormLabel>
                  <FormControl>
                    <Combobox
                      name="course"
                      label="seu curso"
                      options={courses}
                      selectedValue={field.value}
                      size="full"
                      setValue={(course: string, value) =>
                        form.setValue(
                          course as keyof z.infer<typeof EnrollFormSchema>,
                          value
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearOfAdmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano de ingresso</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-6 sm:col-span-6 md:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3 flex-row justify-around gap-2 flex md:justify-between">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual o seu estado de origem?</FormLabel>
                  <FormControl>
                    <Combobox
                      name="state"
                      label="seu estado"
                      size="full"
                      options={states.map((s) => ({ label: s, value: s }))}
                      selectedValue={field.value}
                      setValue={(state: string, value) =>
                        form.setValue(
                          state as keyof z.infer<typeof EnrollFormSchema>,
                          value
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual a sua idade?</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 sm:col-span-6 md:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual é a sua identidade de gênero?</FormLabel>
                  <FormControl>
                    <Combobox
                      name="gender"
                      label="seu gênero"
                      size="full"
                      options={genders.map((g) => ({ label: g, value: g }))}
                      selectedValue={field.value}
                      setValue={(gender: string, value) =>
                        form.setValue(
                          gender as keyof z.infer<typeof EnrollFormSchema>,
                          value
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 flex-row justify-around gap-2 md:justify-between">
          <FormField
            control={form.control}
            name="raceOrEthnicity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qual a sua raça/etnia?</FormLabel>
                <FormControl>
                  <Combobox
                    name="raceOrEthnicity"
                    label="sua raça/etnia?"
                    size="full"
                    options={races.map((r) => ({ label: r, value: r }))}
                    selectedValue={field.value}
                    setValue={(raceOrEthnicity: string, value) =>
                      form.setValue(
                        raceOrEthnicity as keyof z.infer<
                          typeof EnrollFormSchema
                        >,
                        value
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isLGBTQIAP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Você se considera parte do grupo LGBTQIAP+?
                </FormLabel>
                <FormControl>
                  <Combobox
                    name="isLGBTQIAP"
                    label="sua resposta"
                    size="full"
                    options={lgbtOptions.map((o) => ({ label: o, value: o }))}
                    selectedValue={field.value}
                    setValue={(isLGBTQIAP: string, value) =>
                      form.setValue(
                        isLGBTQIAP as keyof z.infer<typeof EnrollFormSchema>,
                        value
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="accessibilitySuggestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Há algum recurso que a Conpec poderia oferecer para tornar o
                  Processo Seletivo mais acessível para você?
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whereDidYouHearAboutUs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Qual foi o principal meio de divulgação que o levou a se
                  interessar em se inscrever no nosso PS?
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="anyComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Você tem algum comentário sobre a sua experiência durante a
                  divulgação do PS?
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center mt-6 mb-2">
          <Button type="submit" className="bg-orange-500 text-white px-[20%]">
            Próximo
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormsEnroll;
