import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit2, Trash2, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function TagManagement() {
  const queryClient = useQueryClient();
  const [editingTag, setEditingTag] = useState(null);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  // Fetch all perfumes to calculate tag usage
  const { data: perfumes = [] } = useQuery({
    queryKey: ['perfumes'],
    queryFn: () => base44.entities.Perfume.list(),
  });

  // Calculate tag usage from perfumes
  const tagsWithUsage = useMemo(() => {
    const tagMap = new Map();
    
    perfumes.forEach(perfume => {
      perfume.tags?.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [perfumes]);

  // Update tag in all perfumes
  const renameTagMutation = useMutation({
    mutationFn: async ({ oldLabel, newLabel }) => {
      const perfumesWithTag = perfumes.filter(p => p.tags?.includes(oldLabel));
      
      await Promise.all(
        perfumesWithTag.map(perfume =>
          base44.entities.Perfume.update(perfume.id, {
            ...perfume,
            tags: perfume.tags.map(t => t === oldLabel ? newLabel : t)
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['perfumes']);
      setEditingTag(null);
      setNewTagLabel('');
    },
  });

  // Delete tag from all perfumes
  const deleteTagMutation = useMutation({
    mutationFn: async (tagLabel) => {
      const perfumesWithTag = perfumes.filter(p => p.tags?.includes(tagLabel));
      
      await Promise.all(
        perfumesWithTag.map(perfume =>
          base44.entities.Perfume.update(perfume.id, {
            ...perfume,
            tags: perfume.tags.filter(t => t !== tagLabel)
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['perfumes']);
      setIsDeleteDialogOpen(false);
      setTagToDelete(null);
    },
  });

  const handleRename = () => {
    if (newTagLabel.trim() && editingTag) {
      renameTagMutation.mutate({
        oldLabel: editingTag,
        newLabel: newTagLabel.trim()
      });
    }
  };

  const handleDelete = () => {
    if (tagToDelete) {
      deleteTagMutation.mutate(tagToDelete);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link to={createPageUrl('Collection')}>
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-amber-400 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Tags className="w-8 h-8 text-amber-500" />
            <div>
              <h1 className="text-3xl font-bold text-amber-50">Tag Management</h1>
              <p className="text-zinc-400 mt-1">{tagsWithUsage.length} tags in your collection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {tagsWithUsage.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
            <Tags className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">No tags yet</h3>
            <p className="text-zinc-500">
              Tags will appear here once you add them to your perfumes
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tagsWithUsage.map((tag) => (
              <Card
                key={tag.label}
                className="bg-zinc-900 border-zinc-800 p-4 hover:border-amber-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-medium text-amber-50">
                          {tag.label}
                        </span>
                        <Badge
                          variant="outline"
                          className="border-zinc-700 text-zinc-400 bg-zinc-800/50"
                        >
                          {tag.count} {tag.count === 1 ? 'perfume' : 'perfumes'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTag(tag.label);
                        setNewTagLabel(tag.label);
                      }}
                      className="text-zinc-400 hover:text-amber-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setTagToDelete(tag.label);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTag} onOpenChange={(open) => !open && setEditingTag(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-amber-50">
          <DialogHeader>
            <DialogTitle>Rename Tag</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will update the tag name in all perfumes that use it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">New Tag Name</Label>
              <Input
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                className="bg-zinc-950 border-zinc-800 text-amber-50"
                placeholder="Enter new tag name"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingTag(null)}
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!newTagLabel.trim() || renameTagMutation.isPending}
              className="bg-amber-700 hover:bg-amber-600"
            >
              {renameTagMutation.isPending ? 'Renaming...' : 'Rename Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-amber-50">
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete "{tagToDelete}"? This tag is used by{' '}
              {tagsWithUsage.find(t => t.label === tagToDelete)?.count || 0} perfume(s).
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteTagMutation.isPending}
              className="bg-red-700 hover:bg-red-600 text-white"
            >
              {deleteTagMutation.isPending ? 'Deleting...' : 'Delete Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}