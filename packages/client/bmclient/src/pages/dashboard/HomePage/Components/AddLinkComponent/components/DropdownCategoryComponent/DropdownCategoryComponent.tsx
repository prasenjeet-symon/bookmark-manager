import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ModelStoreStatus, TabCategory, UserTab } from "@/datasource/schema";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownCategoryComponentController } from "./DropdownCategoryComponent.controller";
import "./DropdownCategoryComponent.css";

export default function DropdownCategoryComponent({ tab, selectedCategory }: { tab: UserTab, selectedCategory: (category: TabCategory | null) => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<TabCategory[]>([]);

  useEffect(() => {
    const subscription = new DropdownCategoryComponentController().getCategories(tab.identifier).subscribe((categories) => {
      setCategories(categories.data);
      // Set initial value to first category
      setValue(categories.data[0]?.identifier || "");
      selectedCategory(categories.data[0] || null);

      setIsLoading(categories.status === ModelStoreStatus.READY ? false : true);
    });

    return () => subscription?.unsubscribe();
  }, [tab]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between mb-6">
          {value ? categories.find((category) => category.identifier === value)?.name : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-[450px] p-0">
        <Command>
          <CommandGroup className="w-full">
            {categories.map((category) => (
              <CommandItem
                className="w-full"
                key={category.identifier}
                value={category.identifier}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  const targetCategory = currentValue === value ? null : categories.find((category) => category.identifier === currentValue);
                  selectedCategory(targetCategory || null);
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", value === category.identifier ? "opacity-100" : "opacity-0")} />
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
