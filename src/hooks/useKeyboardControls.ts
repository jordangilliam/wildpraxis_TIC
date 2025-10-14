// 🎮 Reusable Keyboard Controls Hook
// Supports WASD, Arrow Keys, and Spacebar

import { useEffect, useCallback, useRef } from "react";

export type KeyAction = 
  | "up" | "down" | "left" | "right" 
  | "action" | "pause" | "confirm";

export interface KeyboardConfig {
  enabled?: boolean;
  preventDefault?: boolean;
  onKeyPress?: (action: KeyAction) => void;
  onKeyDown?: (action: KeyAction) => void;
  onKeyUp?: (action: KeyAction) => void;
}

const KEY_MAP: Record<string, KeyAction> = {
  // Arrow keys
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  
  // WASD
  'KeyW': 'up',
  'KeyA': 'left',
  'KeyS': 'down',
  'KeyD': 'right',
  
  // Action keys
  'Space': 'action',
  'Enter': 'confirm',
  'Escape': 'pause',
};

export function useKeyboardControls(config: KeyboardConfig = {}) {
  const {
    enabled = true,
    preventDefault = true,
    onKeyPress,
    onKeyDown,
    onKeyUp
  } = config;

  const activeKeys = useRef<Set<KeyAction>>(new Set());

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const action = KEY_MAP[event.code];
    if (!action) return;

    if (preventDefault) {
      event.preventDefault();
    }

    // Only fire once per key hold
    if (!activeKeys.current.has(action)) {
      activeKeys.current.add(action);
      onKeyDown?.(action);
      onKeyPress?.(action);
    }
  }, [enabled, preventDefault, onKeyDown, onKeyPress]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const action = KEY_MAP[event.code];
    if (!action) return;

    if (preventDefault) {
      event.preventDefault();
    }

    activeKeys.current.delete(action);
    onKeyUp?.(action);
  }, [enabled, preventDefault, onKeyUp]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      activeKeys.current.clear();
    };
  }, [handleKeyDown, handleKeyUp]);

  const isKeyPressed = useCallback((action: KeyAction) => {
    return activeKeys.current.has(action);
  }, []);

  return { isKeyPressed, activeKeys: activeKeys.current };
}

