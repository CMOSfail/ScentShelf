import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ImageUploader({ value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange(file_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    onChange(urlInput);
  };

  return (
    <Tabs defaultValue="url" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
        <TabsTrigger value="url">Paste URL</TabsTrigger>
        <TabsTrigger value="upload">Upload File</TabsTrigger>
      </TabsList>
      
      <TabsContent value="url" className="space-y-3">
        <div className="space-y-2">
          <Label className="text-zinc-300">Image URL</Label>
          <Input
            placeholder="https://example.com/bottle.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-amber-50"
          />
          <Button
            onClick={handleUrlSubmit}
            className="w-full bg-amber-700 hover:bg-amber-600"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Set Image URL
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="upload" className="space-y-3">
        <div className="space-y-2">
          <Label className="text-zinc-300">Upload Image</Label>
          <div className="border-2 border-dashed border-zinc-800 rounded-lg p-6 text-center hover:border-amber-700 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              )}
              <p className="text-sm text-zinc-400">
                {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
            </label>
          </div>
        </div>
      </TabsContent>

      {/* Preview */}
      {value && (
        <div className="mt-4">
          <Label className="text-zinc-300 mb-2 block">Preview</Label>
          <div className="relative aspect-[3/4] w-32 rounded-lg overflow-hidden border border-zinc-800">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </Tabs>
  );
}