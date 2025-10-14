// 🐟 TROUT TOWER - Icy Tower Style Vertical Platformer
// Physics-based jumping, momentum building, combo system

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, TrendingUp, Crown } from "lucide-react";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { ControllerInstructions } from "./ControllerInstructions";
import { calculateGamePoints } from "../utils/gamePoints";

interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'spring' | 'ice' | 'moving';
}

interface Player {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  onGround: boolean;
}

interface GameState {
  player: Player;
  platforms: Platform[];
  camera: number;
  score: number;
  height: number;
  combo: number;
  maxCombo: number;
  perfectJumps: number;
  gameState: 'instructions' | 'ready' | 'playing' | 'gameover';
  highScore: number;
}

export function TroutTower({
  onBack,
  onGameEnd,
  highScore: initialHighScore
}: {
  onBack: () => void;
  onGameEnd: (score: number, points: number) => void;
  highScore: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  
  const [state, setState] = useState<GameState>({
    player: {
      x: 300,
      y: 500,
      velocityX: 0,
      velocityY: 0,
      isJumping: false,
      onGround: false
    },
    platforms: [],
    camera: 0,
    score: 0,
    height: 0,
    combo: 0,
    maxCombo: 0,
    perfectJumps: 0,
    gameState: 'instructions',
    highScore: initialHighScore
  });

  // Physics constants (tuned for smooth Icy Tower feel)
  const GRAVITY = 0.6;
  const JUMP_POWER = -15;
  const JUMP_POWER_BOOST = -18; // With combo
  const MAX_JUMP_HOLD = 8; // Frames to hold jump for higher jump
  const MOVE_SPEED = 6;
  const AIR_CONTROL = 0.3;
  const FRICTION = 0.85;
  const COMBO_SPEED_BOOST = 1.2;
  const PLATFORM_WIDTH = 150;
  const PLATFORM_MIN_GAP = 80;
  const PLATFORM_MAX_GAP = 180;
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 700;

  // Generate initial platforms
  const generatePlatforms = useCallback((): Platform[] => {
    const platforms: Platform[] = [];
    let currentY = CANVAS_HEIGHT - 50;
    
    // Starting platform (floor)
    platforms.push({
      id: 0,
      x: 0,
      y: currentY,
      width: CANVAS_WIDTH,
      type: 'normal'
    });

    // Generate platforms going up
    for (let i = 1; i < 100; i++) {
      currentY -= PLATFORM_MIN_GAP + Math.random() * (PLATFORM_MAX_GAP - PLATFORM_MIN_GAP);
      const xPos = Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH);
      const platformType = Math.random();
      
      platforms.push({
        id: i,
        x: xPos,
        y: currentY,
        width: PLATFORM_WIDTH - (i * 0.5), // Platforms get narrower as you go higher
        type: platformType < 0.7 ? 'normal' : platformType < 0.85 ? 'spring' : platformType < 0.95 ? 'ice' : 'moving'
      });
    }

    return platforms;
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      player: {
        x: 300,
        y: 500,
        velocityX: 0,
        velocityY: 0,
        isJumping: false,
        onGround: false
      },
      platforms: generatePlatforms(),
      camera: 0,
      score: 0,
      height: 0,
      combo: 0,
      maxCombo: 0,
      perfectJumps: 0,
      gameState: 'playing'
    }));
    startTimeRef.current = Date.now();
  }, [generatePlatforms]);

  // Keyboard controls
  useKeyboardControls({
    enabled: state.gameState === 'playing',
    onKeyDown: (action) => {
      if (action === 'left') keysPressed.current.add('left');
      if (action === 'right') keysPressed.current.add('right');
      if (action === 'action' || action === 'up') keysPressed.current.add('jump');
    },
    onKeyUp: (action) => {
      if (action === 'left') keysPressed.current.delete('left');
      if (action === 'right') keysPressed.current.delete('right');
      if (action === 'action' || action === 'up') keysPressed.current.delete('jump');
    }
  });

  // Main game loop
  useEffect(() => {
    if (state.gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let jumpHoldFrames = 0;
    let lastPlatformId = -1;

    const gameLoop = () => {
      setState(prevState => {
        let newState = { ...prevState };
        let player = { ...newState.player };

        // Input handling
        const moveLeft = keysPressed.current.has('left');
        const moveRight = keysPressed.current.has('right');
        const jumpPressed = keysPressed.current.has('jump');

        // Horizontal movement
        const speedMultiplier = newState.combo > 3 ? COMBO_SPEED_BOOST : 1;
        if (moveLeft) {
          player.velocityX -= (player.onGround ? MOVE_SPEED : MOVE_SPEED * AIR_CONTROL) * speedMultiplier;
        }
        if (moveRight) {
          player.velocityX += (player.onGround ? MOVE_SPEED : MOVE_SPEED * AIR_CONTROL) * speedMultiplier;
        }

        // Apply friction
        if (player.onGround) {
          player.velocityX *= FRICTION;
        } else {
          player.velocityX *= 0.98; // Less friction in air
        }

        // Clamp horizontal velocity
        const maxSpeed = 12 * speedMultiplier;
        player.velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, player.velocityX));

        // Jumping with hold mechanic (like Icy Tower)
        if (jumpPressed && player.onGround && !player.isJumping) {
          const jumpPower = newState.combo > 3 ? JUMP_POWER_BOOST : JUMP_POWER;
          player.velocityY = jumpPower;
          player.isJumping = true;
          player.onGround = false;
          jumpHoldFrames = 0;
        }

        // Hold jump for higher jump
        if (jumpPressed && player.isJumping && jumpHoldFrames < MAX_JUMP_HOLD && player.velocityY < 0) {
          player.velocityY -= 0.5;
          jumpHoldFrames++;
        }

        if (!jumpPressed) {
          jumpHoldFrames = MAX_JUMP_HOLD;
        }

        // Apply gravity
        player.velocityY += GRAVITY;

        // Clamp fall speed
        player.velocityY = Math.min(player.velocityY, 20);

        // Update position
        player.x += player.velocityX;
        player.y += player.velocityY;

        // Wrap around screen horizontally
        if (player.x < -20) player.x = CANVAS_WIDTH + 20;
        if (player.x > CANVAS_WIDTH + 20) player.x = -20;

        // Check platform collisions
        player.onGround = false;
        let landedOnNewPlatform = false;

        newState.platforms.forEach(platform => {
          // Only collide if falling down
          if (player.velocityY > 0) {
            const playerBottom = player.y + 40; // Player height
            const playerLeft = player.x;
            const playerRight = player.x + 30; // Player width

            if (
              playerBottom >= platform.y &&
              playerBottom <= platform.y + 15 &&
              playerRight > platform.x &&
              playerLeft < platform.x + platform.width
            ) {
              player.y = platform.y - 40;
              player.velocityY = 0;
              player.onGround = true;
              player.isJumping = false;

              // Combo system
              if (platform.id > lastPlatformId) {
                landedOnNewPlatform = true;
                newState.combo++;
                newState.maxCombo = Math.max(newState.maxCombo, newState.combo);
                
                // Perfect jump bonus (landed close to center of platform)
                const platformCenter = platform.x + platform.width / 2;
                const playerCenter = player.x + 15;
                if (Math.abs(platformCenter - playerCenter) < 20) {
                  newState.perfectJumps++;
                }

                lastPlatformId = platform.id;

                // Spring platform
                if (platform.type === 'spring') {
                  player.velocityY = JUMP_POWER * 1.5;
                  player.isJumping = true;
                  player.onGround = false;
                }
              }
            }
          }
        });

        // Reset combo if fell back down without landing on new platform
        if (!landedOnNewPlatform && player.onGround && newState.combo > 0) {
          // Only reset if significantly below highest point
          if (player.y > newState.height + 200) {
            newState.combo = 0;
          }
        }

        // Update camera (smooth following)
        const targetCamera = Math.max(0, player.y - CANVAS_HEIGHT * 0.6);
        newState.camera += (targetCamera - newState.camera) * 0.1;

        // Update height and score
        const currentHeight = Math.max(0, Math.floor((CANVAS_HEIGHT - player.y) / 10));
        if (currentHeight > newState.height) {
          newState.height = currentHeight;
          newState.score += (currentHeight - newState.height) * (1 + newState.combo * 0.1);
        }

        // Game over if fell off bottom
        if (player.y > CANVAS_HEIGHT + newState.camera + 100) {
          newState.gameState = 'gameover';
          
          const playTime = Date.now() - startTimeRef.current;
          const timeBonus = Math.max(0, 300 - Math.floor(playTime / 1000));
          
          const pointCalc = calculateGamePoints({
            baseScore: newState.score,
            combo: newState.maxCombo,
            perfectHits: newState.perfectJumps,
            timeBonus,
            difficultyMultiplier: 1.2
          }, "trout-tower");
          
          onGameEnd(newState.score, pointCalc.total);
        }

        newState.player = player;
        return newState;
      });

      // Render
      renderGame(ctx, canvas.width, canvas.height);

      if (state.gameState === 'playing') {
        animationFrame = requestAnimationFrame(gameLoop);
      }
    };

    animationFrame = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [state.gameState, onGameEnd]);

  // Render function
  const renderGame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw water gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0ea5e9');
    gradient.addColorStop(0.5, '#0284c7');
    gradient.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw flowing water pattern
    const waveOffset = (Date.now() / 50) % 40;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    for (let y = -40; y < height; y += 40) {
      ctx.beginPath();
      for (let x = 0; x < width; x += 10) {
        const wave = Math.sin((x + waveOffset + y) / 20) * 10;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(0, -state.camera);

    // Draw platforms
    state.platforms.forEach(platform => {
      if (platform.y + state.camera > -50 && platform.y + state.camera < height + 50) {
        ctx.save();
        
        // Platform shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(platform.x + 3, platform.y + 13, platform.width, 10);

        // Platform color based on type
        switch (platform.type) {
          case 'spring':
            ctx.fillStyle = '#10b981'; // Green
            break;
          case 'ice':
            ctx.fillStyle = '#60a5fa'; // Light blue
            break;
          case 'moving':
            ctx.fillStyle = '#f59e0b'; // Orange
            break;
          default:
            ctx.fillStyle = '#1e3a8a'; // Dark blue
        }

        // Draw platform with rounded corners
        const radius = 8;
        ctx.beginPath();
        ctx.roundRect(platform.x, platform.y, platform.width, 10, radius);
        ctx.fill();

        // Platform highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.roundRect(platform.x, platform.y, platform.width, 4, [radius, radius, 0, 0]);
        ctx.fill();

        // Type indicator
        if (platform.type === 'spring') {
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('↑', platform.x + platform.width / 2, platform.y + 9);
        }

        ctx.restore();
      }
    });

    // Draw player (trout)
    ctx.save();
    ctx.translate(state.player.x + 15, state.player.y + 20);
    
    // Flip based on direction
    if (state.player.velocityX < 0) {
      ctx.scale(-1, 1);
    }

    // Draw trout body
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw spots
    ctx.fillStyle = '#dc2626';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(-5 + i * 5, -5 + i * 3, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(8, -5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(9, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw tail
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-25, -8);
    ctx.lineTo(-25, 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    ctx.restore();

    // Draw UI
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Height: ${state.height}m`, 20, 35);

    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${Math.floor(state.score)}`, width / 2, 35);

    ctx.textAlign = 'right';
    ctx.fillText(`High: ${state.highScore}`, width - 20, 35);

    // Combo indicator
    if (state.combo > 1) {
      const comboAlpha = Math.min(1, state.combo / 10);
      ctx.save();
      ctx.translate(width / 2, 80);
      ctx.scale(1 + Math.sin(Date.now() / 100) * 0.1, 1 + Math.sin(Date.now() / 100) * 0.1);
      
      ctx.fillStyle = `rgba(255, 215, 0, ${comboAlpha})`;
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`🔥 COMBO x${state.combo}!`, 0, 0);
      
      ctx.restore();
    }
  };

  return (
    <div className="relative">
      {state.gameState === 'instructions' && (
        <ControllerInstructions
          gameName="TROUT TOWER"
          icon="🐟"
          controls={[
            { action: "Move Left/Right", keys: ["←→", "A D"], description: "Navigate platforms" },
            { action: "Jump (Hold for higher)", keys: ["↑", "W", "SPACE"], description: "Jump between platforms" },
            { action: "Start Game", keys: ["SPACE"], description: "Begin climbing" }
          ]}
          tips={[
            "Build momentum by landing on consecutive platforms without falling",
            "Hold jump button for higher jumps - timing is everything!",
            "Green platforms are SPRINGS - they bounce you higher",
            "Higher combos = faster movement and better jumps",
            "Land near platform centers for PERFECT bonuses",
            "You can wrap around screen edges",
            "Don't fall below the camera or you'll lose!"
          ]}
          onStart={() => {
            setState(prev => ({ ...prev, gameState: 'ready' }));
            setTimeout(initGame, 100);
          }}
        />
      )}

      <Card className="rounded-3xl border-4 border-cyan-400 shadow-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-cyan-50">
        <CardContent className="p-0">
          <div className="relative">
            {/* Control hints */}
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur rounded-lg p-3 text-white text-sm">
              <div className="flex items-center gap-2 mb-1">
                <kbd className="px-2 py-1 bg-white/20 rounded">←→</kbd>
                <span>Move</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/20 rounded">↑</kbd>
                <span>Jump (hold)</span>
              </div>
            </div>

            {/* Back button */}
            <Button 
              onClick={onBack} 
              className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700"
            >
              ← Exit
            </Button>

            {/* Game canvas */}
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full bg-sky-500"
              style={{ maxWidth: '100%', height: 'auto', aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
            />

            {/* Game Over overlay */}
            {state.gameState === 'gameover' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center"
              >
                <div className="text-center text-white p-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring" }}
                    className="text-8xl mb-4"
                  >
                    {state.score > state.highScore ? "👑" : "🐟"}
                  </motion.div>
                  <div className="text-5xl font-black mb-4">
                    {state.score > state.highScore ? "NEW RECORD!" : "GOOD CLIMB!"}
                  </div>
                  <div className="space-y-2 mb-6 text-xl">
                    <div>Height: {state.height}m</div>
                    <div>Score: {Math.floor(state.score)}</div>
                    <div>Max Combo: x{state.maxCombo}</div>
                    <div>Perfect Jumps: {state.perfectJumps}</div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={initGame}
                      className="bg-cyan-600 hover:bg-cyan-700 text-xl px-8 py-6"
                    >
                      🔄 Climb Again!
                    </Button>
                    <Button 
                      onClick={onBack}
                      variant="outline"
                      className="text-white border-white text-xl px-8 py-6"
                    >
                      ← Back to Games
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pro tips */}
      <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200">
        <div className="text-sm text-slate-700">
          <div className="font-bold mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-600" />
            Icy Tower Pro Tips
          </div>
          <ul className="space-y-1 text-xs">
            <li>• <strong>Momentum is key:</strong> Keep jumping to build speed</li>
            <li>• <strong>Hold jump:</strong> The longer you hold, the higher you go</li>
            <li>• <strong>Combo bonus:</strong> 3+ combos unlock speed boost & power jumps</li>
            <li>• <strong>Perfect landings:</strong> Aim for platform centers for bonuses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

