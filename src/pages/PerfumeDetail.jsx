import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Edit, Trash2, ExternalLink, Droplets, Save, X, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import PerformanceBar from "../components/perfume/PerformanceBar";
import RatingDisplay from "../components/perfume/RatingDisplay";
import ImageUploader from "../components/perfume/ImageUploader";
import TagSelector from "../components/perfume/TagSelector";
import ThemeToggle from "../components/ui/ThemeToggle";
import { toast } from "sonner";

const SEASONS = ["Winter", "Spring", "Summer", "Fall"];
const TIME_OF_DAY = ["Day", "Night", "Evening"];
const USAGE_OPTIONS = ["Office", "Date Night", "Casual", "Formal", "Sport", "Travel"];

export default function PerfumeDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const perfumeId = params.get('id');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const { data: perfume, isLoading } = useQuery({
    queryKey: ['perfume', perfumeId],
    queryFn: async () => {
      const perfumes = await base44.entities.Perfume.list();
      return perfumes.find(p => p.id === perfumeId);
    },
  });

  const { data: allPerfumes = [] } = useQuery({
    queryKey: ['perfumes'],
    queryFn: () => base44.entities.Perfume.list(),
  });

  const availableTags = useMemo(() => {
    const tags = new Set();
    allPerfumes.forEach(p => p.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [allPerfumes]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Perfume.update(perfumeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['perfumes']);
      queryClient.invalidateQueries(['perfume', perfumeId]);
      toast.success('Perfume updated successfully!');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update perfume.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Perfume.delete(perfumeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['perfumes']);
      toast.success('Perfume deleted successfully');
      navigate(createPageUrl('Collection'));
    },
  });

  const handleEdit = () => {
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
    setIsEditing(true);
  };

  const handleSave = () => {
    const cleanedData = {
      ...formData,
      year: formData.year ? Number(formData.year) : null,
      bottle_size: formData.bottle_size ? Number(formData.bottle_size) : null,
    };
    updateMutation.mutate(cleanedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${perfume.name}"?`)) {
      deleteMutation.mutate();
    }
  };

  const toggleArrayItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Perfume not found</h2>
          <Link to={createPageUrl('Collection')}>
            <Button className="bg-primary hover:bg-primary/90">
              Back to ScentShelf
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayData = isEditing ? formData : perfume;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/70 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to={createPageUrl('Collection')}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative group px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300"
                style={{
                  boxShadow: "0 4px 20px rgba(150, 100, 255, 0.2), 0 0 40px rgba(150, 100, 255, 0.1)"
                }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                <div className="relative flex items-center gap-3">
                  <motion.div
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowLeft className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(150,100,255,0.6)]" />
                  </motion.div>
                  <span className="text-sm font-semibold text-foreground">Back</span>
                  <motion.div
                    animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-primary opacity-70" />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: "100%", opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </Link>
            
            <div className="flex flex-wrap gap-2">
              <ThemeToggle />
              
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div 
                    key="editing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <motion.button
                      onClick={handleCancel}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300"
                      style={{
                        boxShadow: "0 4px 20px rgba(150, 100, 255, 0.2), 0 0 40px rgba(150, 100, 255, 0.1)"
                      }}
                    >
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                      <div className="relative flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 90, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <X className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(150,100,255,0.6)]" />
                        </motion.div>
                        <span className="text-sm font-semibold text-foreground">Cancel</span>
                        <motion.div
                          animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4 text-primary opacity-70" />
                        </motion.div>
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%", opacity: 0 }}
                        whileHover={{ x: "100%", opacity: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.button>
                    <motion.button
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 disabled:opacity-50"
                      style={{
                        boxShadow: "0 4px 20px rgba(150, 100, 255, 0.2), 0 0 40px rgba(150, 100, 255, 0.1)"
                      }}
                    >
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                      <div className="relative flex items-center gap-3">
                        <motion.div
                          animate={!updateMutation.isPending ? { rotate: [0, 360] } : {}}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Save className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(150,100,255,0.6)]" />
                        </motion.div>
                        <span className="text-sm font-semibold text-foreground">
                          {updateMutation.isPending ? 'Saving...' : 'Save'}
                        </span>
                        <motion.div
                          animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4 text-primary opacity-70" />
                        </motion.div>
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%", opacity: 0 }}
                        whileHover={{ x: "100%", opacity: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="viewing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <motion.button
                      onClick={handleEdit}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300"
                      style={{
                        boxShadow: "0 4px 20px rgba(150, 100, 255, 0.2), 0 0 40px rgba(150, 100, 255, 0.1)"
                      }}
                    >
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                      <div className="relative flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Edit className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(150,100,255,0.6)]" />
                        </motion.div>
                        <span className="text-sm font-semibold text-foreground">Edit</span>
                        <motion.div
                          animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4 text-primary opacity-70" />
                        </motion.div>
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%", opacity: 0 }}
                        whileHover={{ x: "100%", opacity: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.button>
                    <motion.button
                      onClick={handleDelete}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group px-6 py-3 bg-gradient-to-r from-destructive/10 to-destructive/20 border-2 border-destructive/30 rounded-2xl overflow-hidden hover:border-destructive transition-all duration-300"
                      style={{
                        boxShadow: "0 4px 20px rgba(239, 68, 68, 0.2), 0 0 40px rgba(239, 68, 68, 0.1)"
                      }}
                    >
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-destructive/20" />
                      <div className="relative flex items-center gap-3">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Trash2 className="w-5 h-5 text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                        </motion.div>
                        <span className="text-sm font-semibold text-foreground">Delete</span>
                        <motion.div
                          animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4 text-destructive opacity-70" />
                        </motion.div>
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%", opacity: 0 }}
                        whileHover={{ x: "100%", opacity: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column: Title & Image */}
          <div className="lg:col-span-1 space-y-3">
            {/* Title & Basic Info */}
            <Card className="bg-card border-border p-4 space-y-3">

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Name *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Brand *</Label>
                    <Input
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">My Rating</Label>
                    <RatingDisplay
                      rating={formData.rating}
                      size="lg"
                      onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label className="text-foreground">Gender</Label>
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
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Bottle Size (ml)</Label>
                      <Input
                        type="number"
                        value={formData.bottle_size}
                        onChange={(e) => setFormData(prev => ({ ...prev, bottle_size: e.target.value }))}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                          {perfume.name}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-light">
                          {perfume.brand}
                        </p>
                      </div>
                      <RatingDisplay
                        rating={perfume.rating}
                        size="lg"
                        onChange={null}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {perfume.concentration && (
                      <Badge className="bg-primary text-primary-foreground border-primary">
                        {perfume.concentration}
                      </Badge>
                    )}
                    {perfume.gender_target && (
                      <Badge variant="outline" className="border-border text-muted-foreground bg-muted/50">
                        {perfume.gender_target}
                      </Badge>
                    )}
                    {perfume.year && (
                      <Badge variant="outline" className="border-border text-muted-foreground bg-muted/50">
                        {perfume.year}
                      </Badge>
                    )}
                    {perfume.bottle_size && (
                      <Badge variant="outline" className="border-border text-muted-foreground bg-muted/50">
                        {perfume.bottle_size}ml
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </Card>
            
            {/* Image */}
            <Card className="overflow-hidden bg-card border-border">
              {isEditing ? (
                <div className="p-4">
                  <ImageUploader
                    value={formData.image_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  />
                </div>
              ) : (
                <div className="aspect-[2/3] bg-muted">
                  {perfume.image_url ? (
                    <img
                      src={perfume.image_url}
                      alt={perfume.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Droplets className="w-32 h-32 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Details in 2-column grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:grid-rows-[auto_auto_auto_1fr] md:auto-rows-fr">
              {/* Season & Time */}
              <Card className="bg-card border-border p-4 space-y-3">
              <h3 className="text-base font-semibold text-primary">Season & Time</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground mb-3 block">Seasons</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {SEASONS.map(season => (
                        <div key={season} className="flex items-center space-x-2">
                          <Checkbox
                            id={`season-${season}`}
                            checked={formData.seasons.includes(season)}
                            onCheckedChange={() => toggleArrayItem('seasons', season)}
                          />
                          <label htmlFor={`season-${season}`} className="text-sm text-foreground cursor-pointer">
                            {season}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-foreground mb-3 block">Time of Day</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_OF_DAY.map(time => (
                        <div key={time} className="flex items-center space-x-2">
                          <Checkbox
                            id={`time-${time}`}
                            checked={formData.time_of_day.includes(time)}
                            onCheckedChange={() => toggleArrayItem('time_of_day', time)}
                          />
                          <label htmlFor={`time-${time}`} className="text-sm text-foreground cursor-pointer">
                            {time}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-foreground mb-3 block">Best For</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {USAGE_OPTIONS.map(use => (
                        <div key={use} className="flex items-center space-x-2">
                          <Checkbox
                            id={`usage-${use}`}
                            checked={formData.usage.includes(use)}
                            onCheckedChange={() => toggleArrayItem('usage', use)}
                          />
                          <label htmlFor={`usage-${use}`} className="text-sm text-foreground cursor-pointer">
                            {use}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {displayData.seasons?.length > 0 && (
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2">Seasons</h4>
                      <div className="flex flex-wrap gap-2">
                        {displayData.seasons.map(season => (
                          <Badge key={season} variant="outline" className="border-border text-foreground bg-muted/50">
                            {season}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayData.time_of_day?.length > 0 && (
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2">Time of Day</h4>
                      <div className="flex flex-wrap gap-2">
                        {displayData.time_of_day.map(time => (
                          <Badge key={time} variant="outline" className="border-border text-foreground bg-muted/50">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayData.usage?.length > 0 && (
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2">Best For</h4>
                      <div className="flex flex-wrap gap-2">
                        {displayData.usage.map(use => (
                          <Badge key={use} variant="outline" className="border-border text-foreground bg-muted/50">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  </>
                )}
              </Card>

              {/* Tags */}
              <Card className="bg-card border-border p-4 space-y-3">
              <h3 className="text-base font-semibold text-primary">Tags</h3>
              {isEditing ? (
                <TagSelector
                  selectedTags={formData.tags}
                  onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                  availableTags={availableTags}
                />
              ) : (
                displayData.tags?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayData.tags.map(tag => (
                      <Badge key={tag} className="bg-primary text-primary-foreground border-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No tags</p>
                )
              )}
            </Card>

            {/* Fragrance Notes */}
            <Card className="bg-card border-border p-4 space-y-3 md:col-span-2">
              <h3 className="text-base font-semibold text-primary">Fragrance Notes</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Top Notes</Label>
                    <Input
                      value={formData.notes_top}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes_top: e.target.value }))}
                      className="bg-input border-border text-foreground"
                      placeholder="Bergamot, Blackcurrant, Pineapple"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Heart Notes</Label>
                    <Input
                      value={formData.notes_heart}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes_heart: e.target.value }))}
                      className="bg-input border-border text-foreground"
                      placeholder="Rose, Jasmine, Patchouli"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Base Notes</Label>
                    <Input
                      value={formData.notes_base}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes_base: e.target.value }))}
                      className="bg-input border-border text-foreground"
                      placeholder="Musk, Oakmoss, Ambergris, Vanilla"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {displayData.notes_top && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Top Notes</h4>
                      <p className="text-foreground">{displayData.notes_top}</p>
                    </div>
                  )}
                  {displayData.notes_heart && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Heart Notes</h4>
                      <p className="text-foreground">{displayData.notes_heart}</p>
                    </div>
                  )}
                  {displayData.notes_base && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Base Notes</h4>
                      <p className="text-foreground">{displayData.notes_base}</p>
                    </div>
                  )}
                  </>
                )}
              </Card>

              {/* Performance */}
              <Card className="bg-card border-border p-4 space-y-3 flex flex-col">
              <h3 className="text-base font-semibold text-primary">Performance</h3>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-foreground">Longevity</Label>
                      <span className="text-primary">{formData.longevity}/10</span>
                    </div>
                    <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                        style={{ width: `${(formData.longevity / 10) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.longevity}
                        onChange={(e) => setFormData(prev => ({ ...prev, longevity: Number(e.target.value) }))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-foreground">Sillage</Label>
                      <span className="text-primary">{formData.sillage}/10</span>
                    </div>
                    <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                        style={{ width: `${(formData.sillage / 10) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.sillage}
                        onChange={(e) => setFormData(prev => ({ ...prev, sillage: Number(e.target.value) }))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {displayData.longevity > 0 && (
                    <PerformanceBar label="Longevity" value={displayData.longevity} />
                  )}
                  {displayData.sillage > 0 && (
                    <PerformanceBar label="Sillage" value={displayData.sillage} />
                  )}
                  </>
                )}
              </Card>

              {/* Personal Notes */}
              <Card className="bg-card border-border p-4 space-y-3 flex flex-col">
              <h3 className="text-base font-semibold text-primary">My Notes</h3>
              {isEditing ? (
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-input border-border text-foreground flex-1 min-h-[300px]"
                  placeholder="Your thoughts, experiences, compliments received..."
                />
              ) : (
                displayData.notes ? (
                  <p className="text-foreground leading-relaxed flex-1">{displayData.notes}</p>
                ) : (
                  <p className="text-muted-foreground text-sm">No notes yet</p>
                )
              )}
            </Card>

              {/* Links */}
              <Card className="bg-card border-border p-4 space-y-3 flex flex-col md:col-span-2">
                <h3 className="text-base font-semibold text-primary">Links</h3>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Fragrantica URL</Label>
                      <Input
                        type="url"
                        value={formData.fragrantica_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, fragrantica_url: e.target.value }))}
                        className="bg-input border-border text-foreground"
                        placeholder="https://www.fragrantica.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Official Website</Label>
                      <Input
                        type="url"
                        value={formData.official_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, official_url: e.target.value }))}
                        className="bg-input border-border text-foreground"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {displayData.fragrantica_url && (
                      <a
                        href={displayData.fragrantica_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Fragrantica
                      </a>
                    )}
                    {displayData.official_url && (
                      <a
                        href={displayData.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Official Website
                      </a>
                    )}
                    {!displayData.fragrantica_url && !displayData.official_url && (
                      <p className="text-muted-foreground text-sm">No links added</p>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}