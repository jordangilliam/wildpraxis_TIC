// 🎮 Controller Instructions Component
// Shows keyboard controls at game start

import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Keyboard } from "lucide-react";

export interface ControlMapping {
  action: string;
  keys: string[];
  description: string;
}

interface ControllerInstructionsProps {
  gameName: string;
  icon: string;
  controls: ControlMapping[];
  tips?: string[];
  onStart: () => void;
  showStartButton?: boolean;
}

export function ControllerInstructions({
  gameName,
  icon,
  controls,
  tips = [],
  onStart,
  showStartButton = true
}: ControllerInstructionsProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-4 border-purple-500"
      >
        {/* Game Title */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            {icon}
          </motion.div>
          <h2 className="text-4xl font-black text-slate-800 mb-2">{gameName}</h2>
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <Gamepad2 className="h-5 w-5" />
            <span className="font-semibold">Controller Guide</span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4 text-purple-700">
            <Keyboard className="h-5 w-5" />
            <h3 className="font-bold text-lg">Keyboard Controls</h3>
          </div>
          
          <div className="space-y-3">
            {controls.map((control, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{control.action}</div>
                  <div className="text-sm text-slate-600">{control.description}</div>
                </div>
                <div className="flex gap-2">
                  {control.keys.map((key, i) => (
                    <React.Fragment key={i}>
                      <kbd className="px-3 py-2 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-lg font-mono text-sm shadow-lg border-2 border-slate-600 min-w-[3rem] text-center">
                        {key}
                      </kbd>
                      {i < control.keys.length - 1 && (
                        <span className="text-slate-400 font-semibold">or</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="bg-amber-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
            <div className="font-bold text-amber-800 mb-2 flex items-center gap-2">
              💡 Pro Tips
            </div>
            <ul className="space-y-1 text-sm text-amber-900">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Start Button */}
        {showStartButton && (
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(168, 85, 247, 0.4)",
                "0 0 0 20px rgba(168, 85, 247, 0)",
                "0 0 0 0 rgba(168, 85, 247, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-black py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
          >
            🎮 START GAME! 🎮
          </motion.button>
        )}

        <div className="text-center mt-4 text-sm text-slate-500">
          Press <kbd className="px-2 py-1 bg-slate-200 rounded font-mono text-xs">ESC</kbd> anytime to pause
        </div>
      </motion.div>
    </div>
  );
}

// Preset controls for common game types
export const PRESET_CONTROLS = {
  runner: [
    { action: "Jump / Switch Lane", keys: ["SPACE", "↑", "W"], description: "Move to avoid obstacles" },
    { action: "Pause Game", keys: ["ESC"], description: "Pause and resume" }
  ] as ControlMapping[],
  
  puzzle: [
    { action: "Move Selection", keys: ["←↑↓→", "WASD"], description: "Navigate the grid" },
    { action: "Select / Swap", keys: ["SPACE", "ENTER"], description: "Select and swap tiles" },
    { action: "Pause Game", keys: ["ESC"], description: "Pause and resume" }
  ] as ControlMapping[],
  
  tower: [
    { action: "Select Tower", keys: ["1", "2", "3"], description: "Choose tower type" },
    { action: "Place Tower", keys: ["SPACE", "ENTER"], description: "Place selected tower" },
    { action: "Cancel", keys: ["ESC"], description: "Cancel placement" }
  ] as ControlMapping[],
  
  rhythm: [
    { action: "Hit Target", keys: ["SPACE"], description: "Press at the perfect time" },
    { action: "Combo Boost", keys: ["↑", "W"], description: "Activate multiplier" },
    { action: "Pause Game", keys: ["ESC"], description: "Pause and resume" }
  ] as ControlMapping[],
  
  racer: [
    { action: "Accelerate", keys: ["↑", "W"], description: "Speed up" },
    { action: "Brake", keys: ["↓", "S"], description: "Slow down" },
    { action: "Steer", keys: ["←→", "A D"], description: "Move left/right" },
    { action: "Boost", keys: ["SPACE"], description: "Use nitro boost" }
  ] as ControlMapping[],
  
  speedChallenge: [
    { action: "Follow Pattern", keys: ["←↑↓→", "WASD"], description: "Match the sequence" },
    { action: "Confirm", keys: ["SPACE", "ENTER"], description: "Submit answer" },
    { action: "Skip", keys: ["ESC"], description: "Skip current challenge" }
  ] as ControlMapping[]
};

