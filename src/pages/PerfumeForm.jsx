import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import ImageUploader from "../components/perfume/ImageUploader";
import TagSelector from "../components/perfume/TagSelector";
import RatingDisplay from "../components/perfume/RatingDisplay";
import ThemeToggle from "../components/ui/ThemeToggle";
import { toast } from "sonner";

const SEASONS = ["Winter", "Spring", "Summer", "Fall"];
const TIME_OF_DAY = ["Day", "Night", "Evening"];
const USAGE_OPTIONS = ["Office", "Date Night", "Casual", "Formal", "Sport", "Travel"];

export default function PerfumeForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const perfumeId = params.get('id');
  const isEditing = !!perfumeId;

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    concentration: '',
    image_url: '',
    year: '',
    gender_target: '',
    seasons: [],
    time_of_day: [],
    tags: [],
    notes_top: '',
    notes_heart: '',
    notes_base: '',
    longevity: 5,
    sillage: 5,
    usage: [],
    rating: 0,
    notes: '',
    fragrantica_url: '',
    official_url: '',
    bottle_size: '',
  });

  // Fetch existing perfume if editing
  const { data: perfume } = useQuery({
    queryKey: ['perfume', perfumeId],
    queryFn: async () => {
      if (!perfumeId) return null;
      const perfumes = await base44.entities.Perfume.list();
      return perfumes.find(p => p.id === perfumeId);
    },
    enabled: !!perfumeId,
  });

  // Fetch all perfumes to get available tags
  const { data: allPerfumes = [] } = useQuery({
    queryKey: ['perfumes'],
    queryFn: () => base44.entities.Perfume.list(),
  });

  const availableTags = useMemo(() => {
    const tags = new Set();
    allPerfumes.forEach(p => p.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [allPerfumes]);

  useEffect(() => {
    if (perfume) {
      setFormData({
        name: perfume.name || '',
        brand: perfume.brand || '',
        concentration: perfume.concentration || '',
        image_url: perfume.image_url || '',
        year: perfume.year || '',
        gender_target: perfume.gender_target || '',
        seasons: perfume.seasons || [],
        time_of_day: perfume.time_of_day || [],
        tags: perfume.tags || [],
        notes_top: perfume.notes_top || '',
        notes_heart: perfume.notes_heart || '',
        notes_base: perfume.notes_base || '',
        longevity: perfume.longevity || 5,
        sillage: perfume.sillage || 5,
        usage: perfume.usage || [],
        rating: perfume.rating || 0,
        notes: perfume.notes || '',
        fragrantica_url: perfume.fragrantica_url || '',
        official_url: perfume.official_url || '',
        bottle_size: perfume.bottle_size || '',
      });
    }
  }, [perfume]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (isEditing) {
        return base44.entities.Perfume.update(perfumeId, data);
      }
      return base44.entities.Perfume.create(data);
    },
    onSuccess: (savedPerfume) => {
      queryClient.invalidateQueries(['perfumes']);
      if (isEditing) {
        queryClient.invalidateQueries(['perfume', perfumeId]);
      }
      toast.success(isEditing ? 'Perfume updated successfully!' : 'Perfume added successfully!');
      navigate(createPageUrl('PerfumeDetail') + `?id=${savedPerfume.id}`);
    },
    onError: () => {
      toast.error('Failed to save perfume. Please try again.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      year: formData.year ? Number(formData.year) : null,
      bottle_size: formData.bottle_size ? Number(formData.bottle_size) : null,
    };
    saveMutation.mutate(cleanedData);
  };

  const toggleArrayItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-card/50 to-background">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to={createPageUrl('Collection')}>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to ScentShelf
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <motion.h1 
            className="text-4xl font-bold text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isEditing ? 'Edit Perfume' : 'Add New Perfume'}
          </motion.h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8" onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}>
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-primary">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-300">Name *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-input border-border text-foreground text-base"
                  placeholder="Aventus"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Brand *</Label>
                <Input
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="bg-input border-border text-foreground text-base"
                  placeholder="Creed"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Concentration</Label>
                <Select value={formData.concentration} onValueChange={(value) => setFormData(prev => ({ ...prev, concentration: value }))}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EDT">EDT</SelectItem>
                    <SelectItem value="EDP">EDP</SelectItem>
                    <SelectItem value="Parfum">Parfum</SelectItem>
                    <SelectItem value="Cologne">Cologne</SelectItem>
                    <SelectItem value="Extrait">Extrait</SelectItem>
                    <SelectItem value="Oil">Oil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Gender Target</Label>
                <Select value={formData.gender_target} onValueChange={(value) => setFormData(prev => ({ ...prev, gender_target: value }))}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculine">Masculine</SelectItem>
                    <SelectItem value="Feminine">Feminine</SelectItem>
                    <SelectItem value="Unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Year</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="bg-input border-border text-foreground text-base"
                  placeholder="2010"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Bottle Size (ml)</Label>
                <Input
                  type="number"
                  value={formData.bottle_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, bottle_size: e.target.value }))}
                  className="bg-input border-border text-foreground text-base"
                  placeholder="100"
                />
              </div>
              </div>
            </Card>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border p-6 space-y-4">
              <h2 className="text-xl font-semibold text-primary">Bottle Image</h2>
              <ImageUploader
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              />
            </Card>
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-border p-6 space-y-4">
              <h2 className="text-xl font-semibold text-primary">My Rating</h2>
              <RatingDisplay
                rating={formData.rating}
                size="lg"
                onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
              />
            </Card>
          </motion.div>

          {/* Season & Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-primary">Season & Time</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-zinc-300 mb-3 block">Seasons</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SEASONS.map(season => (
                    <div key={season} className="flex items-center space-x-2">
                      <Checkbox
                        id={`season-${season}`}
                        checked={formData.seasons.includes(season)}
                        onCheckedChange={() => toggleArrayItem('seasons', season)}
                        className="border-zinc-700 data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-700"
                      />
                      <label htmlFor={`season-${season}`} className="text-sm text-zinc-300 cursor-pointer">
                        {season}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-zinc-300 mb-3 block">Time of Day</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TIME_OF_DAY.map(time => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={`time-${time}`}
                        checked={formData.time_of_day.includes(time)}
                        onCheckedChange={() => toggleArrayItem('time_of_day', time)}
                        className="border-zinc-700 data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-700"
                      />
                      <label htmlFor={`time-${time}`} className="text-sm text-zinc-300 cursor-pointer">
                        {time}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-zinc-300 mb-3 block">Best For</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {USAGE_OPTIONS.map(use => (
                    <div key={use} className="flex items-center space-x-2">
                      <Checkbox
                        id={`usage-${use}`}
                        checked={formData.usage.includes(use)}
                        onCheckedChange={() => toggleArrayItem('usage', use)}
                        className="border-zinc-700 data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-700"
                      />
                      <label htmlFor={`usage-${use}`} className="text-sm text-zinc-300 cursor-pointer">
                        {use}
                      </label>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card border-border p-6 space-y-4">
              <h2 className="text-xl font-semibold text-primary">Tags</h2>
              <TagSelector
                selectedTags={formData.tags}
                onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                availableTags={availableTags}
              />
            </Card>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-card border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-primary">Fragrance Notes</h2>
            
            <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Top Notes</Label>
                  <Input
                    value={formData.notes_top}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes_top: e.target.value }))}
                    className="bg-input border-border text-foreground text-base"
                    placeholder="Bergamot, Blackcurrant, Pineapple"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Heart Notes</Label>
                  <Input
                    value={formData.notes_heart}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes_heart: e.target.value }))}
                    className="bg-input border-border text-foreground text-base"
                    placeholder="Rose, Jasmine, Patchouli"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Base Notes</Label>
                  <Input
                    value={formData.notes_base}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes_base: e.target.value }))}
                    className="bg-input border-border text-foreground text-base"
                    placeholder="Musk, Oakmoss, Ambergris, Vanilla"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-card border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-primary">Performance</h2>
            
            <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-foreground">Longevity</Label>
                    <span className="text-primary">{formData.longevity}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.longevity}
                    onChange={(e) => setFormData(prev => ({ ...prev, longevity: Number(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-foreground">Sillage</Label>
                    <span className="text-primary">{formData.sillage}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.sillage}
                    onChange={(e) => setFormData(prev => ({ ...prev, sillage: Number(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Personal Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-card border-border p-6 space-y-4">
              <h2 className="text-xl font-semibold text-primary">My Notes</h2>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-input border-border text-foreground text-base min-h-32"
                placeholder="Your thoughts, experiences, compliments received..."
              />
            </Card>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="bg-card border-border p-6 space-y-6">
              <h2 className="text-xl font-semibold text-primary">Links</h2>
            
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Fragrantica URL</Label>
                  <Input
                    type="url"
                    value={formData.fragrantica_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, fragrantica_url: e.target.value }))}
                    className="bg-input border-border text-foreground text-base"
                    placeholder="https://www.fragrantica.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Official Website</Label>
                  <Input
                    type="url"
                    value={formData.official_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, official_url: e.target.value }))}
                    className="bg-input border-border text-foreground text-base"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Submit */}
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Link to={createPageUrl('Collection')} className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Add Perfume'}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}