import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
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
import {
  genders,
  races,
  states,
  lgbtOptions,
  EnrollFormSchema,
  courses,
} from "@/constants/form";
import React from "react";

type FormsEnrollProps = {
  onSubmit: (data: z.infer<typeof EnrollFormSchema>) => void;
};

export const FormsEnroll: React.FC<FormsEnrollProps> = ({ onSubmit }) => {
  const form = useForm<z.infer<typeof EnrollFormSchema>>({
    resolver: zodResolver(EnrollFormSchema),
  });

  useEffect(() => {
    console.log(form.getValues());
  }, [form.formState, form]);

  return (
    <Form {...form}>
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
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        let formattedValue = rawValue;
            
                        if (rawValue.length > 0) {
                          formattedValue = `(${rawValue.slice(0, 2)}`;
                        }
                        if (rawValue.length > 2) {
                          formattedValue += `) ${rawValue.slice(2, 7)}`;
                        }
                        if (rawValue.length > 7) {
                          formattedValue += `-${rawValue.slice(7, 11)}`;
                        }
            
                        field.onChange(formattedValue);
                      }}
                      value={field.value}
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6 sm:col-span-6 md:col-span-3 xl:col-span-3 flex-col md:flex-row justify-around gap-2 flex md:justify-between">
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
          <div className="col-span-6 sm:col-span-6 md:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3 flex-col md:flex-row justify-around gap-2 flex md:justify-between">
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

        <div className="grid grid-cols-6 flex-col md:flex-row justify-around gap-2 md:justify-between">
          <div className="col-span-6 md:col-span-3">
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
          </div>
          <div className="col-span-6 md:col-span-3">
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
          <Button
            type="submit"
            className="bg-orange-conpec text-white px-[20%]"
          >
            Próximo
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormsEnroll;
