// 🎯 Enhanced Point System with Multipliers and Bonuses

export interface ScoreData {
  baseScore: number;
  combo?: number;
  perfectHits?: number;
  timeBonus?: number;
  difficultyMultiplier?: number;
  streakBonus?: number;
}

export interface PointCalculation {
  total: number;
  breakdown: {
    base: number;
    combo: number;
    perfect: number;
    time: number;
    difficulty: number;
    streak: number;
  };
  multiplier: number;
  badges: string[];
}

export function calculateGamePoints(scoreData: ScoreData, gameType: string): PointCalculation {
  const {
    baseScore,
    combo = 0,
    perfectHits = 0,
    timeBonus = 0,
    difficultyMultiplier = 1,
    streakBonus = 0
  } = scoreData;

  // Base points calculation (varies by game)
  let basePoints = Math.floor(baseScore / 10);

  // Combo multiplier (exponential growth)
  const comboPoints = combo > 1 ? Math.floor(baseScore * (combo * 0.1)) : 0;
  const comboMultiplier = combo > 1 ? 1 + (combo * 0.05) : 1;

  // Perfect hits bonus
  const perfectPoints = perfectHits * 5;

  // Time bonus (rewards quick completion)
  const timeBonusPoints = Math.floor(timeBonus);

  // Difficulty multiplier
  const difficultyPoints = Math.floor(basePoints * (difficultyMultiplier - 1));

  // Streak bonus (consecutive wins)
  const streakPoints = Math.floor(streakBonus * 10);

  // Total multiplier
  const totalMultiplier = comboMultiplier * difficultyMultiplier;

  // Calculate total
  const subtotal = basePoints + comboPoints + perfectPoints + timeBonusPoints + difficultyPoints + streakPoints;
  const total = Math.floor(subtotal * totalMultiplier);

  // Determine earned badges based on performance
  const badges: string[] = [];
  
  if (combo >= 10) badges.push("Combo Master");
  if (perfectHits >= 20) badges.push("Perfectionist");
  if (timeBonus > 100) badges.push("Speed Demon");
  if (total > 500) badges.push("High Scorer");
  if (streakBonus >= 5) badges.push("Unstoppable");
  if (totalMultiplier >= 2) badges.push("Multiplier Maniac");

  return {
    total,
    breakdown: {
      base: basePoints,
      combo: comboPoints,
      perfect: perfectPoints,
      time: timeBonusPoints,
      difficulty: difficultyPoints,
      streak: streakPoints
    },
    multiplier: totalMultiplier,
    badges
  };
}

// Level progression system
export function calculateLevel(totalPoints: number): { level: number; progress: number; nextLevelAt: number } {
  // Exponential level curve
  const level = Math.floor(Math.sqrt(totalPoints / 100)) + 1;
  const currentLevelStart = Math.pow(level - 1, 2) * 100;
  const nextLevelStart = Math.pow(level, 2) * 100;
  const progress = ((totalPoints - currentLevelStart) / (nextLevelStart - currentLevelStart)) * 100;

  return {
    level,
    progress: Math.min(100, Math.max(0, progress)),
    nextLevelAt: nextLevelStart
  };
}

// Achievement unlock thresholds
export const ACHIEVEMENTS = {
  "First Steps": { requirement: "Play your first game", points: 0 },
  "Getting Warmed Up": { requirement: "Score 100 points in a single game", points: 100 },
  "Century Club": { requirement: "Score 1000 total points", points: 1000 },
  "Combo Starter": { requirement: "Achieve a 5x combo", combo: 5 },
  "Combo Master": { requirement: "Achieve a 10x combo", combo: 10 },
  "Perfectionist": { requirement: "Get 20 perfect hits in one game", perfect: 20 },
  "Speed Demon": { requirement: "Complete a game in record time", timeBonus: 100 },
  "High Scorer": { requirement: "Score 500+ points in one game", points: 500 },
  "Game Master": { requirement: "Score 1000+ in any game", points: 1000 },
  "Unstoppable": { requirement: "Win 5 games in a row", streak: 5 },
  "Dedicated Player": { requirement: "Play 10 games", gamesPlayed: 10 },
  "Conservation Hero": { requirement: "Reach level 10", level: 10 },
  "Multiplier Maniac": { requirement: "Achieve 2x total multiplier", multiplier: 2 }
};

// Streak management
export class StreakManager {
  private streaks: Map<string, number> = new Map();
  private lastGame: Map<string, string> = new Map();

  updateStreak(gameId: string, won: boolean): number {
    if (won) {
      const current = this.streaks.get(gameId) || 0;
      this.streaks.set(gameId, current + 1);
      this.lastGame.set(gameId, 'win');
    } else {
      this.streaks.set(gameId, 0);
      this.lastGame.set(gameId, 'loss');
    }
    return this.streaks.get(gameId) || 0;
  }

  getStreak(gameId: string): number {
    return this.streaks.get(gameId) || 0;
  }

  getTotalStreak(): number {
    return Array.from(this.streaks.values()).reduce((sum, val) => sum + val, 0);
  }
}

// Points tier system
export function getPointsTier(points: number): { tier: string; color: string; emoji: string } {
  if (points >= 1000) return { tier: "LEGENDARY", color: "from-purple-500 to-pink-500", emoji: "👑" };
  if (points >= 500) return { tier: "EPIC", color: "from-orange-500 to-red-500", emoji: "🔥" };
  if (points >= 200) return { tier: "RARE", color: "from-blue-500 to-cyan-500", emoji: "⭐" };
  if (points >= 50) return { tier: "UNCOMMON", color: "from-green-500 to-emerald-500", emoji: "✨" };
  return { tier: "COMMON", color: "from-slate-400 to-slate-500", emoji: "🎮" };
}

// Conservation-themed rank names
export function getConservationRank(level: number): { rank: string; title: string } {
  if (level >= 50) return { rank: "Conservation Legend", title: "Ecosystem Guardian" };
  if (level >= 40) return { rank: "Wildlife Protector", title: "Stream Defender" };
  if (level >= 30) return { rank: "Habitat Hero", title: "Watershed Champion" };
  if (level >= 20) return { rank: "Water Quality Expert", title: "Macro Master" };
  if (level >= 10) return { rank: "Trout Advocate", title: "Stream Steward" };
  if (level >= 5) return { rank: "Fish Friend", title: "Ecosystem Explorer" };
  return { rank: "Conservation Cadet", title: "Nature Newbie" };
}

