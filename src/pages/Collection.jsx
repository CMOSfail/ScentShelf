import React, { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Tag, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PerfumeCard from "../components/perfume/PerfumeCard";
import FilterBar from "../components/perfume/FilterBar";
import ThemeToggle from "../components/ui/ThemeToggle";
import { motion } from "framer-motion";

export default function Collection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [notesFilter, setNotesFilter] = useState('');
  const [minLongevity, setMinLongevity] = useState(0);
  const [minSillage, setMinSillage] = useState(0);
  const [minRating, setMinRating] = useState(0);

  // Fetch perfumes
  const { data: perfumes = [], isLoading } = useQuery({
    queryKey: ['perfumes'],
    queryFn: () => base44.entities.Perfume.list('-created_date', 1000),
  });

  // Get all unique tags from perfumes
  const availableTags = useMemo(() => {
    const tags = new Set();
    perfumes.forEach(p => p.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [perfumes]);

  // Get all unique brands from perfumes
  const availableBrands = useMemo(() => {
    const brands = new Set();
    perfumes.forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [perfumes]);

  // Filter and sort perfumes
  const filteredPerfumes = useMemo(() => {
    let filtered = [...perfumes];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p =>
        selectedTags.every(tag => p.tags?.includes(tag))
      );
    }

    // Season filter
    if (seasonFilter !== 'all') {
      filtered = filtered.filter(p =>
        p.seasons?.includes(seasonFilter)
      );
    }

    // Brand filter
    if (brandFilter !== 'all') {
      filtered = filtered.filter(p => p.brand === brandFilter);
    }

    // Notes filter
    if (notesFilter) {
      const notesQuery = notesFilter.toLowerCase();
      filtered = filtered.filter(p => {
        const allNotes = [
          p.notes_top || '',
          p.notes_heart || '',
          p.notes_base || ''
        ].join(' ').toLowerCase();
        return allNotes.includes(notesQuery);
      });
    }

    // Longevity filter
    if (minLongevity > 0) {
      filtered = filtered.filter(p => (p.longevity || 0) >= minLongevity);
    }

    // Sillage filter
    if (minSillage > 0) {
      filtered = filtered.filter(p => (p.sillage || 0) >= minSillage);
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(p => (p.rating || 0) >= minRating);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_date) - new Date(a.created_date);
        case 'oldest':
          return new Date(a.created_date) - new Date(b.created_date);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'brand':
          return (a.brand || '').localeCompare(b.brand || '');
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'longevity':
          return (b.longevity || 0) - (a.longevity || 0);
        case 'sillage':
          return (b.sillage || 0) - (a.sillage || 0);
        case 'year':
          return (b.year || 0) - (a.year || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [perfumes, searchQuery, selectedTags, sortBy, seasonFilter, brandFilter, notesFilter, minLongevity, minSillage, minRating]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/70 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-6 md:w-8 h-6 md:h-8 text-primary neon-glow" />
                </motion.div>
                ScentShelf
              </h1>
              <motion.p 
                className="text-muted-foreground mt-1 text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {perfumes.length} {perfumes.length === 1 ? 'fragrance' : 'fragrances'}
              </motion.p>
            </motion.div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <ThemeToggle />
              <Link to={createPageUrl('TagManagement')} className="flex-1 md:flex-none">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 w-full"
                  style={{
                    boxShadow: "0 4px 20px rgba(150, 100, 255, 0.2), 0 0 40px rgba(150, 100, 255, 0.1)"
                  }}
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                  <div className="relative flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, -20, 20, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Tag className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(150,100,255,0.6)]" />
                    </motion.div>
                    <span className="text-sm font-semibold text-foreground">Tags</span>
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
              <Link to={createPageUrl('Statistics')} className="flex-1 md:flex-none">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 w-full"
                  style={{
                    boxShadow: "0 4px 20px rgba(150, 100, 255, 0.2), 0 0 40px rgba(150, 100, 255, 0.1)"
                  }}
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                  <div className="relative flex items-center gap-3">
                    <motion.div
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <BarChart3 className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(150,100,255,0.6)]" />
                    </motion.div>
                    <span className="text-sm font-semibold text-foreground">Stats</span>
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
              <Link to={createPageUrl('PerfumeForm')} className="flex-1 md:flex-none">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 w-full"
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
                      <Plus className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(150,100,255,0.6)]" />
                    </motion.div>
                    <span className="text-sm font-semibold text-foreground">Add</span>
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
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            availableTags={availableTags}
            availableBrands={availableBrands}
            sortBy={sortBy}
            setSortBy={setSortBy}
            seasonFilter={seasonFilter}
            setSeasonFilter={setSeasonFilter}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            notesFilter={notesFilter}
            setNotesFilter={setNotesFilter}
            minLongevity={minLongevity}
            setMinLongevity={setMinLongevity}
            minSillage={minSillage}
            setMinSillage={setMinSillage}
            minRating={minRating}
            setMinRating={setMinRating}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredPerfumes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 md:py-20"
          >
            <Sparkles className="w-12 md:w-16 h-12 md:h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-muted-foreground mb-2">
              {perfumes.length === 0 ? 'No perfumes yet' : 'No perfumes match your filters'}
            </h3>
            <p className="text-muted-foreground/70 mb-6 text-sm md:text-base">
              {perfumes.length === 0 
                ? 'Start building your collection by adding your first fragrance'
                : 'Try adjusting your filters or search query'}
            </p>
            {perfumes.length === 0 && (
              <Link to={createPageUrl('PerfumeForm')}>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Perfume
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredPerfumes.map((perfume, index) => (
              <motion.div
                key={perfume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <PerfumeCard perfume={perfume} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}