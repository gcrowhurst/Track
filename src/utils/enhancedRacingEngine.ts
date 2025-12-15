import type { TrackLayout } from '../types';

/**
 * Enhanced Racing Engine with Checkpoint Detection and Lap Counting
 * Extends the basic racing engine with full activity features
 */

export interface Vehicle {
  id: string;
  x: number;
  y: number;
  rotation: number;
  velocity: number;
  acceleration: number;
  color: string;
  name: string;
  currentLap: number;
  checkpointsPassed: number[];
  totalLaps: number;
}

export interface TrackPoint {
  x: number;
  y: number;
}

export interface Checkpoint {
  id: string;
  x: number;
  y: number;
  radius: number;
  passed: Set<string>; // Vehicle IDs that passed this checkpoint
}

export class EnhancedRacingEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private vehicles: Map<string, Vehicle> = new Map();
  private trackPath: TrackPoint[] = [];
  private checkpoints: Checkpoint[] = [];
  private animationFrameId: number | null = null;
  private isRunning = false;
  private onCheckpointReached?: (vehicleId: string, checkpointId: string) => void;
  private onLapCompleted?: (vehicleId: string, lapNumber: number) => void;
  
  // Physics constants
  private readonly MAX_SPEED = 300;
  private readonly ACCELERATION = 5;
  private readonly BRAKE_FORCE = 8;
  private readonly FRICTION = 0.97;
  private readonly TURN_SPEED = 0.05;

  constructor(
    canvas: HTMLCanvasElement,
    trackLayout?: TrackLayout,
    onCheckpointReached?: (vehicleId: string, checkpointId: string) => void,
    onLapCompleted?: (vehicleId: string, lapNumber: number) => void
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = ctx;
    this.onCheckpointReached = onCheckpointReached;
    this.onLapCompleted = onLapCompleted;
    
    this.setupCanvas();
    
    if (trackLayout) {
      this.loadTrack(trackLayout);
    } else {
      this.generateDefaultTrack();
    }
  }

  private setupCanvas() {
    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Load track from layout data
   */
  loadTrack(layout: TrackLayout) {
    this.trackPath = this.generateTrackFromLayout(layout);
    this.checkpoints = layout.checkpoints
      .filter((cp): cp is Required<typeof cp> => cp.position !== undefined)
      .map((cp) => ({
        id: cp.id,
        x: cp.position.x,
        y: cp.position.y,
        radius: cp.trigger_radius,
        passed: new Set(),
      }));
  }

  /**
   * Generate track path from layout pieces
   */
  private generateTrackFromLayout(_layout: TrackLayout): TrackPoint[] {
    const path: TrackPoint[] = [];
    
    // For MVP, we'll use simple oval
    // Track builder will create complex paths from pieces
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radiusX = 250;
    const radiusY = 180;
    
    for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      path.push({ x, y });
    }
    
    return path;
  }

  /**
   * Generate default oval track
   */
  private generateDefaultTrack() {
    this.trackPath = [];
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radiusX = 250;
    const radiusY = 180;

    for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      this.trackPath.push({ x, y });
    }

    // Default checkpoints at 4 corners
    this.checkpoints = [
      { id: 'cp1', x: centerX + radiusX - 50, y: centerY, radius: 60, passed: new Set() },
      { id: 'cp2', x: centerX, y: centerY + radiusY - 50, radius: 60, passed: new Set() },
      { id: 'cp3', x: centerX - radiusX + 50, y: centerY, radius: 60, passed: new Set() },
      { id: 'cp4', x: centerX, y: centerY - radiusY + 50, radius: 60, passed: new Set() },
    ];
  }

  /**
   * Add vehicle to race
   */
  addVehicle(vehicle: Omit<Vehicle, 'currentLap' | 'checkpointsPassed'>) {
    const fullVehicle: Vehicle = {
      ...vehicle,
      currentLap: 0,
      checkpointsPassed: [],
      totalLaps: 3,
    };

    // Position on start line
    if (this.trackPath.length > 0) {
      const startPoint = this.trackPath[0];
      fullVehicle.x = startPoint.x;
      fullVehicle.y = startPoint.y;
      fullVehicle.rotation = 0;
    }

    this.vehicles.set(vehicle.id, fullVehicle);
  }

  /**
   * Remove vehicle
   */
  removeVehicle(vehicleId: string) {
    this.vehicles.delete(vehicleId);
    // Clear checkpoint tracking for this vehicle
    this.checkpoints.forEach((cp) => cp.passed.delete(vehicleId));
  }

  /**
   * Update vehicle physics
   */
  updateVehicle(
    vehicleId: string,
    controls: { accelerate: boolean; brake: boolean; left: boolean; right: boolean }
  ) {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) return;

    // Acceleration/Braking
    if (controls.accelerate) {
      vehicle.acceleration = this.ACCELERATION;
    } else if (controls.brake) {
      vehicle.acceleration = -this.BRAKE_FORCE;
    } else {
      vehicle.acceleration = 0;
    }

    // Update velocity
    vehicle.velocity += vehicle.acceleration;
    vehicle.velocity *= this.FRICTION;
    vehicle.velocity = Math.max(0, Math.min(this.MAX_SPEED, vehicle.velocity));

    // Turning
    if (vehicle.velocity > 0) {
      if (controls.left) {
        vehicle.rotation -= this.TURN_SPEED * (vehicle.velocity / this.MAX_SPEED);
      }
      if (controls.right) {
        vehicle.rotation += this.TURN_SPEED * (vehicle.velocity / this.MAX_SPEED);
      }
    }

    // Update position
    vehicle.x += Math.cos(vehicle.rotation) * vehicle.velocity * 0.1;
    vehicle.y += Math.sin(vehicle.rotation) * vehicle.velocity * 0.1;

    // Check checkpoints
    this.checkCheckpoints(vehicle);

    // Keep vehicle on screen (simple bounds)
    vehicle.x = Math.max(50, Math.min(this.canvas.width - 50, vehicle.x));
    vehicle.y = Math.max(50, Math.min(this.canvas.height - 50, vehicle.y));
  }

  /**
   * Check if vehicle hit any checkpoints
   */
  private checkCheckpoints(vehicle: Vehicle) {
    this.checkpoints.forEach((checkpoint, index) => {
      const distance = Math.sqrt(
        Math.pow(vehicle.x - checkpoint.x, 2) + Math.pow(vehicle.y - checkpoint.y, 2)
      );

      if (distance <= checkpoint.radius && !checkpoint.passed.has(vehicle.id)) {
        // Mark checkpoint as passed for this vehicle
        checkpoint.passed.add(vehicle.id);
        vehicle.checkpointsPassed.push(index);

        // Trigger callback
        if (this.onCheckpointReached) {
          this.onCheckpointReached(vehicle.id, checkpoint.id);
        }

        // Check if all checkpoints passed = lap completed
        if (vehicle.checkpointsPassed.length === this.checkpoints.length) {
          vehicle.currentLap++;
          vehicle.checkpointsPassed = [];
          
          // Reset checkpoint tracking for this vehicle
          this.checkpoints.forEach((cp) => cp.passed.delete(vehicle.id));

          // Trigger lap callback
          if (this.onLapCompleted) {
            this.onLapCompleted(vehicle.id, vehicle.currentLap);
          }
        }
      }
    });
  }

  /**
   * Start rendering loop
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  /**
   * Stop rendering
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main animation loop
   */
  private animate = () => {
    if (!this.isRunning) return;
    this.render();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Render frame
   */
  private render() {
    const rect = this.canvas.getBoundingClientRect();

    // Clear
    this.ctx.fillStyle = '#0a0e27';
    this.ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw track
    this.drawTrack();

    // Draw checkpoints
    this.drawCheckpoints();

    // Draw vehicles
    this.vehicles.forEach((vehicle) => this.drawVehicle(vehicle));
  }

  /**
   * Draw track
   */
  private drawTrack() {
    if (this.trackPath.length === 0) return;

    // Track outline
    this.ctx.strokeStyle = '#64748b';
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(this.trackPath[0].x, this.trackPath[0].y);
    for (let i = 1; i < this.trackPath.length; i++) {
      this.ctx.lineTo(this.trackPath[i].x, this.trackPath[i].y);
    }
    this.ctx.closePath();
    this.ctx.stroke();

    // Track surface
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fill();

    // Start/finish line
    const start = this.trackPath[0];
    const next = this.trackPath[1];
    const angle = Math.atan2(next.y - start.y, next.x - start.x);

    this.ctx.save();
    this.ctx.translate(start.x, start.y);
    this.ctx.rotate(angle);

    // Checkered pattern
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(-40, -20, 80, 40);
    this.ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        if ((i + j) % 2 === 0) {
          this.ctx.fillRect(-40 + i * 20, -20 + j * 20, 20, 20);
        }
      }
    }
    this.ctx.restore();
  }

  /**
   * Draw checkpoints
   */
  private drawCheckpoints() {
    this.checkpoints.forEach((checkpoint, index) => {
      // Checkpoint circle
      this.ctx.strokeStyle = '#f59e0b';
      this.ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(checkpoint.x, checkpoint.y, checkpoint.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Checkpoint number
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(`${index + 1}`, checkpoint.x, checkpoint.y);
    });
  }

  /**
   * Draw vehicle
   */
  private drawVehicle(vehicle: Vehicle) {
    this.ctx.save();
    this.ctx.translate(vehicle.x, vehicle.y);
    this.ctx.rotate(vehicle.rotation);

    // Vehicle shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(-13, -8, 26, 16);

    // Vehicle body
    this.ctx.fillStyle = vehicle.color;
    this.ctx.fillRect(-15, -10, 30, 20);

    // Vehicle window
    this.ctx.fillStyle = '#93c5fd';
    this.ctx.fillRect(-10, -6, 18, 12);

    // Direction indicator
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(10, -3, 5, 6);

    // Speed glow
    if (vehicle.velocity > 100) {
      this.ctx.strokeStyle = `rgba(34, 197, 94, ${vehicle.velocity / this.MAX_SPEED})`;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 22, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    this.ctx.restore();

    // Name and lap info
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(vehicle.name, vehicle.x, vehicle.y - 30);

    this.ctx.font = '10px sans-serif';
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.fillText(
      `Lap ${vehicle.currentLap}/${vehicle.totalLaps} | ${Math.round(vehicle.velocity)} km/h`,
      vehicle.x,
      vehicle.y - 16
    );
  }

  /**
   * Get vehicle standings
   */
  getStandings(): Array<{ vehicleId: string; name: string; lap: number; checkpoints: number }> {
    return Array.from(this.vehicles.values())
      .map((v) => ({
        vehicleId: v.id,
        name: v.name,
        lap: v.currentLap,
        checkpoints: v.checkpointsPassed.length,
      }))
      .sort((a, b) => {
        if (a.lap !== b.lap) return b.lap - a.lap;
        return b.checkpoints - a.checkpoints;
      });
  }

  /**
   * Cleanup
   */
  dispose() {
    this.stop();
    this.vehicles.clear();
    this.checkpoints = [];
    this.trackPath = [];
  }
}

export default EnhancedRacingEngine;
