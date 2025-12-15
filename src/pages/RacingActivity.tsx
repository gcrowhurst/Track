import { useEffect, useRef } from 'react';
import { useRacingStore } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { getOptimalFontSize } from '../utils/deviceDetection';
import Button from '../components/Button';

export default function RacingActivity() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const racingState = useRacingStore();
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Adjust scale based on device
    const calculatedScale = isMobile ? 0.8 : isTablet ? 0.9 : 1;

    // Start racing
    racingState.startRace();

    let animationFrameId: number;
    let time = 0;

    const drawTrack = () => {
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw simple oval track
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3 * calculatedScale;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const trackRadiusX = 200 * calculatedScale;
      const trackRadiusY = 150 * calculatedScale;
      
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, trackRadiusX, trackRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Draw start line
      ctx.fillStyle = '#000000';
      ctx.fillRect(centerX - 100 * calculatedScale, centerY + 120 * calculatedScale, 200 * calculatedScale, 10);
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 20; i++) {
        if (i % 2 === 0) {
          ctx.fillRect(centerX - 100 * calculatedScale + i * 10 * calculatedScale, centerY + 120 * calculatedScale, 5 * calculatedScale, 10);
        }
      }

      // Draw vehicle
      const vehicleX = centerX + Math.cos(time * 0.01) * trackRadiusX;
      const vehicleY = centerY + Math.sin(time * 0.01) * trackRadiusY;
      const vehicleRotation = time * 0.01;

      ctx.save();
      ctx.translate(vehicleX, vehicleY);
      ctx.rotate(vehicleRotation);

      // Vehicle body
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(-15 * calculatedScale, -10 * calculatedScale, 30 * calculatedScale, 20 * calculatedScale);

      // Vehicle window
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(-10 * calculatedScale, -5 * calculatedScale, 20 * calculatedScale, 10 * calculatedScale);

      ctx.restore();

      // Draw lap info with responsive font size
      ctx.fillStyle = '#ffffff';
      const fontSize = getOptimalFontSize(isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop');
      ctx.font = `bold ${fontSize * 1.5}px Arial`;
      ctx.fillText(`Lap ${racingState.currentLap}/3`, 20, 40);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillText(`Time: ${(time / 1000).toFixed(1)}s`, 20, 70);
      ctx.fillText(`Speed: ${Math.round(Math.random() * 100)} km/h`, 20, 100);
    };

    const animate = () => {
      time += 16.67; // 60 FPS
      drawTrack();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      racingState.endRace();
    };
  }, [racingState, isMobile, isTablet]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900 relative flex flex-col safe-bottom">
      <canvas ref={canvasRef} className="flex-1 w-full" />

      {/* UI Overlays */}
      <div className={`absolute top-0 left-0 p-4 pointer-events-none ${isMobile ? 'w-full' : ''}`}>
        <div className={`bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-white ${
          isMobile ? 'w-full' : 'max-w-md'
        }`}>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-4 text-xs' : 'grid-cols-2 gap-4'}`}>
            <div>
              <p className="text-slate-400 text-xs sm:text-sm">Position</p>
              <p className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>2nd</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs sm:text-sm">Lap</p>
              <p className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>1/3</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs sm:text-sm">Correct</p>
              <p className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>2</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs sm:text-sm">Time</p>
              <p className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>2:34</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Controls - Bottom Safeguard */}
      <div className={`absolute bottom-4 left-4 right-4 flex gap-2 pointer-events-auto safe-bottom ${
        isMobile ? 'flex-col sm:flex-row' : 'flex-row'
      }`}>
        <Button
          variant="primary"
          className="flex-1 text-sm sm:text-base py-2 sm:py-3"
          onClick={() => console.log('Left')}
        >
          ◀ Left
        </Button>
        <Button
          variant="success"
          className="flex-1 text-sm sm:text-base py-2 sm:py-3"
          onClick={() => console.log('Accelerate')}
        >
          🚀 Accelerate
        </Button>
        <Button
          variant="primary"
          className="flex-1 text-sm sm:text-base py-2 sm:py-3"
          onClick={() => console.log('Right')}
        >
          Right ▶
        </Button>
      </div>

      {/* Leaderboard */}
      <div className={`absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-white pointer-events-none ${
        isMobile ? 'max-w-xs' : 'max-w-sm'
      }`}>
        <h3 className={`font-bold mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>Leaderboard</h3>
        <div className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          <div className="flex justify-between">
            <span>🥇 Sarah</span>
            <span className="text-green-400">1st</span>
          </div>
          <div className="flex justify-between bg-blue-900/30 px-2 py-1 rounded">
            <span>🥈 You</span>
            <span className="text-blue-400">2nd</span>
          </div>
          <div className="flex justify-between">
            <span>🥉 James</span>
            <span>3rd</span>
          </div>
        </div>
      </div>
    </div>
  );
}
