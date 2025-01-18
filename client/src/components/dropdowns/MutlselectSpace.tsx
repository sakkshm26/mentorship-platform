"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { IoIosSearch } from "react-icons/io"

import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

interface MultiSelectProps {
    options: { label: string; value: string }[];
    selectedValues: Option[];
    setSelectedValues: (data: any) => void;
    inputClassNames?: string;
    showDropdownOnClick?: boolean;
}

type Option = Record<"value" | "label", string>;

export function MultiSelectSpace({
    options,
    selectedValues,
    setSelectedValues,
    inputClassNames,
    showDropdownOnClick = false
}: MultiSelectProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const handleUnselect = useCallback((option: Option) => {
        setSelectedValues((prev: Option[]) =>
            prev.filter((s) => s.value !== option.value)
        );
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    if (input.value === "") {
                        setSelectedValues((prev: Option[]) => {
                            const newSelected = [...prev];
                            newSelected.pop();
                            return newSelected;
                        });
                    }
                }
                if (e.key === "Escape") {
                    input.blur();
                    setShowDropdown(false);
                }
            }
        },
        []
    );

    const selectables = options.filter(
        (option) => !selectedValues.includes(option)
    );

    useEffect(() => {
        setShowDropdown(inputValue.length > 0 && selectables.length > 0);
    }, [inputValue, selectables]);

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group rounded-[8px] border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selectedValues.map((option) => {
                        return (
                            <Badge key={option.value} variant="secondary" className="font-medium bg-[#f2f2f2]">
                                {option.label}
                                <button
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(option);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(option)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        );
                    })}
                    <div className="flex items-center flex-1 gap-2">
                        {selectedValues.length === 0 && (
                            <IoIosSearch className="h-4 w-4 text-muted-foreground" />
                        )}
                        <CommandPrimitive.Input
                            ref={inputRef}
                            value={inputValue}
                            onValueChange={(value) => {
                                setInputValue(value);
                                setShowDropdown(value.length > 0);
                            }}
                            onBlur={() => {
                                if (inputValue.length === 0) {
                                    setShowDropdown(false);
                                }
                                setOpen(false);
                            }}
                            onFocus={() => setOpen(true)}
                            placeholder={selectedValues.length === 0 ? "DSA, Full Stack, AI" : ""}
                            className={`flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${inputClassNames}`}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <CommandList>
                    {(showDropdownOnClick && open && selectables.length > 0) || (showDropdown && !showDropdownOnClick) ? (
                        <div className="w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in mb-2">
                            <CommandGroup className="max-h-[180px] overflow-auto">
                                {selectables.map((option) => {
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onSelect={(value) => {
                                                setInputValue("");
                                                setSelectedValues(
                                                    (prev: Option[]) => [
                                                        ...prev,
                                                        option,
                                                    ]
                                                );
                                                setShowDropdown(false);
                                            }}
                                            className={"cursor-pointer"}
                                        >
                                            {option.label}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}