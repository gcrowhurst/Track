/**
 * Canvas 2D Racing Engine
 * Handles rendering and physics for the racing track
 */

export interface Vehicle {
  id: string;
  x: number;
  y: number;
  rotation: number;
  velocity: number;
  color: string;
  name: string;
}

export interface TrackPoint {
  x: number;
  y: number;
}

export class RacingEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private vehicles: Map<string, Vehicle> = new Map();
  private trackPath: TrackPoint[] = [];
  private animationFrameId: number | null = null;
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = ctx;
    this.setupCanvas();
    this.generateOvalTrack();
  }

  private setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Generate a simple oval race track
   */
  private generateOvalTrack() {
    this.trackPath = [];
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radiusX = 200;
    const radiusY = 150;

    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      this.trackPath.push({ x, y });
    }
  }

  /**
   * Add a vehicle to the race
   */
  addVehicle(vehicle: Vehicle) {
    this.vehicles.set(vehicle.id, vehicle);
    // Position on track
    if (this.trackPath.length > 0) {
      const startPoint = this.trackPath[0];
      vehicle.x = startPoint.x;
      vehicle.y = startPoint.y;
    }
  }

  /**
   * Remove a vehicle from the race
   */
  removeVehicle(vehicleId: string) {
    this.vehicles.delete(vehicleId);
  }

  /**
   * Update vehicle position and rotation
   */
  updateVehicle(vehicleId: string, x: number, y: number, rotation: number, velocity: number) {
    const vehicle = this.vehicles.get(vehicleId);
    if (vehicle) {
      vehicle.x = x;
      vehicle.y = y;
      vehicle.rotation = rotation;
      vehicle.velocity = velocity;
    }
  }

  /**
   * Start the rendering loop
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  /**
   * Stop the rendering loop
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
   * Render everything to the canvas
   */
  private render() {
    // Clear canvas
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw track
    this.drawTrack();

    // Draw vehicles
    this.vehicles.forEach((vehicle) => {
      this.drawVehicle(vehicle);
    });

    // Draw grid (optional debug)
    // this._drawGrid();
  }

  /**
   * Draw the race track
   */
  private drawTrack() {
    // Draw track outline
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();

    if (this.trackPath.length > 0) {
      this.ctx.moveTo(this.trackPath[0].x, this.trackPath[0].y);
      for (let i = 1; i < this.trackPath.length; i++) {
        this.ctx.lineTo(this.trackPath[i].x, this.trackPath[i].y);
      }
      this.ctx.closePath();
    }

    this.ctx.stroke();

    // Draw inner track area
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fill();

    // Draw start/finish line
    const startPoint = this.trackPath[0];
    const nextPoint = this.trackPath[1];
    const angle = Math.atan2(nextPoint.y - startPoint.y, nextPoint.x - startPoint.x);

    this.ctx.save();
    this.ctx.translate(startPoint.x, startPoint.y);
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
   * Draw a vehicle on the track
   */
  private drawVehicle(vehicle: Vehicle) {
    this.ctx.save();
    this.ctx.translate(vehicle.x, vehicle.y);
    this.ctx.rotate(vehicle.rotation);

    // Vehicle body
    this.ctx.fillStyle = vehicle.color;
    this.ctx.fillRect(-15, -10, 30, 20);

    // Vehicle window
    this.ctx.fillStyle = '#93c5fd';
    this.ctx.fillRect(-10, -5, 20, 10);

    // Vehicle direction indicator
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(10, -2, 5, 4);

    // Speed indicator (color based on velocity)
    const speedColor = `hsl(${Math.max(0, Math.min(120, (vehicle.velocity / 300) * 120))}, 100%, 50%)`;
    this.ctx.strokeStyle = speedColor;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.restore();

    // Draw name above vehicle
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(vehicle.name, vehicle.x, vehicle.y - 30);

    // Draw speed indicator
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.fillText(`${Math.round(vehicle.velocity)} km/h`, vehicle.x, vehicle.y - 15);
  }

  /**
   * Draw debug grid
   */
  // private _drawGrid() {
  //   this.ctx.strokeStyle = '#334155';
  //   this.ctx.lineWidth = 1;
  //   const gridSize = 50;

  //   for (let x = 0; x < this.canvas.width; x += gridSize) {
  //     this.ctx.beginPath();
  //     this.ctx.moveTo(x, 0);
  //     this.ctx.lineTo(x, this.canvas.height);
  //     this.ctx.stroke();
  //   }

  //   for (let y = 0; y < this.canvas.height; y += gridSize) {
  //     this.ctx.beginPath();
  //     this.ctx.moveTo(0, y);
  //     this.ctx.lineTo(this.canvas.width, y);
  //     this.ctx.stroke();
  //   }
  // }

  /**
   * Get vehicle position on track (0-1, where 0 is start and 1 is finish)
   */
  getVehicleProgress(vehicleId: string): number {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle || this.trackPath.length === 0) return 0;

    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < this.trackPath.length; i++) {
      const point = this.trackPath[i];
      const distance = Math.sqrt(
        Math.pow(vehicle.x - point.x, 2) + Math.pow(vehicle.y - point.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    return closestIndex / this.trackPath.length;
  }

  /**
   * Check if vehicle is at a checkpoint
   */
  isVehicleAtCheckpoint(vehicleId: string, checkpointX: number, checkpointY: number, radius: number): boolean {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) return false;

    const distance = Math.sqrt(
      Math.pow(vehicle.x - checkpointX, 2) + Math.pow(vehicle.y - checkpointY, 2)
    );
    return distance <= radius;
  }

  /**
   * Cleanup resources
   */
  dispose() {
    this.stop();
    this.vehicles.clear();
    this.trackPath = [];
  }
}
