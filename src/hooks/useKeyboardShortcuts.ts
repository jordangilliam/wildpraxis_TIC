// Keyboard Shortcuts Hook
// Global keyboard shortcut system

import { useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const { settings } = useAccessibility();

  useEffect(() => {
    if (!enabled || !settings.keyboardShortcutsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !shortcut.ctrl || (shortcut.ctrl && (e.ctrlKey || e.metaKey));
        const altMatches = !shortcut.alt || (shortcut.alt && e.altKey);
        const shiftMatches = !shortcut.shift || (shortcut.shift && e.shiftKey);

        if (keyMatches && ctrlMatches && altMatches && shiftMatches) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled, settings.keyboardShortcutsEnabled]);
}

// Global shortcuts that work throughout the app
export function useGlobalKeyboardShortcuts(setActiveTab: (tab: string) => void) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'm',
      alt: true,
      description: 'Open AI Macro ID',
      action: () => setActiveTab('ai-macro'),
    },
    {
      key: 'b',
      alt: true,
      description: 'Open BrookAI Chat',
      action: () => setActiveTab('brook-ai'),
    },
    {
      key: 'l',
      alt: true,
      description: 'Open Life Cycle',
      action: () => setActiveTab('life-cycle'),
    },
    {
      key: 'c',
      alt: true,
      description: 'Open Crisis Training',
      action: () => setActiveTab('crisis'),
    },
    {
      key: 'd',
      alt: true,
      description: 'Open Dashboard',
      action: () => setActiveTab('dashboard'),
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => {
        alert('Keyboard Shortcuts:\n\n' + 
          'Alt + M: AI Macro ID\n' +
          'Alt + B: BrookAI Chat\n' +
          'Alt + L: Life Cycle\n' +
          'Alt + C: Crisis Training\n' +
          'Alt + D: Dashboard\n' +
          '?: Show this help\n' +
          'Tab: Navigate forward\n' +
          'Shift + Tab: Navigate backward\n' +
          'Esc: Close dialogs\n' +
          'Enter/Space: Activate buttons'
        );
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);
}

