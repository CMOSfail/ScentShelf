import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, SlidersHorizontal, X, Filter, Star } from "lucide-react";

export default function FilterBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedTags, 
  setSelectedTags, 
  availableTags,
  availableBrands,
  sortBy,
  setSortBy,
  seasonFilter,
  setSeasonFilter,
  brandFilter,
  setBrandFilter,
  notesFilter,
  setNotesFilter,
  minLongevity,
  setMinLongevity,
  minSillage,
  setMinSillage,
  minRating,
  setMinRating
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSeasonFilter('all');
    setBrandFilter('all');
    setNotesFilter('');
    setMinLongevity(0);
    setMinSillage(0);
    setMinRating(0);
  };

  const hasActiveFilters = 
    selectedTags.length > 0 || 
    seasonFilter !== 'all' || 
    brandFilter !== 'all' ||
    notesFilter !== '' ||
    minLongevity > 0 ||
    minSillage > 0 ||
    minRating > 0;

  return (
    <div className="space-y-3">
      {/* Search & Main Controls */}
      <div className="flex gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] bg-input border-border text-foreground">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="brand">Brand A-Z</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Toggle */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="bg-card border-border text-foreground hover:bg-muted hover:text-primary hover:border-primary relative transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-card border-border text-foreground" align="end">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex items-center justify-between sticky top-0 bg-card pb-2 z-10">
                <h3 className="font-semibold text-primary">Filters</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Season Filter */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Season</label>
                <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Seasons</SelectItem>
                    <SelectItem value="Winter">Winter</SelectItem>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Brand / House</label>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border max-h-64">
                    <SelectItem value="all">All Brands</SelectItem>
                    {availableBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes Filter */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Search Notes</label>
                <Input
                  placeholder="e.g., vanilla, leather..."
                  value={notesFilter}
                  onChange={(e) => setNotesFilter(e.target.value)}
                  className="bg-muted border-border text-foreground"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Minimum Rating: {minRating > 0 ? `${minRating} ★` : 'Any'}
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 transition-all ${
                          star <= minRating
                            ? "fill-primary text-primary scale-110"
                            : "fill-muted text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Filters */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Minimum Longevity: {minLongevity > 0 ? `${minLongevity}/10` : 'Any'}
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={minLongevity}
                    onChange={(e) => setMinLongevity(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Minimum Sillage: {minSillage > 0 ? `${minSillage}/10` : 'Any'}
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={minSillage}
                    onChange={(e) => setMinSillage(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "border-border text-muted-foreground hover:border-primary bg-muted/50"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {availableTags.length === 0 && (
                    <p className="text-sm text-muted-foreground/70">No tags yet</p>
                  )}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-300">
          <Filter className="w-3 h-3 text-muted-foreground" />
          {seasonFilter !== 'all' && (
            <Badge variant="secondary" className="bg-card text-primary border-border">
              Season: {seasonFilter}
              <button
                onClick={() => setSeasonFilter('all')}
                className="ml-1.5 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {brandFilter !== 'all' && (
            <Badge variant="secondary" className="bg-card text-primary border-border">
              Brand: {brandFilter}
              <button
                onClick={() => setBrandFilter('all')}
                className="ml-1.5 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {notesFilter && (
            <Badge variant="secondary" className="bg-card text-primary border-border">
              Notes: {notesFilter}
              <button
                onClick={() => setNotesFilter('')}
                className="ml-1.5 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {minRating > 0 && (
            <Badge variant="secondary" className="bg-card text-primary border-border">
              Rating ≥ {minRating} ★
              <button
                onClick={() => setMinRating(0)}
                className="ml-1.5 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {minLongevity > 0 && (
            <Badge variant="secondary" className="bg-card text-primary border-border">
              Longevity ≥ {minLongevity}
              <button
                onClick={() => setMinLongevity(0)}
                className="ml-1.5 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {minSillage > 0 && (
            <Badge variant="secondary" className="bg-card text-primary border-border">
              Sillage ≥ {minSillage}
              <button
                onClick={() => setMinSillage(0)}
                className="ml-1.5 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-card text-primary border-border"
            >
              Tag: {tag}
              <button
                onClick={() => toggleTag(tag)}
                className="ml-1.5 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}