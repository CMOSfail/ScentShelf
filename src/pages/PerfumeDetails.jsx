import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, Edit, Trash2, ExternalLink, 
  Sparkles, Calendar, Droplet, Timer, Wind,
  Star, Tag as TagIcon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function PerfumeDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const perfumeId = urlParams.get('id');

  const { data: perfume, isLoading } = useQuery({
    queryKey: ['perfume', perfumeId],
    queryFn: async () => {
      const perfumes = await base44.entities.Perfume.list();
      return perfumes.find(p => p.id === perfumeId);
    },
    enabled: !!perfumeId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Perfume.delete(perfumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
      navigate(createPageUrl('Collection'));
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${perfume?.name}"?`)) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500" />
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Perfume not found</h2>
          <Link to={createPageUrl('Collection')}>
            <Button className="bg-amber-600 hover:bg-amber-700 text-black">
              Back to Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Collection')}>
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Collection
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link to={createPageUrl('AddEditPerfume') + `?id=${perfume.id}`}>
                <Button 
                  variant="outline" 
                  className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button 
                variant="outline"
                onClick={handleDelete}
                className="bg-red-950/50 border-red-900/50 text-red-400 hover:bg-red-900/50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left Column - Image */}
          <div>
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <div className="aspect-square relative bg-slate-950/50">
                {perfume.image_url ? (
                  <img
                    src={perfume.image_url}
                    alt={perfume.name}
                    className="w-full h-full object-contain p-8"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-24 h-24 text-slate-700" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title & Basic Info */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{perfume.name}</h1>
              <p className="text-xl text-slate-400 mb-4">{perfume.brand}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {perfume.concentration && (
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                    {perfume.concentration}
                  </Badge>
                )}
                {perfume.gender_target && (
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                    {perfume.gender_target}
                  </Badge>
                )}
                {perfume.year && (
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                    <Calendar className="h-3 w-3 mr-1" />
                    {perfume.year}
                  </Badge>
                )}
                {perfume.bottle_size && (
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                    <Droplet className="h-3 w-3 mr-1" />
                    {perfume.bottle_size} ml
                  </Badge>
                )}
              </div>

              {/* Rating */}
              {perfume.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < perfume.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-400 text-sm">
                    {perfume.rating.toFixed(1)} / 5.0
                  </span>
                </div>
              )}
            </div>

            <Separator className="bg-slate-800" />

            {/* Season & Time */}
            {(perfume.seasons?.length > 0 || perfume.time_of_day?.length > 0) && (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">BEST FOR</h3>
                  <div className="flex flex-wrap gap-2">
                    {perfume.seasons?.map(season => (
                      <Badge key={season} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {season}
                      </Badge>
                    ))}
                    {perfume.time_of_day?.map(time => (
                      <Badge key={time} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance */}
            {(perfume.longevity || perfume.sillage) && (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-4">PERFORMANCE</h3>
                  <div className="space-y-4">
                    {perfume.longevity && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-amber-500" />
                            <span className="text-slate-300">Longevity</span>
                          </div>
                          <span className="text-white font-medium">{perfume.longevity}/10</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
                            style={{ width: `${perfume.longevity * 10}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {perfume.sillage && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-amber-500" />
                            <span className="text-slate-300">Sillage</span>
                          </div>
                          <span className="text-white font-medium">{perfume.sillage}/10</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
                            style={{ width: `${perfume.sillage * 10}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {(perfume.notes_top || perfume.notes_heart || perfume.notes_base) && (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="pt-6 space-y-3">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">FRAGRANCE NOTES</h3>
                  {perfume.notes_top && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Top Notes</p>
                      <p className="text-slate-300">{perfume.notes_top}</p>
                    </div>
                  )}
                  {perfume.notes_heart && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Heart Notes</p>
                      <p className="text-slate-300">{perfume.notes_heart}</p>
                    </div>
                  )}
                  {perfume.notes_base && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Base Notes</p>
                      <p className="text-slate-300">{perfume.notes_base}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Occasions & Tags */}
            {(perfume.occasions?.length > 0 || perfume.tags?.length > 0) && (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="pt-6">
                  {perfume.occasions?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-slate-400 mb-2">OCCASIONS</h3>
                      <div className="flex flex-wrap gap-2">
                        {perfume.occasions.map((occasion, idx) => (
                          <Badge key={idx} className="bg-green-500/20 text-green-300 border-green-500/30">
                            {occasion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {perfume.tags?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-2">TAGS</h3>
                      <div className="flex flex-wrap gap-2">
                        {perfume.tags.map((tag, idx) => (
                          <Badge key={idx} className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Personal Notes */}
            {perfume.personal_notes && (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">PERSONAL NOTES</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">{perfume.personal_notes}</p>
                </CardContent>
              </Card>
            )}

            {/* External Links */}
            {(perfume.fragrantica_url || perfume.official_url) && (
              <div className="flex gap-2">
                {perfume.fragrantica_url && (
                  <a 
                    href={perfume.fragrantica_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Fragrantica
                    </Button>
                  </a>
                )}
                {perfume.official_url && (
                  <a 
                    href={perfume.official_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Official Site
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}