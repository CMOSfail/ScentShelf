import React from 'react';
import { Star } from "lucide-react";

export default function RatingDisplay({ rating, size = "md", onChange = null }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => onChange && onChange(star)}
          disabled={!onChange}
          className={`${onChange ? 'cursor-pointer' : 'cursor-default'} transition-all ${onChange ? 'hover:scale-110' : ''}`}
        >
          <Star
            className={`${sizes[size]} ${
              star <= rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted-foreground/30"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}