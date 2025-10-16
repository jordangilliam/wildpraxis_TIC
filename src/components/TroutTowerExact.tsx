import React, { useEffect, useRef, useState } from 'react';
import { Card } from './card';

interface TroutTowerExactProps {
  onGameEnd: (score: number, points: number) => void;
}

export const TroutTowerExact: React.FC<TroutTowerExactProps> = ({ onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ============ EXACT JAVA IMPLEMENTATION ============
    // From icy_tower2/IcyTowerGame-main
    
    const CANVAS_WIDTH = 700;
    const CANVAS_HEIGHT = 700;
    const PLAYER_WIDTH = 50;
    const PLAYER_HEIGHT = 50;
    
    // Physics constants (from PhysicsScene.java)
    const FRACTION_FACTOR = 0.04;   // Line 28
    const GRAVITY = 0.018;           // Line 29
    const ACCELERATION_FACTOR = 0.2; // Line 31
    const MAX_SPEED = 7;             // Line 32
    const WALL_PADDING = 20;         // Line 33
    const INITIAL_FLOOR_Y = 40;      // Line 34
    
    // Platform constants (from FloorFactory.java)
    const FLOOR_Y_GAP = 60;          // Line 18
    const MIN_FLOOR_WIDTH = 200;     // Line 94
    const MAX_FLOOR_WIDTH = 400;     // Line 94 (200+200)
    const FLOOR_HEIGHT = 20;
    
    // Camera/Scrolling (from GameEngine.java)
    const SCROLL_THRESHOLD = CANVAS_HEIGHT / 2; // Line 176
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Player state
    let player = {
      x: 100,
      y: INITIAL_FLOOR_Y,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      deltaX: 0,  // velocity X (from PhysicsScene)
      deltaY: 0,  // velocity Y (from PhysicsScene)
      uptime: 0,  // frames since last ground touch
      onGround: false
    };

    // Platform generation
    interface Platform {
      x: number;
      y: number;
      width: number;
      index: number;
    }

    let platforms: Platform[] = [];
    let floorIndex = 0;
    let scrollDy = 0;
    let nearestFloor = INITIAL_FLOOR_Y;
    let currentScore = 0;
    let lastPassedFloorIndex = 0;

    // Keyboard state
    let keys = {
      space: false,
      left: false,
      right: false
    };

    // Initialize platforms (from FloorFactory.reset())
    function initPlatforms() {
      platforms = [];
      floorIndex = 0;
      
      // Ground floor (full width)
      platforms.push({
        x: 0,
        y: INITIAL_FLOOR_Y,
        width: CANVAS_WIDTH,
        index: floorIndex++
      });

      // Generate platforms until top of screen
      while (platforms[platforms.length - 1].y < CANVAS_HEIGHT) {
        createFloor();
      }
    }

    // Create new floor (from FloorFactory.createFloor())
    function createFloor() {
      const lastFloor = platforms[platforms.length - 1];
      
      let width: number;
      let x: number;
      
      // Every 50th floor is full width (line 96-99)
      if (floorIndex % 50 === 0) {
        width = CANVAS_WIDTH;
        x = 0;
      } else {
        // Random width between 200-400 (line 94)
        width = Math.floor(Math.random() * (MAX_FLOOR_WIDTH - MIN_FLOOR_WIDTH)) + MIN_FLOOR_WIDTH;
        // Random x position
        x = Math.floor(Math.random() * (CANVAS_WIDTH - width));
      }
      
      const y = lastFloor.y + FLOOR_Y_GAP; // Line 100
      
      platforms.push({ x, y, width, index: floorIndex++ });
    }

    // Find nearest floor below player (from FloorFactory.getNearestFloor())
    function getNearestFloor(): number {
      let nearest = -1;
      
      for (const floor of platforms) {
        // Line 120: check if floor is below player AND player is horizontally on it
        if (floor.y <= player.y && 
            player.x >= floor.x - 20 && 
            player.x <= floor.x + floor.width - 20) {
          nearest = floor.y;
        }
      }
      
      return nearest;
    }

    // Get last passed floor index (from FloorFactory.getLastPassedFloorIndex())
    function getLastPassedFloorIndex(): number {
      let passed = -1;
      
      for (const floor of platforms) {
        if (floor.y <= player.y) {
          passed++;
        }
      }
      
      return floorIndex - platforms.length + passed;
    }

    // Physics update (from PhysicsScene.updatePhysicsScene())
    function updatePhysics() {
      // Friction (lines 50-51, 102-110)
      if (player.uptime !== 0) {
        // Only apply friction on ground when not moving vertically
        if (player.deltaY === 0) {
          if (player.deltaX > 0) {
            player.deltaX -= FRACTION_FACTOR;
          } else if (player.deltaX < 0) {
            player.deltaX += FRACTION_FACTOR;
          }
          
          if (Math.abs(player.deltaX) < FRACTION_FACTOR) {
            player.deltaX = 0;
          }
        }
      }

      // Gravity (lines 53-56, 99-101)
      if (player.y > nearestFloor) {
        player.deltaY -= GRAVITY * player.uptime; // Line 100
      } else {
        player.deltaY = 0;
      }

      // Check if on ground (line 57-58)
      if (player.y === nearestFloor) {
        player.uptime = 0;
      }

      // Wall collision (lines 60-65, 91-98)
      if (player.x > CANVAS_WIDTH - player.width - WALL_PADDING - 29) {
        player.x = CANVAS_WIDTH - player.width - WALL_PADDING - 30;
        player.deltaX = -1.0 * player.deltaX;
      } else if (player.x <= WALL_PADDING) {
        player.x = WALL_PADDING + 1;
        player.deltaX = -1.0 * player.deltaX;
      }

      // Handle jump (lines 69-70, 118-125)
      if (keys.space && player.y === nearestFloor) {
        if (player.deltaX > 2) {
          // High speed jump with projectile formula (lines 119-121)
          const velocity = Math.sqrt(49 + Math.abs(player.deltaX) * Math.abs(player.deltaX));
          player.deltaY += velocity * Math.sin(70 * Math.PI / 180);
          player.deltaY += velocity * Math.sin(20 * Math.PI / 180); // 90-70
        } else {
          // Normal jump (line 123)
          player.deltaY += 7;
        }
        player.uptime = 0;
      }

      // Handle left movement (lines 71-72, 112-116)
      if (keys.left && player.deltaX > -MAX_SPEED) {
        player.deltaX -= ACCELERATION_FACTOR;
      }

      // Handle right movement (lines 73-74, 112-116)
      if (keys.right && player.deltaX < MAX_SPEED) {
        player.deltaX += ACCELERATION_FACTOR;
      }

      // Increment uptime (line 76)
      player.uptime++;
    }

    // Update camera scroll (from GameEngine.display() lines 176-186)
    function updateScroll() {
      scrollDy = 0;
      
      if (player.y > SCROLL_THRESHOLD) {
        const diff = Math.abs(SCROLL_THRESHOLD - player.y);
        
        if (diff >= 100) {
          scrollDy = 10;
        } else if (diff >= 50) {
          scrollDy = 5;
        } else {
          scrollDy = Math.floor(floorIndex / 50) + 1;
        }
      }
    }

    // Scroll platforms down (from FloorFactory.scrollDown())
    function scrollPlatforms() {
      if (scrollDy === 0) return;
      
      // Move all platforms down (line 83)
      for (let i = platforms.length - 1; i >= 0; i--) {
        platforms[i].y -= scrollDy;
        
        // Remove platforms that went off screen (line 84-85)
        if (platforms[i].y < 0) {
          platforms.splice(i, 1);
        }
      }
      
      // Move player down with scroll (line 222)
      player.y -= scrollDy;
      
      // Add new platforms at top (line 88-89)
      if (platforms[platforms.length - 1].y < CANVAS_HEIGHT) {
        createFloor();
      }
    }

    // Helper function for degrees to radians
    function toRadians(degrees: number): number {
      return degrees * (Math.PI / 180);
    }

    // Main game loop
    function gameLoop() {
      if (!ctx || !canvas) return;

      // Update physics
      updatePhysics();
      
      // Update nearest floor
      nearestFloor = getNearestFloor();
      player.onGround = (player.y === nearestFloor);
      
      // Update player position
      player.x += player.deltaX;
      player.y += player.deltaY;
      
      // Clamp to nearest floor (from GameEngine lines 289-290)
      if (player.y <= nearestFloor) {
        player.y = nearestFloor;
      }
      
      // Update scroll and platforms
      updateScroll();
      scrollPlatforms();
      
      // Update score (from GameEngine line 295)
      lastPassedFloorIndex = getLastPassedFloorIndex();
      currentScore = Math.max(currentScore, 10 * lastPassedFloorIndex);
      setScore(currentScore);

      // Game over check (from GameEngine line 243)
      if (player.y <= 0) {
        setGameOver(true);
        onGameEnd(currentScore, currentScore);
        return;
      }

      // ============ RENDERING ============
      
      // Clear screen
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background gradient (water theme)
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, '#0ea5e9');
      gradient.addColorStop(0.5, '#0284c7');
      gradient.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw platforms
      platforms.forEach(platform => {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(platform.x + 2, platform.y - FLOOR_HEIGHT + 2, platform.width, FLOOR_HEIGHT);
        
        // Platform body
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(platform.x, platform.y - FLOOR_HEIGHT, platform.width, FLOOR_HEIGHT);
        
        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(platform.x, platform.y - FLOOR_HEIGHT, platform.width, FLOOR_HEIGHT / 3);
      });

      // Draw player (trout emoji)
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐟', player.x + PLAYER_WIDTH / 2, player.y - PLAYER_HEIGHT / 2);

      // Draw score
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, 60);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${currentScore}`, 20, 40);

      // Continue loop
      animationId = requestAnimationFrame(gameLoop);
    }

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        keys.space = true;
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        keys.space = false;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Initialize and start
    initPlatforms();
    let animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [onGameEnd]);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-xl font-bold">Trout Tower</h3>
        <p className="text-sm text-gray-600">
          🎮 Arrow Keys/WASD to move • Space/W/↑ to jump
        </p>
        
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-800 rounded-lg shadow-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        {gameOver && (
          <div className="text-center">
            <p className="text-2xl font-bold mb-2">Game Over!</p>
            <p className="text-lg mb-4">Final Score: {score}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

