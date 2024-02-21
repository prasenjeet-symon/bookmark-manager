import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ModelStoreStatus, UserTab } from "@/datasource/schema";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownTabComponentController } from "./DropdownTabComponent.controller";
import "./DropdownTabComponent.css";

export default function DropdownTabComponent({ tabSelected }: { tabSelected: (tab: UserTab | null) => void }) {
  const [tabs, setTabs] = useState<UserTab[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState("");

  useEffect(() => {
    const subscription = new DropdownTabComponentController().getTabs()?.subscribe((tabs) => {
      setTabs(tabs.data);
      // Initial value is the first tab
      setValue(tabs.data[0]?.identifier);
      tabSelected(tabs.data[0] || null);
      setIsLoading(tabs.status === ModelStoreStatus.READY ? false : true);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between mb-6">
          {value ? tabs.find((tab) => tab.identifier === value)?.name : "Select tab..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-[450px] p-0">
        <Command>
          <CommandGroup className="w-full">
            {tabs.map((tab) => (
              <CommandItem
                className="w-full"
                key={tab.identifier}
                value={tab.identifier}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  const targetTab = currentValue === value ? null : tabs.find((tab) => tab.identifier === currentValue);
                  tabSelected(targetTab || null);
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", value === tab.identifier ? "opacity-100" : "opacity-0")} />
                {tab.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
