import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover.tsx";
import {Button} from "../ui/button.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command.tsx";
import {cn} from "../../lib/utils.ts";


type Props = {
    listOfValue: {
        name: string,
        _id: string,
        hexCode: string
    }[],
    selectedName: {name:string, _id:string},
    setName: (val:  {name:string, _id:string}) => void,
    optionName: string
}

export function CustomCombobox({ listOfValue, selectedName, setName, optionName }: Props) {
    const [open, setOpen] = React.useState(false)



    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selectedName.name
                        ? listOfValue.find((value) => value.name === selectedName.name)?.name
                        : `Select ${optionName}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search..."/>
                    <CommandList>
                        <CommandEmpty>No options available.</CommandEmpty>
                        <CommandGroup>
                            {listOfValue.map((value) => (
                                <CommandItem
                                    key={value._id}
                                    value={value.name}
                                    onSelect={(currentValue) => {

                                        setName(currentValue === selectedName.name ? {name:"", _id:""}: value)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        key={value._id}
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedName.name === value.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {value.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default CustomCombobox
