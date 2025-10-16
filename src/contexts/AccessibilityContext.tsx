// Accessibility Context
// Manages accessibility settings: dark mode, high contrast, font size, reduced motion, dyslexia font

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AccessibilitySettings {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
  reduceMotion: boolean;
  dyslexiaFont: boolean;
  screenReaderAnnouncements: boolean;
  keyboardShortcutsEnabled: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const defaultSettings: AccessibilitySettings = {
  darkMode: false,
  highContrast: false,
  fontSize: 'normal',
  reduceMotion: false,
  dyslexiaFont: false,
  screenReaderAnnouncements: true,
  keyboardShortcutsEnabled: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }

    // Check system preferences
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return {
      ...defaultSettings,
      darkMode: prefersDark,
      reduceMotion: prefersReducedMotion,
    };
  });

  const [announcementRegion, setAnnouncementRegion] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    // Apply settings to document
    const root = document.documentElement;

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-normal', 'font-large', 'font-x-large');
    root.classList.add(`font-${settings.fontSize}`);

    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('font-dyslexia');
    } else {
      root.classList.remove('font-dyslexia');
    }

    // Reduced motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [settings]);

  // Listen for system preference changes
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('accessibility-settings')) {
        setSettings(prev => ({ ...prev, darkMode: e.matches }));
      }
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reduceMotion: e.matches }));
    };

    darkModeQuery.addEventListener('change', handleDarkModeChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      darkModeQuery.removeEventListener('change', handleDarkModeChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Create announcement region for screen readers
  useEffect(() => {
    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    setAnnouncementRegion(region);

    return () => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    };
  }, []);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.screenReaderAnnouncements || !announcementRegion) return;

    announcementRegion.setAttribute('aria-live', priority);
    announcementRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (announcementRegion) {
        announcementRegion.textContent = '';
      }
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announce }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

