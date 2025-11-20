import React from 'react';
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative group px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: isDark 
          ? "0 4px 20px rgba(150, 100, 255, 0.2), 0 0 40px rgba(150, 100, 255, 0.1)"
          : "0 4px 20px rgba(100, 180, 100, 0.2), 0 0 40px rgba(100, 180, 100, 0.1)"
      }}
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          background: isDark 
            ? "linear-gradient(135deg, rgba(150, 100, 255, 0.15) 0%, rgba(100, 200, 255, 0.15) 100%)"
            : "linear-gradient(135deg, rgba(100, 180, 100, 0.15) 0%, rgba(120, 200, 150, 0.15) 100%)"
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Sparkle particles */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
      
      {/* Content */}
      <div className="relative flex items-center gap-3">
        {/* Icon Container */}
        <motion.div 
          className="relative w-8 h-8 flex items-center justify-center"
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Moon */}
          <motion.div
            className="absolute"
            initial={false}
            animate={{
              scale: isDark ? 1 : 0,
              rotate: isDark ? 0 : -180,
              opacity: isDark ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Moon className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(150,100,255,0.6)]" />
          </motion.div>
          
          {/* Sun */}
          <motion.div
            className="absolute"
            initial={false}
            animate={{
              scale: isDark ? 0 : 1,
              rotate: isDark ? 180 : 0,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Sun className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(100,180,100,0.6)]" />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.span 
          className="text-sm font-semibold text-foreground"
          initial={false}
          animate={{ 
            x: [0, -2, 2, 0],
          }}
          transition={{ 
            duration: 0.3,
          }}
        >
          {isDark ? 'Dark' : 'Light'}
        </motion.span>

        {/* Sparkle accent */}
        <motion.div
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear" 
          }}
        >
          <Sparkles className="w-4 h-4 text-primary opacity-70" />
        </motion.div>
      </div>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%", opacity: 0 }}
        whileHover={{ x: "100%", opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}