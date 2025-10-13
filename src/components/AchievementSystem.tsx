// 🏆 Achievement Pop-up System with Confetti & Animations
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Award, Zap, Crown, Flame, Sparkles } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  points: number;
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (achievement) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: ["#fbbf24", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 5)]
      }));
      setParticles(newParticles);

      // Auto close after 5 seconds
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Confetti Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${particle.x}%`,
              backgroundColor: particle.color
            }}
            initial={{ y: particle.y, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [1, 1, 0],
              rotate: 360 * 3,
              x: (Math.random() - 0.5) * 200
            }}
            transition={{
              duration: 3,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Achievement Card */}
        <motion.div
          className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-auto"
          initial={{ y: -200, scale: 0, rotate: -10 }}
          animate={{ y: 0, scale: 1, rotate: 0 }}
          exit={{ y: -200, scale: 0, rotate: 10 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
        >
          <div className={`relative bg-gradient-to-br ${achievement.color} p-8 rounded-3xl shadow-2xl border-4 border-white max-w-md`}>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl animate-pulse" />
            
            {/* Content */}
            <div className="relative z-10 text-white text-center">
              {/* Icon with Pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="text-8xl mb-4 inline-block drop-shadow-2xl"
              >
                {achievement.icon}
              </motion.div>

              {/* "Achievement Unlocked" Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-bold uppercase tracking-wider mb-2 opacity-90"
              >
                🏆 Achievement Unlocked!
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-3xl font-black mb-2 drop-shadow-lg"
              >
                {achievement.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg opacity-90 mb-4"
              >
                {achievement.description}
              </motion.p>

              {/* Points Earned */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5, type: "spring" }}
                className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full backdrop-blur"
              >
                <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                <span className="text-2xl font-black">+{achievement.points} Points!</span>
              </motion.div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: 360
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sound Effect Indicator */}
        <motion.div
          className="absolute top-8 right-8"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 1 }}
        >
          <div className="text-6xl">🔊</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Achievement Manager Hook
export function useAchievementSystem() {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!currentAchievement && achievementQueue.length > 0) {
      const nextAchievement = achievementQueue[0];
      setCurrentAchievement(nextAchievement);
      setAchievementQueue(prev => prev.slice(1));
    }
  }, [currentAchievement, achievementQueue]);

  const showAchievement = (achievement: Achievement) => {
    setAchievementQueue(prev => [...prev, achievement]);
  };

  const closeAchievement = () => {
    setCurrentAchievement(null);
  };

  return {
    currentAchievement,
    showAchievement,
    closeAchievement
  };
}

// Pre-defined Achievements
export const ACHIEVEMENTS = {
  FIRST_GAME: {
    id: "first-game",
    title: "First Steps!",
    description: "Played your first game",
    icon: "🎮",
    color: "from-blue-500 to-purple-600",
    points: 25
  },
  HIGH_SCORER: {
    id: "high-scorer",
    title: "High Scorer!",
    description: "Beat a high score",
    icon: "🏆",
    color: "from-amber-500 to-orange-600",
    points: 50
  },
  DEDICATED_PLAYER: {
    id: "dedicated-player",
    title: "Dedicated Player",
    description: "Played 10 games",
    icon: "🔥",
    color: "from-red-500 to-pink-600",
    points: 100
  },
  PERFECT_MATCH: {
    id: "perfect-match",
    title: "Perfect Match!",
    description: "Matched 5+ macros in one move",
    icon: "💎",
    color: "from-cyan-500 to-blue-600",
    points: 75
  },
  STREAM_SAVIOR: {
    id: "stream-savior",
    title: "Stream Savior",
    description: "Completed Stream Defender",
    icon: "💧",
    color: "from-teal-500 to-emerald-600",
    points: 150
  },
  COMBO_MASTER: {
    id: "combo-master",
    title: "Combo Master",
    description: "Reached 10x combo",
    icon: "⚡",
    color: "from-yellow-500 to-orange-600",
    points: 100
  },
  LESSON_COMPLETE: {
    id: "lesson-complete",
    title: "Knowledge Seeker",
    description: "Completed a lesson",
    icon: "📚",
    color: "from-indigo-500 to-purple-600",
    points: 30
  },
  FIRST_BADGE: {
    id: "first-badge",
    title: "Badge Collector",
    description: "Earned your first badge",
    icon: "🎖️",
    color: "from-pink-500 to-rose-600",
    points: 40
  },
  CITIZEN_SCIENTIST: {
    id: "citizen-scientist",
    title: "Citizen Scientist",
    description: "Submitted first observation",
    icon: "🔬",
    color: "from-green-500 to-teal-600",
    points: 60
  },
  WEEK_STREAK: {
    id: "week-streak",
    title: "Week Warrior",
    description: "7-day login streak",
    icon: "📅",
    color: "from-violet-500 to-purple-600",
    points: 200
  },
  FISHING_EXPERT: {
    id: "fishing-expert",
    title: "Fishing Expert",
    description: "Learned all fishing techniques",
    icon: "🎣",
    color: "from-blue-600 to-cyan-600",
    points: 150
  },
  CONSERVATION_HERO: {
    id: "conservation-hero",
    title: "Conservation Hero",
    description: "Reached 1000 conservation points",
    icon: "🌟",
    color: "from-amber-600 to-yellow-500",
    points: 500
  }
};

// Floating Points Indicator
export function FloatingPoints({ x, y, points, onComplete }: { x: number; y: number; points: number; onComplete: () => void }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -100, scale: 1.5 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      onAnimationComplete={onComplete}
    >
      <div className="text-3xl font-black text-amber-500 drop-shadow-lg">
        +{points} 🌟
      </div>
    </motion.div>
  );
}

// Level Up Animation
export function LevelUpAnimation({ level, onComplete }: { level: number; onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10 }}
        className="text-center"
      >
        <div className="text-9xl mb-4">🎊</div>
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 mb-4">
          LEVEL UP!
        </div>
        <div className="text-8xl font-black text-white drop-shadow-2xl">
          {level}
        </div>
      </motion.div>

      {/* Explosion Effect */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-yellow-400 rounded-full"
          style={{
            left: "50%",
            top: "50%"
          }}
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            x: Math.cos((i / 20) * Math.PI * 2) * 300,
            y: Math.sin((i / 20) * Math.PI * 2) * 300,
            opacity: 0
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}

