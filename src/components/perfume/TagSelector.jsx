import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function TagSelector({ selectedTags = [], onChange, availableTags = [] }) {
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const toggleTag = (tag) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onChange(updated);
  };

  const addNewTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      onChange([...selectedTags, newTag.trim()]);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const removeTag = (tag) => {
    onChange(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-zinc-950 rounded-lg border border-zinc-800">
        {selectedTags.length === 0 ? (
          <span className="text-sm text-zinc-500 py-1">No tags selected</span>
        ) : (
          selectedTags.map((tag) => (
            <Badge
              key={tag}
              className="bg-amber-700 text-amber-50 border-amber-600 pl-2 pr-1 py-1"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1.5 hover:text-amber-300"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Available Tags */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Available Tags</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingTag(!isAddingTag)}
            className="text-xs text-amber-500 hover:text-amber-400"
          >
            <Plus className="w-3 h-3 mr-1" />
            New Tag
          </Button>
        </div>

        {/* Add New Tag Input */}
        {isAddingTag && (
          <div className="flex gap-2">
            <Input
              placeholder="Tag name..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
              className="bg-zinc-900 border-zinc-800 text-amber-50 flex-1"
              autoFocus
            />
            <Button
              onClick={addNewTag}
              size="sm"
              className="bg-amber-700 hover:bg-amber-600"
            >
              Add
            </Button>
          </div>
        )}

        {/* Tag Pills */}
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {availableTags
            .filter(tag => !selectedTags.includes(tag))
            .map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer border-zinc-700 text-zinc-300 hover:border-amber-700 hover:text-amber-400 bg-zinc-800/50 transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
}