import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Droplets } from "lucide-react";
import { motion } from "framer-motion";

export default function PerfumeCard({ perfume }) {
  const displayTags = perfume.tags?.slice(0, 3) || [];
  const remainingTags = perfume.tags?.length > 3 ? perfume.tags.length - 3 : 0;

  return (
    <Link to={createPageUrl('PerfumeDetail') + `?id=${perfume.id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
      <Card className="group overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
          {perfume.image_url ? (
            <img
              src={perfume.image_url}
              alt={perfume.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Droplets className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
          
          {/* Concentration badge */}
          {perfume.concentration && (
            <motion.div 
              className="absolute top-3 right-3"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.1 }}
            >
              <Badge className="bg-background/90 text-primary border-primary/50 backdrop-blur-sm text-xs font-light shadow-lg shadow-primary/20">
                {perfume.concentration}
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Name & Brand */}
          <div>
            <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1 group-hover:text-primary transition-all duration-300 group-hover:scale-105 origin-left">
              {perfume.name}
            </h3>
            <p className="text-sm text-muted-foreground font-light mt-0.5 transition-colors group-hover:text-accent">
              {perfume.brand}
            </p>
          </div>

          {/* Tags */}
          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {displayTags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs border-border text-muted-foreground bg-muted/50 font-light px-2 py-0"
                >
                  {tag}
                </Badge>
              ))}
              {remainingTags > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground/70 bg-muted/50 font-light px-2 py-0"
                >
                  +{remainingTags}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>
      </motion.div>
    </Link>
  );
}