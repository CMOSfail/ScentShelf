import React, { useMemo, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, Download, Upload, TrendingUp, Package, Droplets, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ThemeToggle from "../components/ui/ThemeToggle";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Statistics() {
  const navigate = useNavigate();

  const { data: perfumes = [] } = useQuery({
    queryKey: ['perfumes'],
    queryFn: () => base44.entities.Perfume.list(),
  });

  const stats = useMemo(() => {
    const totalCount = perfumes.length;
    const totalMl = perfumes.reduce((sum, p) => sum + (p.bottle_size || 0), 0);

    const bySeason = {};
    perfumes.forEach(p => {
      p.seasons?.forEach(season => {
        bySeason[season] = (bySeason[season] || 0) + 1;
      });
    });

    const byBrand = {};
    perfumes.forEach(p => {
      if (p.brand) byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
    });

    const byConcentration = {};
    perfumes.forEach(p => {
      if (p.concentration) byConcentration[p.concentration] = (byConcentration[p.concentration] || 0) + 1;
    });

    const ratedPerfumes = perfumes.filter(p => p.rating > 0);
    const avgRating = ratedPerfumes.length > 0
      ? (ratedPerfumes.reduce((sum, p) => sum + p.rating, 0) / ratedPerfumes.length).toFixed(1)
      : 0;

    const topRated = [...perfumes]
      .filter(p => p.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    return {
      totalCount,
      totalMl,
      avgRating,
      seasonData: Object.entries(bySeason).map(([name, value]) => ({ name, value })),
      brandData: Object.entries(byBrand).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value })),
      concentrationData: Object.entries(byConcentration).map(([name, value]) => ({ name, value })),
      topRated,
    };
  }, [perfumes]);

  const handleExport = () => {
    const dataStr = JSON.stringify(perfumes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `perfumes-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Collection exported successfully!');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (Array.isArray(data)) {
        for (const perfume of data) {
          const { id, created_date, updated_date, created_by, ...perfumeData } = perfume;
          await base44.entities.Perfume.create(perfumeData);
        }
        
        toast.success(`Successfully imported ${data.length} perfumes!`);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      toast.error('Error importing file. Please check the format.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to={createPageUrl('Collection')}>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex gap-2">
              <ThemeToggle />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <Button variant="outline" className="cursor-pointer" size="sm">
                  <Upload className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Import</span>
                </Button>
              </label>
              <Button onClick={handleExport} className="bg-primary" size="sm">
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Export</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 md:w-8 h-6 md:h-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Statistics</h1>
              <p className="text-muted-foreground text-sm">Insights from your collection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1, type: "spring" }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-card border-border p-6 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/20">
              <motion.div 
                className="flex items-center justify-between mb-2"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Package className="w-8 h-8 text-primary" />
                <TrendingUp className="w-5 h-5 text-primary/50" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Total Perfumes</p>
              <motion.p 
                className="text-3xl md:text-4xl font-bold text-foreground mt-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {stats.totalCount}
              </motion.p>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, type: "spring" }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-accent/10 to-card border-border p-6 hover:border-accent/50 transition-all hover:shadow-xl hover:shadow-accent/20">
              <motion.div 
                className="flex items-center justify-between mb-2"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Droplets className="w-8 h-8 text-accent" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <motion.p 
                className="text-3xl md:text-4xl font-bold text-foreground mt-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {stats.totalMl}<span className="text-lg"> ml</span>
              </motion.p>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3, type: "spring" }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-yellow-500/10 to-card border-border p-6 hover:border-yellow-500/50 transition-all hover:shadow-xl hover:shadow-yellow-500/20">
              <motion.div 
                className="flex items-center justify-between mb-2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <motion.p 
                className="text-3xl md:text-4xl font-bold text-foreground mt-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {stats.avgRating}<span className="text-lg"> / 5</span>
              </motion.p>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, type: "spring" }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-card border-border p-6 hover:border-green-500/50 transition-all hover:shadow-xl hover:shadow-green-500/20">
              <motion.div 
                className="flex items-center justify-between mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BarChart3 className="w-8 h-8 text-green-500" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Avg Bottle Size</p>
              <motion.p 
                className="text-3xl md:text-4xl font-bold text-foreground mt-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                {stats.totalCount > 0 ? Math.round(stats.totalMl / stats.totalCount) : 0}<span className="text-lg"> ml</span>
              </motion.p>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Season Chart */}
          {stats.seasonData.length > 0 && (
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">By Season</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.seasonData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stats.seasonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Concentration Chart */}
          {stats.concentrationData.length > 0 && (
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">By Concentration</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.concentrationData}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Brand Chart */}
          {stats.brandData.length > 0 && (
            <Card className="bg-card border-border p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Brands</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.brandData} layout="horizontal">
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" width={120} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* Top Rated */}
        {stats.topRated.length > 0 && (
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Rated Perfumes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.topRated.map((perfume) => (
                <Link key={perfume.id} to={createPageUrl('PerfumeDetail') + `?id=${perfume.id}`}>
                  <Card className="bg-muted/50 border-border p-4 hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="aspect-square rounded overflow-hidden mb-3 bg-muted">
                      {perfume.image_url && (
                        <img src={perfume.image_url} alt={perfume.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      )}
                    </div>
                    <p className="font-medium text-foreground truncate text-sm">{perfume.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{perfume.brand}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-sm font-medium text-primary">{perfume.rating}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}