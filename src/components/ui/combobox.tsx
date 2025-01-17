import { FC } from "react";
import { Button } from "@components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormMessage } from "@components/ui/form";

interface ComboboxProps {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  size?: "sm" | "lg" | "default" | "icon" | "full";
  selectedValue: string;
  setValue: (name: string, value: string) => void;
  error?: string;
}

const Combobox: FC<ComboboxProps> = ({ label, name, options, size, selectedValue, setValue, error }) => (
  <div>
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            size={size}
            className={`border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300 justify-between ${
              !selectedValue && ""
            }`}
          >
            {selectedValue
              ? options.find((option) => option.value === selectedValue)?.label
              : "Selecione uma opção"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 border-2 border-orange-conpec focus-visible:ring-2 focus-visible:ring-orange-conpec transition-all duration-300">
        <Command>
          <CommandInput placeholder={`Procure por ${label}`} className="h-9 w-auto placeholder:text-orange-conpec" />
          <CommandList>
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => setValue(name, option.value)}
                  className="hover:cursor-pointer"
                >
                  {option.label}
                  <Check
                    className={`ml-auto ${option.value === selectedValue ? "opacity-100" : "opacity-0"}`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    {error && <FormMessage>{error}</FormMessage>}
  </div>
);

export default Combobox;
