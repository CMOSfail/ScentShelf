import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Settings() {
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const { data: perfumes = [] } = useQuery({
    queryKey: ['perfumes'],
    queryFn: () => base44.entities.Perfume.list(),
  });

  const handleExport = () => {
    const dataStr = JSON.stringify(perfumes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `perfume-collection-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error('Invalid file format. Expected an array of perfumes.');
      }

      // Import perfumes
      for (const perfume of data) {
        // Remove system fields
        const { id, created_date, updated_date, created_by, ...perfumeData } = perfume;
        await base44.entities.Perfume.create(perfumeData);
      }

      setImportStatus({ type: 'success', message: `Successfully imported ${data.length} perfumes!` });
      
      // Refresh the page after a delay
      setTimeout(() => {
        window.location.href = createPageUrl('Collection');
      }, 2000);

    } catch (error) {
      setImportStatus({ 
        type: 'error', 
        message: error.message || 'Failed to import file. Please check the format and try again.' 
      });
    } finally {
      setImporting(false);
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Collection')}>
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Collection
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="w-32" />
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
      >
        {/* Export */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-amber-500" />
              Export Collection
            </CardTitle>
            <CardDescription className="text-slate-400">
              Download your entire collection as a JSON file for backup or sharing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 mb-1">
                  {perfumes.length} {perfumes.length === 1 ? 'perfume' : 'perfumes'} in your collection
                </p>
                <p className="text-sm text-slate-500">
                  Last export: Never
                </p>
              </div>
              <Button
                onClick={handleExport}
                disabled={perfumes.length === 0}
                className="bg-amber-600 hover:bg-amber-700 text-black"
              >
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Import */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-500" />
              Import Collection
            </CardTitle>
            <CardDescription className="text-slate-400">
              Import perfumes from a previously exported JSON file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-amber-500/50 transition-colors">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file" className="cursor-pointer">
                {importing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
                    <p className="text-sm text-slate-400">Importing...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-slate-500" />
                    <p className="text-sm text-slate-300">Click to select a JSON file</p>
                    <p className="text-xs text-slate-500">
                      Previously exported collection files only
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Import Status */}
            {importStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  importStatus.type === 'success'
                    ? 'bg-green-900/30 border border-green-700/50'
                    : 'bg-red-900/30 border border-red-700/50'
                }`}
              >
                {importStatus.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    importStatus.type === 'success' ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {importStatus.type === 'success' ? 'Import Successful!' : 'Import Failed'}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">{importStatus.message}</p>
                </div>
              </motion.div>
            )}

            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-sm text-slate-400">
                <strong className="text-slate-300">Note:</strong> Importing will add the perfumes from the file to your existing collection. 
                It will not remove or replace your current perfumes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">About</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 space-y-2 text-sm">
            <p>Perfume Collection Manager - A beautiful way to catalog and manage your fragrances.</p>
            <p className="text-slate-500">Built with Base44</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}