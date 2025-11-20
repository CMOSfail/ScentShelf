import React from 'react';
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "sonner";

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
        <style>{`
          :root[data-theme="dark"] {
            --background: 240 80% 8%;
            --foreground: 210 100% 95%;
            --card: 240 70% 12%;
            --card-foreground: 210 100% 95%;
            --popover: 240 70% 12%;
            --popover-foreground: 210 100% 95%;
            --primary: 270 100% 70%;
            --primary-foreground: 240 100% 10%;
            --secondary: 240 60% 20%;
            --secondary-foreground: 210 100% 95%;
            --muted: 240 50% 18%;
            --muted-foreground: 210 50% 65%;
            --accent: 190 100% 60%;
            --accent-foreground: 240 100% 10%;
            --destructive: 0 90% 60%;
            --destructive-foreground: 0 0% 100%;
            --border: 250 60% 25%;
            --input: 240 70% 15%;
            --ring: 270 100% 70%;
            --radius: 0.75rem;
          }

          :root[data-theme="light"] {
            --background: 120 30% 97%;
            --foreground: 140 40% 15%;
            --card: 0 0% 100%;
            --card-foreground: 140 40% 15%;
            --popover: 0 0% 100%;
            --popover-foreground: 140 40% 15%;
            --primary: 150 60% 45%;
            --primary-foreground: 0 0% 100%;
            --secondary: 120 20% 92%;
            --secondary-foreground: 140 40% 15%;
            --muted: 120 20% 95%;
            --muted-foreground: 140 30% 40%;
            --accent: 170 60% 50%;
            --accent-foreground: 0 0% 100%;
            --destructive: 0 70% 55%;
            --destructive-foreground: 0 0% 100%;
            --border: 120 20% 85%;
            --input: 120 20% 96%;
            --ring: 150 60% 45%;
            --radius: 0.75rem;
          }
          
          @keyframes neonGlow {
            0%, 100% { 
              filter: drop-shadow(0 0 2px currentColor) drop-shadow(0 0 5px currentColor);
            }
            50% { 
              filter: drop-shadow(0 0 5px currentColor) drop-shadow(0 0 10px currentColor) drop-shadow(0 0 15px currentColor);
            }
          }
          
          @keyframes retroScan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          
          [data-theme="dark"] .neon-glow {
            animation: neonGlow 2s ease-in-out infinite;
          }
          
          [data-theme="dark"] body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, 
              transparent, 
              hsl(var(--primary)) 50%, 
              transparent
            );
            animation: retroScan 3s linear infinite;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.3;
          }
          
          [data-theme="dark"] *::selection {
            background: hsl(var(--primary) / 0.5);
            color: hsl(var(--foreground));
          }
          
          [data-theme="dark"] {
            text-shadow: 0 0 1px hsl(var(--primary) / 0.5);
          }
          
          .site-footer {
            margin-top: auto;
          }
          
          body {
            font-size: 16px;
          }
          
          [data-theme="dark"] body {
            background: 
              linear-gradient(to bottom, rgba(24, 24, 27, 0.70), rgba(24, 24, 27, 0.80)),
              url('https://backiee.com/static/wallpapers/3840x2160/414482.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
          }

          [data-theme="light"] body {
            background: 
              linear-gradient(to bottom, rgba(250, 250, 249, 0.70), rgba(250, 250, 249, 0.80)),
              url('https://motionbgs.com/media/3363/white-topography.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
          }
          
          [data-theme="dark"] .bg-card,
          [data-theme="dark"] .bg-background,
          [data-theme="light"] .bg-card,
          [data-theme="light"] .bg-background {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          
          * {
            scrollbar-width: thin;
          }
          
          [data-theme="dark"] * {
            scrollbar-color: rgb(113 63 18) rgb(24 24 27);
          }

          [data-theme="light"] * {
            scrollbar-color: rgb(180 130 70) rgb(245 240 230);
          }
          
          *::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          [data-theme="dark"] *::-webkit-scrollbar-track {
            background: rgb(24 24 27);
          }

          [data-theme="light"] *::-webkit-scrollbar-track {
            background: rgb(245 240 230);
          }
          
          [data-theme="dark"] *::-webkit-scrollbar-thumb {
            background: rgb(113 63 18);
            border-radius: 4px;
          }

          [data-theme="light"] *::-webkit-scrollbar-thumb {
            background: rgb(180 130 70);
            border-radius: 4px;
          }
          
          [data-theme="dark"] *::-webkit-scrollbar-thumb:hover {
            background: rgb(146 64 14);
          }

          [data-theme="light"] *::-webkit-scrollbar-thumb:hover {
            background: rgb(160 110 50);
          }
        `}</style>
        <div className="flex-1">
          {children}
        </div>
        <footer className="site-footer border-t border-border bg-card/50 backdrop-blur-sm mt-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Itamar Itzhaki. All rights reserved.
            </p>
          </div>
        </footer>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          theme="system"
        />
      </div>
    </ThemeProvider>
  );
}