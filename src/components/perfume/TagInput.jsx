import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function TagInput({ selectedTags = [], onChange, availableTags = [] }) {
  const [open, setOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
    setOpen(false);
  };

  const handleTagRemove = (tagToRemove) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleCreateNewTag = () => {
    if (newTagInput.trim() && !selectedTags.includes(newTagInput.trim())) {
      onChange([...selectedTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag));

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge 
              key={tag}
              className="bg-amber-500/20 text-amber-300 border-amber-500/30 pr-1 pl-3 py-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="ml-2 hover:bg-amber-500/30 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add Tag Controls */}
      <div className="flex gap-2">
        {/* Select Existing Tag */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 bg-slate-800 border-slate-700" align="start">
            <Command className="bg-slate-800">
              <CommandInput 
                placeholder="Search tags..." 
                className="border-slate-700"
              />
              <CommandEmpty className="text-slate-400 py-4 text-sm text-center">
                No tags found
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {unselectedTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => handleTagSelect(tag)}
                    className="text-slate-300 cursor-pointer"
                  >
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Create New Tag */}
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Or create new tag..."
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateNewTag();
              }
            }}
            className="bg-slate-800 border-slate-700 text-white"
          />
          <Button
            type="button"
            onClick={handleCreateNewTag}
            disabled={!newTagInput.trim()}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}