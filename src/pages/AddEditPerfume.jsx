import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ImageUploader from "../components/perfume/ImageUploader";
import TagInput from "../components/perfume/TagInput";
import { motion } from "framer-motion";

const SEASONS = ["Winter", "Spring", "Summer", "Fall"];
const TIMES = ["Day", "Night", "Evening"];
const CONCENTRATIONS = ["EDT", "EDP", "Parfum", "Cologne", "Extrait"];
const GENDERS = ["Masculine", "Feminine", "Unisex"];

export default function AddEditPerfume() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const perfumeId = urlParams.get('id');
  const isEdit = !!perfumeId;

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    concentration: '',
    image_url: '',
    year: '',
    gender_target: '',
    seasons: [],
    time_of_day: [],
    occasions: [],
    notes_top: '',
    notes_heart: '',
    notes_base: '',
    longevity: 5,
    sillage: 5,
    rating: 0,
    bottle_size: '',
    tags: [],
    personal_notes: '',
    fragrantica_url: '',
    official_url: '',
  });

  const { data: existingPerfume, isLoading } = useQuery({
    queryKey: ['perfume', perfumeId],
    queryFn: async () => {
      const perfumes = await base44.entities.Perfume.list();
      return perfumes.find(p => p.id === perfumeId);
    },
    enabled: isEdit,
  });

  const { data: allPerfumes = [] } = useQuery({
    queryKey: ['perfumes'],
    queryFn: () => base44.entities.Perfume.list(),
  });

  useEffect(() => {
    if (existingPerfume) {
      setFormData(existingPerfume);
    }
  }, [existingPerfume]);

  const availableTags = useMemo(() => {
    const tags = new Set();
    allPerfumes.forEach(p => {
      p.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allPerfumes]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (isEdit) {
        return base44.entities.Perfume.update(perfumeId, data);
      } else {
        return base44.entities.Perfume.create(data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
      queryClient.invalidateQueries({ queryKey: ['perfume', perfumeId] });
      navigate(createPageUrl('PerfumeDetails') + `?id=${data.id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up data
    const cleanData = {
      ...formData,
      year: formData.year ? Number(formData.year) : undefined,
      bottle_size: formData.bottle_size ? Number(formData.bottle_size) : undefined,
      longevity: formData.longevity ? Number(formData.longevity) : undefined,
      sillage: formData.sillage ? Number(formData.sillage) : undefined,
      rating: formData.rating ? Number(formData.rating) : undefined,
    };

    saveMutation.mutate(cleanData);
  };

  const handleSeasonToggle = (season) => {
    setFormData(prev => ({
      ...prev,
      seasons: prev.seasons?.includes(season)
        ? prev.seasons.filter(s => s !== season)
        : [...(prev.seasons || []), season]
    }));
  };

  const handleTimeToggle = (time) => {
    setFormData(prev => ({
      ...prev,
      time_of_day: prev.time_of_day?.includes(time)
        ? prev.time_of_day.filter(t => t !== time)
        : [...(prev.time_of_day || []), time]
    }));
  };

  const handleOccasionChange = (value) => {
    const occasions = value.split(',').map(o => o.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, occasions }));
  };

  if (isEdit && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to={isEdit ? createPageUrl('PerfumeDetails') + `?id=${perfumeId}` : createPageUrl('Collection')}>
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">
              {isEdit ? 'Edit Perfume' : 'Add New Perfume'}
            </h1>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., Aventus"
                  />
                </div>
                <div>
                  <Label htmlFor="brand" className="text-slate-300">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., Creed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="concentration" className="text-slate-300">Concentration</Label>
                  <Select
                    value={formData.concentration}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, concentration: value }))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {CONCENTRATIONS.map(conc => (
                        <SelectItem key={conc} value={conc} className="text-slate-300">
                          {conc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year" className="text-slate-300">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., 2020"
                  />
                </div>
                <div>
                  <Label htmlFor="bottle_size" className="text-slate-300">Bottle Size (ml)</Label>
                  <Input
                    id="bottle_size"
                    type="number"
                    value={formData.bottle_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, bottle_size: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender_target" className="text-slate-300">Target Gender</Label>
                <Select
                  value={formData.gender_target}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender_target: value }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {GENDERS.map(gender => (
                      <SelectItem key={gender} value={gender} className="text-slate-300">
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ImageUploader
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              />
            </CardContent>
          </Card>

          {/* Season & Time */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Best For</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300 mb-3 block">Seasons</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SEASONS.map(season => (
                    <div key={season} className="flex items-center space-x-2">
                      <Checkbox
                        id={`season-${season}`}
                        checked={formData.seasons?.includes(season)}
                        onCheckedChange={() => handleSeasonToggle(season)}
                        className="border-slate-700"
                      />
                      <label
                        htmlFor={`season-${season}`}
                        className="text-sm text-slate-300 cursor-pointer"
                      >
                        {season}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-slate-300 mb-3 block">Time of Day</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TIMES.map(time => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={`time-${time}`}
                        checked={formData.time_of_day?.includes(time)}
                        onCheckedChange={() => handleTimeToggle(time)}
                        className="border-slate-700"
                      />
                      <label
                        htmlFor={`time-${time}`}
                        className="text-sm text-slate-300 cursor-pointer"
                      >
                        {time}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="occasions" className="text-slate-300">
                  Occasions (comma-separated)
                </Label>
                <Input
                  id="occasions"
                  value={formData.occasions?.join(', ')}
                  onChange={(e) => handleOccasionChange(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="e.g., Office, Date Night, Casual"
                />
              </div>
            </CardContent>
          </Card>

          {/* Fragrance Notes */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Fragrance Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes_top" className="text-slate-300">Top Notes</Label>
                <Input
                  id="notes_top"
                  value={formData.notes_top}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes_top: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="e.g., Bergamot, Black Currant, Apple"
                />
              </div>
              <div>
                <Label htmlFor="notes_heart" className="text-slate-300">Heart Notes</Label>
                <Input
                  id="notes_heart"
                  value={formData.notes_heart}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes_heart: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="e.g., Pineapple, Patchouli, Rose"
                />
              </div>
              <div>
                <Label htmlFor="notes_base" className="text-slate-300">Base Notes</Label>
                <Input
                  id="notes_base"
                  value={formData.notes_base}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes_base: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="e.g., Musk, Oak Moss, Ambergris, Vanilla"
                />
              </div>
            </CardContent>
          </Card>

          {/* Performance & Rating */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Performance & Rating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="longevity" className="text-slate-300">Longevity</Label>
                  <span className="text-white font-medium">{formData.longevity}/10</span>
                </div>
                <input
                  id="longevity"
                  type="range"
                  min="1"
                  max="10"
                  value={formData.longevity}
                  onChange={(e) => setFormData(prev => ({ ...prev, longevity: Number(e.target.value) }))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="sillage" className="text-slate-300">Sillage / Projection</Label>
                  <span className="text-white font-medium">{formData.sillage}/10</span>
                </div>
                <input
                  id="sillage"
                  type="range"
                  min="1"
                  max="10"
                  value={formData.sillage}
                  onChange={(e) => setFormData(prev => ({ ...prev, sillage: Number(e.target.value) }))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="rating" className="text-slate-300">Personal Rating</Label>
                  <span className="text-white font-medium">{formData.rating}/5</span>
                </div>
                <input
                  id="rating"
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full accent-amber-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags & Notes */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Tags & Personal Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300 mb-2 block">Tags</Label>
                <TagInput
                  selectedTags={formData.tags || []}
                  onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                  availableTags={availableTags}
                />
              </div>

              <div>
                <Label htmlFor="personal_notes" className="text-slate-300">Personal Notes</Label>
                <Textarea
                  id="personal_notes"
                  value={formData.personal_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, personal_notes: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white min-h-32"
                  placeholder="Your thoughts, memories, or impressions..."
                />
              </div>
            </CardContent>
          </Card>

          {/* External Links */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">External Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fragrantica_url" className="text-slate-300">Fragrantica URL</Label>
                <Input
                  id="fragrantica_url"
                  type="url"
                  value={formData.fragrantica_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, fragrantica_url: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="https://www.fragrantica.com/..."
                />
              </div>
              <div>
                <Label htmlFor="official_url" className="text-slate-300">Official Website</Label>
                <Input
                  id="official_url"
                  type="url"
                  value={formData.official_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, official_url: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Link to={isEdit ? createPageUrl('PerfumeDetails') + `?id=${perfumeId}` : createPageUrl('Collection')}>
              <Button 
                type="button"
                variant="outline" 
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit"
              disabled={saveMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-black font-medium min-w-32"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? 'Update' : 'Add'} Perfume
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}