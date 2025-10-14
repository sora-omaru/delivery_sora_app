"use client";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from 'use-debounce';

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`/api/restaurant?input=${inputText}`); //APIを取得する
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!inputText.trim()) {
      ("");
      setOpen(false);
      return;
    }
    setOpen(true);
    fetchSuggestions();
  }, [inputText]);

  const handleBlur = () => {
    setOpen(false);
  };
  const handleFocus = () => {
    if (inputText) {
      setOpen(true);
    }
  };

  return (
    <Command className="overflow-visible bg-muted" shouldFilter={false}>
      <CommandInput
        placeholder="Type a command or search..."
        value={inputText}
        onValueChange={setInputText}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {open && (
        <div className="relative">
          <CommandList className="absolute bg-background w-full shadow-md">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandList>
        </div>
      )}
    </Command>
  );
}
