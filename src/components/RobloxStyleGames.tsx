// 🎮 ROBLOX-STYLE GAMES - Super Engaging Interactive Games
// Trout Rush • Macro Match Blast • Stream Defender • Water Quality Hero • Nitrogen Racer

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Trophy,
  Star,
  Zap,
  Heart,
  Target,
  Award,
  TrendingUp,
  Sparkles,
  Flame,
  Crown
} from "lucide-react";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { ControllerInstructions, PRESET_CONTROLS } from "./ControllerInstructions";
import { calculateGamePoints, calculateLevel, getPointsTier, getConservationRank } from "../utils/gamePoints";
import { TroutTower } from "./TroutTower";

interface GameStats {
  gamesPlayed: number;
  highScores: Record<string, number>;
  achievements: string[];
  totalPoints: number;
}

export function RobloxStyleGames({
  onEarnPoints,
  onEarnBadge
}: {
  onEarnPoints?: (points: number) => void;
  onEarnBadge?: (badge: string) => void;
}) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    highScores: {},
    achievements: [],
    totalPoints: 0
  });

  function recordScore(gameId: string, score: number, earnedPoints: number) {
    const isHighScore = !stats.highScores[gameId] || score > stats.highScores[gameId];
    
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      highScores: {
        ...prev.highScores,
        [gameId]: Math.max(prev.highScores[gameId] || 0, score)
      },
      totalPoints: prev.totalPoints + earnedPoints
    }));

    onEarnPoints?.(earnedPoints);

    if (isHighScore && score > 1000) {
      onEarnBadge?.("game-master");
    }

    if (stats.gamesPlayed + 1 >= 10) {
      onEarnBadge?.("dedicated-player");
    }
  }

  if (selectedGame) {
    return (
      <GameWrapper
        gameId={selectedGame}
        onBack={() => setSelectedGame(null)}
        onGameEnd={recordScore}
        highScore={stats.highScores[selectedGame] || 0}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 animate-gradient-x" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        
        <div className="relative p-8 text-white text-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block text-6xl mb-4"
          >
            🎮
          </motion.div>
          <h1 className="text-4xl font-black mb-2 drop-shadow-lg">CONSERVATION ARCADE</h1>
          <p className="text-xl opacity-90 drop-shadow">Learn by playing! Earn points, beat high scores, unlock achievements!</p>
          
          <div className="mt-6 flex justify-center gap-6">
            <StatBubble icon={<Trophy className="h-6 w-6" />} label="Games Played" value={stats.gamesPlayed} />
            <StatBubble icon={<Star className="h-6 w-6" />} label="Total Points" value={stats.totalPoints} />
            <StatBubble icon={<Award className="h-6 w-6" />} label="Achievements" value={stats.achievements.length} />
          </div>
        </div>
      </motion.div>

      {/* Featured Game - Trout Tower */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="rounded-3xl border-4 border-yellow-400 shadow-2xl overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-yellow-600 animate-pulse" />
              <div>
                <div className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Premier Game</div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                  TROUT TOWER
                </h3>
              </div>
              <div className="ml-auto">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg px-4 py-2">
                  🏆 NEW!
                </Badge>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-700 mb-4 text-lg">
                  <strong>Icy Tower style vertical platformer!</strong> Jump, build momentum, and climb as high as you can. Master the physics, land perfect jumps, and break combo records!
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Physics-Based:</strong> Hold jump for higher jumps, build momentum</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Combo System:</strong> Chain jumps for speed boosts & power jumps</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Perfect Landings:</strong> Nail platform centers for bonus points</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border-2 border-yellow-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-700">Difficulty</span>
                    <Badge className="bg-orange-500">Medium</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-700">Points Range</span>
                    <span className="text-lg font-bold text-orange-600">50-500+</span>
                  </div>
                  {stats.highScores["trout-tower"] > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t border-yellow-200">
                      <span className="font-semibold text-slate-700">Your Best</span>
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                        {stats.highScores["trout-tower"]}
                      </span>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={() => setSelectedGame("trout-tower")}
                  className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white text-xl py-6 font-black shadow-xl"
                >
                  🎮 PLAY NOW! 🎮
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Game Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard
          id="trout-rush"
          title="🐟 Trout Rush"
          description="Endless runner! Eat food, dodge pollution, collect power-ups!"
          difficulty="Easy"
          points="5-50"
          color="from-blue-500 to-cyan-500"
          highScore={stats.highScores["trout-rush"]}
          onPlay={() => setSelectedGame("trout-rush")}
        />

        <GameCard
          id="macro-blast"
          title="🐛 Macro Match Blast"
          description="Match 3+ macros! Chain combos for mega points!"
          difficulty="Medium"
          points="10-100"
          color="from-emerald-500 to-green-500"
          highScore={stats.highScores["macro-blast"]}
          onPlay={() => setSelectedGame("macro-blast")}
        />

        <GameCard
          id="stream-defender"
          title="💧 Stream Defender"
          description="Tower defense! Protect your stream from pollution!"
          difficulty="Hard"
          points="20-200"
          color="from-purple-500 to-pink-500"
          highScore={stats.highScores["stream-defender"]}
          onPlay={() => setSelectedGame("stream-defender")}
        />

        <GameCard
          id="water-hero"
          title="🧪 Water Quality Hero"
          description="Rhythm game! Test water at the perfect time!"
          difficulty="Medium"
          points="15-150"
          color="from-amber-500 to-orange-500"
          highScore={stats.highScores["water-hero"]}
          onPlay={() => setSelectedGame("water-hero")}
        />

        <GameCard
          id="nitrogen-racer"
          title="⚡ Nitrogen Cycle Racer"
          description="Race through the nitrogen cycle! Collect atoms!"
          difficulty="Easy"
          points="10-80"
          color="from-red-500 to-rose-500"
          highScore={stats.highScores["nitrogen-racer"]}
          onPlay={() => setSelectedGame("nitrogen-racer")}
        />

        <GameCard
          id="knot-master"
          title="🪢 Knot Speed Challenge"
          description="Tie knots fast! Beat the clock!"
          difficulty="Hard"
          points="25-250"
          color="from-indigo-500 to-violet-500"
          highScore={stats.highScores["knot-master"]}
          onPlay={() => setSelectedGame("knot-master")}
        />
      </div>

      {/* Achievement Showcase */}
      <Card className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-600" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.achievements.length === 0 ? (
            <p className="text-center text-slate-600 py-8">
              Play games to unlock achievements! 🏆
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {stats.achievements.map((achievement, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: i * 0.1 }}
                >
                  <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500">
                    {achievement}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatBubble({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center min-w-[120px]"
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </motion.div>
  );
}

function GameCard({
  id,
  title,
  description,
  difficulty,
  points,
  color,
  highScore,
  onPlay
}: {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: string;
  color: string;
  highScore?: number;
  onPlay: () => void;
}) {
  const difficultyColors = {
    Easy: "bg-emerald-500",
    Medium: "bg-amber-500",
    Hard: "bg-red-500"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white cursor-pointer h-full" onClick={onPlay}>
        <div className={`h-32 bg-gradient-to-br ${color} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
          {highScore && highScore > 0 && (
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            >
              ⭐ {highScore}
            </motion.div>
          )}
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={`${difficultyColors[difficulty as keyof typeof difficultyColors]} text-white`}>
              {difficulty}
            </Badge>
            <div className="text-sm font-semibold text-emerald-600">
              {points} pts
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6">
            <Gamepad2 className="h-5 w-5 mr-2" />
            PLAY NOW!
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Game Wrapper Component
function GameWrapper({
  gameId,
  onBack,
  onGameEnd,
  highScore
}: {
  gameId: string;
  onBack: () => void;
  onGameEnd: (gameId: string, score: number, points: number) => void;
  highScore: number;
}) {
  const games = {
    "trout-tower": TroutTower,
    "trout-rush": TroutRushGame,
    "macro-blast": MacroBlastGame,
    "stream-defender": StreamDefenderGame,
    "water-hero": WaterQualityHeroGame,
    "nitrogen-racer": NitrogenRacerGame,
    "knot-master": KnotMasterGame
  };

  const GameComponent = games[gameId as keyof typeof games] || TroutTower;

  return (
    <div className="min-h-[600px]">
      <GameComponent
        onBack={onBack}
        onGameEnd={(score, points) => onGameEnd(gameId, score, points)}
        highScore={highScore}
      />
    </div>
  );
}

// GAME 1: TROUT RUSH - Endless Runner
function TroutRushGame({
  onBack,
  onGameEnd,
  highScore
}: {
  onBack: () => void;
  onGameEnd: (score: number, points: number) => void;
  highScore: number;
}) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [troutPosition, setTroutPosition] = useState(50);
  const [obstacles, setObstacles] = useState<Array<{ id: number; x: number; y: number; type: "food" | "pollution" | "powerup" }>>([]);
  const [combo, setCombo] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const gameLoopRef = useRef<number>();
  const nextIdRef = useRef(0);
  const startTimeRef = useRef<number>(0);

  const jump = useCallback(() => {
    if (gameState === "playing" && troutPosition === 50) {
      setTroutPosition(20);
      setTimeout(() => setTroutPosition(50), 500);
    } else if (gameState === "playing" && troutPosition === 20) {
      setTroutPosition(50);
    }
  }, [gameState, troutPosition]);

  // Enhanced keyboard controls
  useKeyboardControls({
    enabled: !showInstructions,
    onKeyPress: (action) => {
      if (action === "action" || action === "up") {
        if (gameState === "ready") {
          startTimeRef.current = Date.now();
          setGameState("playing");
        } else if (gameState === "playing") {
          jump();
        }
      }
    }
  });

  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      // Move obstacles
      setObstacles(prev => {
        const moved = prev.map(obs => ({ ...obs, x: obs.x - 5 }));
        
        // Check collisions
        moved.forEach(obs => {
          if (obs.x < 55 && obs.x > 45 && Math.abs(obs.y - troutPosition) < 15) {
            if (obs.type === "food") {
              setScore(s => s + 10);
              setCombo(c => c + 1);
            } else if (obs.type === "pollution") {
              setLives(l => l - 1);
              setCombo(0);
            } else if (obs.type === "powerup") {
              setScore(s => s + 50);
              setLives(l => Math.min(3, l + 1));
            }
          }
        });

        // Remove off-screen obstacles
        const filtered = moved.filter(obs => obs.x > -10);

        // Add new obstacles
        if (Math.random() < 0.05) {
          const type = Math.random() < 0.6 ? "food" : Math.random() < 0.8 ? "pollution" : "powerup";
          filtered.push({
            id: nextIdRef.current++,
            x: 100,
            y: Math.random() < 0.5 ? 50 : 20,
            type
          });
        }

        return filtered;
      });

      setScore(s => s + combo);
    }, 50);

    gameLoopRef.current = gameLoop as unknown as number;

    return () => clearInterval(gameLoop);
  }, [gameState, troutPosition, combo]);

  useEffect(() => {
    if (lives <= 0 && gameState === "playing") {
      setGameState("gameover");
      const playTime = Date.now() - startTimeRef.current;
      const timeBonus = Math.max(0, 300 - Math.floor(playTime / 1000));
      
      const pointCalc = calculateGamePoints({
        baseScore: score,
        combo,
        perfectHits,
        timeBonus,
        difficultyMultiplier: 1.0
      }, "trout-rush");
      
      onGameEnd(score, pointCalc.total);
    }
  }, [lives, gameState, score, combo, perfectHits, onGameEnd]);

  return (
    <div className="relative">
      {showInstructions && (
        <ControllerInstructions
          gameName="TROUT RUSH"
          icon="🐟"
          controls={[
            { action: "Jump / Switch Lane", keys: ["SPACE", "↑", "W"], description: "Move between lanes" },
            { action: "Start Game", keys: ["SPACE"], description: "Begin playing" }
          ]}
          tips={[
            "Collect 🦐 food for +10 points each",
            "Avoid ☠️ pollution or lose a life",
            "Grab ⭐ power-ups for +50 points and health restore",
            "Build combos by collecting food consecutively",
            "Each combo level adds bonus points per second!"
          ]}
          onStart={() => setShowInstructions(false)}
        />
      )}

      <Card className="rounded-3xl border-4 border-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-b from-sky-400 to-blue-600 p-6">
          <div className="flex items-center justify-between text-white mb-4">
            <Button onClick={onBack} variant="outline" className="text-white border-white">
              ← Back
            </Button>
            <div className="flex gap-6 text-2xl font-black">
              <div>Score: {score}</div>
              <div className="flex gap-1">
                {Array.from({ length: lives }).map((_, i) => (
                  <Heart key={i} className="h-6 w-6 fill-red-500 text-red-500" />
                ))}
              </div>
            </div>
            <div className="text-sm">High: {highScore}</div>
          </div>

          {combo > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              className="text-center text-white text-3xl font-black mb-2"
            >
              🔥 COMBO x{combo}!
            </motion.div>
          )}

          {/* Game Area */}
          <div 
            className="relative h-96 bg-gradient-to-b from-sky-300 to-blue-400 rounded-2xl overflow-hidden cursor-pointer border-4 border-white/30"
            onClick={jump}
          >
            {/* Water effect */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0id2F2ZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDUwIFEgMjUgNDAgNTAgNTAgVCAxMDAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiBzdHJva2Utd2lkdGg9IjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd2F2ZSkiLz48L3N2Zz4=')] opacity-40 animate-scroll" />

            {/* Trout */}
            <motion.div
              animate={{ y: `${troutPosition}%` }}
              transition={{ type: "spring", damping: 10 }}
              className="absolute left-[50px] w-16 h-16 text-6xl z-10"
              style={{ top: 0 }}
            >
              🐟
            </motion.div>

            {/* Obstacles */}
            {obstacles.map(obs => (
              <motion.div
                key={obs.id}
                className="absolute w-12 h-12 text-5xl"
                style={{
                  left: `${obs.x}%`,
                  top: `${obs.y}%`
                }}
              >
                {obs.type === "food" ? "🦐" : obs.type === "pollution" ? "☠️" : "⭐"}
              </motion.div>
            ))}

            {/* Start overlay */}
            {gameState === "ready" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">🐟</div>
                  <div className="text-white text-4xl font-black mb-4">TROUT RUSH!</div>
                  <div className="text-white text-xl mb-6">Click or press SPACE to jump!</div>
                  <div className="text-white text-sm">
                    Collect 🦐 food (+10) • Avoid ☠️ pollution (-1 life) • Grab ⭐ power-ups (+50)
                  </div>
                </motion.div>
              </div>
            )}

            {/* Game Over overlay */}
            {gameState === "gameover" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring" }}
                    className="text-8xl mb-4"
                  >
                    {score > highScore ? "🏆" : "💀"}
                  </motion.div>
                  <div className="text-white text-5xl font-black mb-4">
                    {score > highScore ? "NEW HIGH SCORE!" : "GAME OVER!"}
                  </div>
                  <div className="text-white text-3xl mb-2">Score: {score}</div>
                  <div className="text-white text-xl mb-6">Earned: {Math.floor(score / 10)} points!</div>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => {
                      setGameState("ready");
                      setScore(0);
                      setLives(3);
                      setCombo(0);
                      setObstacles([]);
                    }} className="bg-emerald-600 hover:bg-emerald-700 text-xl px-8 py-6">
                      Play Again!
                    </Button>
                    <Button onClick={onBack} variant="outline" className="text-white border-white text-xl px-8 py-6">
                      Back to Games
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="text-center text-white mt-4 text-sm">
            💡 Build combos by collecting food in a row! Each combo = extra points per second!
          </div>
        </div>
      </Card>
    </div>
  );
}

// GAME 2: MACRO MATCH BLAST - Match-3 Puzzle Game
function MacroBlastGame({
  onBack,
  onGameEnd,
  highScore
}: {
  onBack: () => void;
  onGameEnd: (score: number, points: number) => void;
  highScore: number;
}) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<{row: number; col: number} | null>(null);
  const [combo, setCombo] = useState(0);
  const [targetScore] = useState(500);

  const macros = ["🦟", "🐛", "🪰", "🦗", "🐜", "🪲"]; // Different macroinvertebrates

  // Initialize grid
  useEffect(() => {
    if (gameState === "playing" && grid.length === 0) {
      setGrid(createGrid());
    }
  }, [gameState]);

  function createGrid(): string[][] {
    const newGrid: string[][] = [];
    for (let i = 0; i < 8; i++) {
      newGrid[i] = [];
      for (let j = 0; j < 8; j++) {
        newGrid[i][j] = macros[Math.floor(Math.random() * macros.length)];
      }
    }
    return newGrid;
  }

  function handleCellClick(row: number, col: number) {
    if (gameState !== "playing") return;

    if (!selected) {
      setSelected({ row, col });
    } else {
      // Check if adjacent
      const isAdjacent = 
        (Math.abs(selected.row - row) === 1 && selected.col === col) ||
        (Math.abs(selected.col - col) === 1 && selected.row === row);

      if (isAdjacent) {
        // Swap tiles
        const newGrid = grid.map(r => [...r]);
        [newGrid[row][col], newGrid[selected.row][selected.col]] = 
        [newGrid[selected.row][selected.col], newGrid[row][col]];

        // Check for matches
        const matches = findMatches(newGrid);
        if (matches.length > 0) {
          processMatches(newGrid, matches);
          setMoves(m => m - 1);
          setCombo(c => c + 1);
        } else {
          // Swap back if no match
          [newGrid[row][col], newGrid[selected.row][selected.col]] = 
          [newGrid[selected.row][selected.col], newGrid[row][col]];
        }
        setGrid(newGrid);
        setSelected(null);
      } else {
        setSelected({ row, col });
      }
    }
  }

  function findMatches(grid: string[][]): Array<{row: number; col: number}> {
    const matches: Array<{row: number; col: number}> = [];
    
    // Check horizontal matches
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 6; j++) {
        if (grid[i][j] === grid[i][j+1] && grid[i][j] === grid[i][j+2]) {
          matches.push({row: i, col: j}, {row: i, col: j+1}, {row: i, col: j+2});
        }
      }
    }

    // Check vertical matches
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 8; j++) {
        if (grid[i][j] === grid[i+1][j] && grid[i][j] === grid[i+2][j]) {
          matches.push({row: i, col: j}, {row: i+1, col: j}, {row: i+2, col: j});
        }
      }
    }

    // Remove duplicates
    return matches.filter((match, index, self) =>
      index === self.findIndex(m => m.row === match.row && m.col === match.col)
    );
  }

  function processMatches(grid: string[][], matches: Array<{row: number; col: number}>) {
    const matchCount = matches.length;
    const points = matchCount * 10 * (combo + 1);
    setScore(s => s + points);

    // Clear matched tiles
    matches.forEach(match => {
      grid[match.row][match.col] = "";
    });

    // Drop tiles and fill empty spaces
    setTimeout(() => {
      fillGrid(grid);
    }, 300);
  }

  function fillGrid(grid: string[][]) {
    // Drop existing tiles
    for (let col = 0; col < 8; col++) {
      let emptyRow = 7;
      for (let row = 7; row >= 0; row--) {
        if (grid[row][col] !== "") {
          if (row !== emptyRow) {
            grid[emptyRow][col] = grid[row][col];
            grid[row][col] = "";
          }
          emptyRow--;
        }
      }
    }

    // Fill empty spaces with new tiles
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (grid[i][j] === "") {
          grid[i][j] = macros[Math.floor(Math.random() * macros.length)];
        }
      }
    }

    setGrid([...grid]);

    // Check for new matches
    const newMatches = findMatches(grid);
    if (newMatches.length > 0) {
      setTimeout(() => processMatches(grid, newMatches), 500);
    } else {
      setCombo(0);
    }
  }

  useEffect(() => {
    if (moves <= 0 && gameState === "playing") {
      setGameState("gameover");
      const earnedPoints = Math.floor(score / 20);
      onGameEnd(score, earnedPoints);
    }
  }, [moves, gameState]);

  const progress = Math.min(100, (score / targetScore) * 100);

  return (
    <div className="relative">
      <Card className="rounded-3xl border-4 border-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-b from-emerald-400 to-green-600 p-6">
          <div className="flex items-center justify-between text-white mb-4">
            <Button onClick={onBack} variant="outline" className="text-white border-white">
              ← Back
            </Button>
            <div className="flex gap-6 text-xl font-black">
              <div>Score: {score}</div>
              <div>Moves: {moves}</div>
            </div>
            <div className="text-sm">High: {highScore}</div>
          </div>

          {combo > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              className="text-center text-white text-3xl font-black mb-2"
            >
              🔥 COMBO x{combo}!
            </motion.div>
          )}

          {/* Progress to target */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white mb-1">
              <span>Target: {targetScore}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Game Grid */}
          <div 
            className="grid grid-cols-8 gap-1 bg-white/20 p-2 rounded-2xl"
            style={{ width: "min(500px, 90vw)", margin: "0 auto" }}
          >
            {gameState === "ready" && (
              <div className="col-span-8 text-center py-20 bg-black/50 rounded-xl">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-white"
                >
                  <div className="text-6xl mb-4">🐛</div>
                  <div className="text-4xl font-black mb-4">MACRO MATCH BLAST!</div>
                  <div className="text-xl mb-6">Match 3 or more macroinvertebrates!</div>
                  <Button
                    onClick={() => setGameState("playing")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-2xl px-8 py-6"
                  >
                    START!
                  </Button>
                </motion.div>
              </div>
            )}

            {gameState === "playing" && grid.map((row, i) =>
              row.map((cell, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCellClick(i, j)}
                  className={`aspect-square bg-white rounded-lg flex items-center justify-center text-3xl cursor-pointer border-4 ${
                    selected?.row === i && selected?.col === j ? "border-yellow-400" : "border-white/50"
                  }`}
                >
                  {cell}
                </motion.div>
              ))
            )}

            {gameState === "gameover" && (
              <div className="col-span-8 text-center py-12 bg-black/80 rounded-xl">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring" }}
                  className="text-8xl mb-4"
                >
                  {score >= targetScore ? "🏆" : score > highScore ? "⭐" : "🐛"}
                </motion.div>
                <div className="text-white text-5xl font-black mb-4">
                  {score >= targetScore ? "TARGET REACHED!" : score > highScore ? "NEW HIGH SCORE!" : "GAME OVER!"}
                </div>
                <div className="text-white text-3xl mb-2">Score: {score}</div>
                <div className="text-white text-xl mb-6">Earned: {Math.floor(score / 20)} points!</div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => {
                    setGameState("ready");
                    setScore(0);
                    setMoves(30);
                    setGrid([]);
                    setCombo(0);
                    setSelected(null);
                  }} className="bg-emerald-600 hover:bg-emerald-700 text-xl px-8 py-6">
                    Play Again!
                  </Button>
                  <Button onClick={onBack} variant="outline" className="text-white border-white text-xl px-8 py-6">
                    Back to Games
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-white mt-4 text-sm">
            💡 Match 3+ macros! Longer matches = more points! Build combos for multipliers!
          </div>
        </div>
      </Card>
    </div>
  );
}

// GAME 3: STREAM DEFENDER - Tower Defense Game
function StreamDefenderGame({
  onBack,
  onGameEnd,
  highScore
}: {
  onBack: () => void;
  onGameEnd: (score: number, points: number) => void;
  highScore: number;
}) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover" | "victory">("ready");
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(200);
  const [health, setHealth] = useState(100);
  const [wave, setWave] = useState(0);
  const [enemies, setEnemies] = useState<Array<{id: number; x: number; y: number; health: number; type: string}>>([]);
  const [towers, setTowers] = useState<Array<{x: number; y: number; type: string; level: number}>>([]);
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const nextEnemyId = useRef(0);

  const towerTypes = {
    mayfly: { cost: 50, damage: 10, range: 100, speed: 500, emoji: "🦟", name: "Mayfly" },
    stonefly: { cost: 100, damage: 25, range: 80, speed: 1000, emoji: "🪨", name: "Stonefly" },
    caddisfly: { cost: 150, damage: 50, range: 150, speed: 1500, emoji: "🪰", name: "Caddisfly" }
  };

  const enemyTypes = {
    oil: { health: 50, speed: 2, reward: 20, emoji: "🛢️" },
    trash: { health: 100, speed: 1.5, reward: 30, emoji: "🗑️" },
    chemical: { health: 150, speed: 1, reward: 50, emoji: "☣️" }
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      // Move enemies
      setEnemies(prev => {
        const moved = prev.map(enemy => ({
          ...enemy,
          y: enemy.y + (enemyTypes[enemy.type as keyof typeof enemyTypes]?.speed || 1)
        }));

        // Check if enemies reached bottom
        moved.forEach(enemy => {
          if (enemy.y > 500) {
            setHealth(h => Math.max(0, h - 10));
          }
        });

        // Remove enemies that reached bottom or are dead
        return moved.filter(enemy => enemy.y < 500 && enemy.health > 0);
      });

      // Tower attacks
      towers.forEach((tower, towerIndex) => {
        const towerType = towerTypes[tower.type as keyof typeof towerTypes];
        if (!towerType) return;

        setEnemies(prevEnemies => {
          const newEnemies = [...prevEnemies];
          
          // Find nearest enemy in range
          let nearestEnemy = null;
          let minDistance = Infinity;

          newEnemies.forEach((enemy, index) => {
            const dx = tower.x - enemy.x;
            const dy = tower.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < towerType.range && distance < minDistance) {
              minDistance = distance;
              nearestEnemy = { enemy, index };
            }
          });

          if (nearestEnemy) {
            newEnemies[nearestEnemy.index].health -= towerType.damage;
            
            // If enemy died, give rewards
            if (newEnemies[nearestEnemy.index].health <= 0) {
              const enemyType = enemyTypes[newEnemies[nearestEnemy.index].type as keyof typeof enemyTypes];
              setMoney(m => m + (enemyType?.reward || 20));
              setScore(s => s + (enemyType?.reward || 20) * 10);
            }
          }

          return newEnemies;
        });
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameState, towers]);

  useEffect(() => {
    if (health <= 0 && gameState === "playing") {
      setGameState("gameover");
      const earnedPoints = Math.floor(score / 10);
      onGameEnd(score, earnedPoints);
    }
  }, [health, gameState]);

  function startWave() {
    const waveNum = wave + 1;
    setWave(waveNum);

    const enemyCount = 5 + waveNum * 2;
    const newEnemies: typeof enemies = [];

    for (let i = 0; i < enemyCount; i++) {
      const types = Object.keys(enemyTypes);
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      newEnemies.push({
        id: nextEnemyId.current++,
        x: 50 + Math.random() * 400,
        y: -50 - i * 30,
        health: enemyTypes[randomType as keyof typeof enemyTypes].health,
        type: randomType
      });
    }

    setEnemies(prev => [...prev, ...newEnemies]);

    if (waveNum >= 10) {
      setGameState("victory");
      const earnedPoints = Math.floor(score / 5);
      onGameEnd(score, earnedPoints);
    }
  }

  function placeTower(x: number, y: number) {
    if (!selectedTower || gameState !== "playing") return;

    const towerType = towerTypes[selectedTower as keyof typeof towerTypes];
    if (!towerType || money < towerType.cost) return;

    setTowers(prev => [...prev, { x, y, type: selectedTower, level: 1 }]);
    setMoney(m => m - towerType.cost);
    setSelectedTower(null);
  }

  return (
    <div className="relative">
      <Card className="rounded-3xl border-4 border-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-b from-purple-400 to-pink-600 p-6">
          <div className="flex items-center justify-between text-white mb-4">
            <Button onClick={onBack} variant="outline" className="text-white border-white">
              ← Back
            </Button>
            <div className="flex gap-4 text-lg font-black">
              <div>💰 {money}</div>
              <div>❤️ {health}%</div>
              <div>🌊 Wave {wave}</div>
            </div>
            <div className="text-sm">High: {highScore}</div>
          </div>

          {/* Game Board */}
          <div className="relative bg-gradient-to-b from-blue-300 to-blue-500 rounded-2xl overflow-hidden"
            style={{ width: "min(500px, 90vw)", height: "500px", margin: "0 auto" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              placeTower(x, y);
            }}
          >
            {gameState === "ready" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-center text-white"
                >
                  <div className="text-6xl mb-4">💧</div>
                  <div className="text-4xl font-black mb-4">STREAM DEFENDER!</div>
                  <div className="text-xl mb-6">Protect the stream from pollution!</div>
                  <Button
                    onClick={() => {
                      setGameState("playing");
                      startWave();
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-2xl px-8 py-6"
                  >
                    START DEFENSE!
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Towers */}
            {towers.map((tower, i) => (
              <div
                key={i}
                className="absolute text-4xl"
                style={{ left: tower.x - 20, top: tower.y - 20 }}
              >
                {towerTypes[tower.type as keyof typeof towerTypes]?.emoji}
              </div>
            ))}

            {/* Enemies */}
            {enemies.map(enemy => (
              <motion.div
                key={enemy.id}
                className="absolute text-3xl"
                style={{ left: enemy.x - 15, top: enemy.y - 15 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {enemyTypes[enemy.type as keyof typeof enemyTypes]?.emoji}
                <div className="absolute -top-2 left-0 w-full">
                  <div className="h-1 bg-red-600" style={{ width: `${(enemy.health / enemyTypes[enemy.type as keyof typeof enemyTypes]?.health) * 100}%` }} />
                </div>
              </motion.div>
            ))}

            {(gameState === "gameover" || gameState === "victory") && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring" }}
                  className="text-center text-white"
                >
                  <div className="text-8xl mb-4">{gameState === "victory" ? "🏆" : "💀"}</div>
                  <div className="text-5xl font-black mb-4">
                    {gameState === "victory" ? "STREAM SAVED!" : "STREAM POLLUTED!"}
                  </div>
                  <div className="text-3xl mb-2">Score: {score}</div>
                  <div className="text-xl mb-6">Earned: {Math.floor(score / (gameState === "victory" ? 5 : 10))} points!</div>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => {
                      setGameState("ready");
                      setScore(0);
                      setMoney(200);
                      setHealth(100);
                      setWave(0);
                      setEnemies([]);
                      setTowers([]);
                    }} className="bg-purple-600 hover:bg-purple-700 text-xl px-8 py-6">
                      Play Again!
                    </Button>
                    <Button onClick={onBack} variant="outline" className="text-white border-white text-xl px-8 py-6">
                      Back to Games
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Tower Selection */}
          {gameState === "playing" && (
            <div className="mt-4 flex gap-3 justify-center flex-wrap">
              {Object.entries(towerTypes).map(([key, tower]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedTower(key)}
                  disabled={money < tower.cost}
                  className={`${selectedTower === key ? "ring-4 ring-yellow-400" : ""} bg-white/20 hover:bg-white/30`}
                >
                  <span className="text-2xl mr-2">{tower.emoji}</span>
                  <div className="text-left">
                    <div className="font-bold">{tower.name}</div>
                    <div className="text-xs">💰 {tower.cost}</div>
                  </div>
                </Button>
              ))}
              <Button
                onClick={startWave}
                disabled={enemies.length > 0}
                className="bg-emerald-600 hover:bg-emerald-700 font-black"
              >
                🌊 NEXT WAVE
              </Button>
            </div>
          )}

          <div className="text-center text-white mt-4 text-sm">
            💡 Click to place towers! Each macro filters different pollution types!
          </div>
        </div>
      </Card>
    </div>
  );
}

function WaterQualityHeroGame(props: any) {
  return <div className="text-center py-20 text-2xl">🧪 Water Quality Hero - Coming soon!</div>;
}

function NitrogenRacerGame(props: any) {
  return <div className="text-center py-20 text-2xl">⚡ Nitrogen Cycle Racer - Coming soon!</div>;
}

function KnotMasterGame(props: any) {
  return <div className="text-center py-20 text-2xl">🪢 Knot Speed Challenge - Coming soon!</div>;
}

