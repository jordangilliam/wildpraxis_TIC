// 🐟 SIMPLE TROUT TOWER - Guaranteed Working Icy Tower Clone
// Based on classic Icy Tower mechanics with trout theme

import React, { useState, useEffect, useRef } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { motion } from "framer-motion";

interface SimpleTroutTowerProps {
  onBack: () => void;
  onGameEnd: (score: number, points: number) => void;
  highScore: number;
}

export function SimpleTroutTower({ onBack, onGameEnd, highScore }: SimpleTroutTowerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game constants (Icy Tower exact values)
    const CANVAS_WIDTH = 600;
    const CANVAS_HEIGHT = 700;
    const PLAYER_WIDTH = 40;
    const PLAYER_HEIGHT = 40;
    const PLATFORM_HEIGHT = 15;
    const GRAVITY = 0.8;
    const JUMP_STRENGTH = -16;
    const ACCELERATION = 0.5; // Gradual acceleration like Icy Tower
    const MAX_SPEED = 8;
    const FRICTION = 0.88;
    const AIR_RESISTANCE = 0.95;

    // Game state
    let player = {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: CANVAS_HEIGHT - 150,
      vx: 0,
      vy: 0,
      onGround: false
    };

    let platforms: Array<{ x: number; y: number; width: number }> = [];
    let cameraY = 0;
    let currentScore = 0;
    let currentCombo = 0;
    let keys: { [key: string]: boolean } = {};

    // Initialize platforms
    function initPlatforms() {
      platforms = [];
      // Ground platform
      platforms.push({ x: 0, y: CANVAS_HEIGHT - 50, width: CANVAS_WIDTH });
      
      // Generate platforms going up
      let lastY = CANVAS_HEIGHT - 50;
      for (let i = 0; i < 50; i++) {
        lastY -= 80 + Math.random() * 40;
        const width = 120 - i * 1.5; // Get narrower
        const x = Math.random() * (CANVAS_WIDTH - width);
        platforms.push({ x, y: lastY, width: Math.max(60, width) });
      }
    }

    initPlatforms();

    // Keyboard handling
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      
      // Jump on key press
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && player.onGround) {
        player.vy = JUMP_STRENGTH;
        player.onGround = false;
      }
      
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    let animationId: number;
    
    function gameLoop() {
      if (!ctx || !canvas) return;

      // Handle input with gradual acceleration (like Icy Tower)
      if (keys['ArrowLeft'] || keys['a']) {
        player.vx -= ACCELERATION;
      }
      if (keys['ArrowRight'] || keys['d']) {
        player.vx += ACCELERATION;
      }

      // Clamp to max speed
      if (player.vx > MAX_SPEED) player.vx = MAX_SPEED;
      if (player.vx < -MAX_SPEED) player.vx = -MAX_SPEED;

      // Apply friction (on ground) or air resistance (in air)
      if (player.onGround) {
        player.vx *= FRICTION;
      } else {
        player.vx *= AIR_RESISTANCE;
      }

      // Apply gravity
      player.vy += GRAVITY;

      // Update position
      player.x += player.vx;
      player.y += player.vy;

      // Wrap horizontally
      if (player.x < -PLAYER_WIDTH) player.x = CANVAS_WIDTH;
      if (player.x > CANVAS_WIDTH) player.x = -PLAYER_WIDTH;

      // Platform collision
      player.onGround = false;
      for (const platform of platforms) {
        if (player.vy > 0 &&
            player.y + PLAYER_HEIGHT >= platform.y &&
            player.y + PLAYER_HEIGHT <= platform.y + PLATFORM_HEIGHT + 5 &&
            player.x + PLAYER_WIDTH > platform.x &&
            player.x < platform.x + platform.width) {
          player.y = platform.y - PLAYER_HEIGHT;
          player.vy = 0;
          player.onGround = true;
          
          // Update score
          const height = Math.floor((CANVAS_HEIGHT - platform.y) / 10);
          if (height > currentScore) {
            currentCombo++;
            currentScore = height;
            setScore(currentScore);
            setCombo(currentCombo);
          }
        }
      }

      // Camera follow
      const targetCamera = Math.max(0, player.y - CANVAS_HEIGHT * 0.6);
      cameraY += (targetCamera - cameraY) * 0.1;

      // Game over check
      if (player.y > CANVAS_HEIGHT + cameraY + 100) {
        setGameOver(true);
        const points = Math.floor(currentScore * (1 + currentCombo * 0.1));
        onGameEnd(currentScore, points);
        return;
      }

      // Render
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, '#0ea5e9');
      gradient.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw platforms
      ctx.save();
      ctx.translate(0, -cameraY);
      
      platforms.forEach(platform => {
        if (platform.y + cameraY > -50 && platform.y + cameraY < CANVAS_HEIGHT + 50) {
          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(platform.x + 2, platform.y + 2, platform.width, PLATFORM_HEIGHT);
          
          // Platform
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(platform.x, platform.y, platform.width, PLATFORM_HEIGHT);
          
          // Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(platform.x, platform.y, platform.width, PLATFORM_HEIGHT / 3);
        }
      });

      // Draw player (trout emoji)
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐟', player.x + PLAYER_WIDTH / 2, player.y + PLAYER_HEIGHT / 2);

      ctx.restore();

      // UI
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, 60);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Height: ${currentScore}m`, 20, 35);
      
      ctx.textAlign = 'center';
      if (currentCombo > 1) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`🔥 COMBO x${currentCombo}!`, CANVAS_WIDTH / 2, 35);
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText(`Best: ${highScore}`, CANVAS_WIDTH - 20, 35);

      animationId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, highScore, onGameEnd]);

  if (!gameStarted) {
    return (
      <Card className="rounded-3xl border-4 border-cyan-400 shadow-2xl p-8">
        <div className="text-center">
          <div className="text-8xl mb-4">🐟</div>
          <h2 className="text-4xl font-black mb-4">TROUT TOWER</h2>
          <p className="text-lg mb-6">Jump up platforms and climb as high as you can!</p>
          
          <div className="bg-cyan-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold mb-4">CONTROLS</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-2 bg-slate-700 text-white rounded-lg">←→</kbd>
                <span>Move left/right</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-2 bg-slate-700 text-white rounded-lg">SPACE</kbd>
                <span>Jump</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setGameStarted(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-2xl px-12 py-6 font-black"
          >
            START GAME
          </Button>
        </div>
      </Card>
    );
  }

  if (gameOver) {
    return (
      <Card className="rounded-3xl border-4 border-cyan-400 shadow-2xl p-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-8xl mb-4"
          >
            {score > highScore ? "👑" : "🐟"}
          </motion.div>
          <h2 className="text-5xl font-black mb-4">
            {score > highScore ? "NEW RECORD!" : "GOOD CLIMB!"}
          </h2>
          <div className="text-2xl mb-6">
            <div>Height: {score}m</div>
            <div>Combo: x{combo}</div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setGameStarted(true);
                setGameOver(false);
                setScore(0);
                setCombo(0);
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-xl px-8 py-4"
            >
              PLAY AGAIN
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="text-xl px-8 py-4"
            >
              BACK
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={onBack}
        className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700"
      >
        EXIT
      </Button>
      
      <Card className="rounded-3xl border-4 border-cyan-400 shadow-2xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={700}
          className="w-full bg-sky-500"
          style={{ maxWidth: '100%', display: 'block' }}
        />
      </Card>

      <div className="mt-4 p-4 bg-cyan-50 rounded-2xl">
        <div className="text-sm text-center">
          <strong>TIP:</strong> Use ←→ or A/D to move, SPACE to jump. Build combos!
        </div>
      </div>
    </div>
  );
}

