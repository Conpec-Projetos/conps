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
            className={`justify-between ${!selectedValue && "text-muted-foreground"}`}
          >
            {selectedValue
              ? options.find((option) => option.value === selectedValue)?.label
              : "Selecione uma opção"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Procure por ${label}`} className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => setValue(name, option.value)}
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
