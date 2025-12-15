import * as THREE from 'three';

export interface Vehicle {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  velocity: number;
  acceleration: number;
  mesh: THREE.Mesh;
  shadowMesh?: THREE.Mesh;
  lap: number;
  nextCheckpointIndex: number;
}

export interface Checkpoint {
  id: string;
  position: { x: number; y: number; z: number };
  radius: number;
  mesh?: THREE.Mesh;
}

export class ThreeDRacingEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private vehicles: Map<string, Vehicle> = new Map();
  private checkpoints: Checkpoint[] = [];
  private trackMesh?: THREE.Mesh;
  private trackPoints: THREE.Vector3[] = [];
  private trackWidth: number = 80;
  private animationId: number | null = null;
  private time: number = 0;
  private isRunning: boolean = false;
  private cameraTarget = new THREE.Vector3();
  
  // Callbacks
  private onCheckpointReached?: (vehicleId: string, checkpointId: string) => void;
  private onLapCompletedCallback?: (vehicleId: string, lapNumber: number) => void;

  constructor(
    container: HTMLElement,
    onCheckpointReached?: (vehicleId: string, checkpointId: string) => void,
    onLapCompleted?: (vehicleId: string, lapNumber: number) => void
  ) {
    this.onCheckpointReached = onCheckpointReached;
    this.onLapCompletedCallback = onLapCompleted;

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e27);
    this.scene.fog = new THREE.Fog(0x0a0e27, 500, 2000);

    // Camera setup (chase cam)
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    this.camera.position.set(0, 30, 60);
    this.camera.lookAt(0, 0, 0);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Lighting
    this.setupLighting();

    // Track
    this.createTrack();

    // Skybox
    this.createSkybox();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 150, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    this.scene.add(directionalLight);

    // Point lights for atmospheric effect
    const pointLight1 = new THREE.PointLight(0x00ffff, 0.5, 300);
    pointLight1.position.set(-150, 50, -150);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 0.5, 300);
    pointLight2.position.set(150, 50, 150);
    this.scene.add(pointLight2);
  }

  private createSkybox() {
    // Create a simple gradient sky using a sphere
    const skyGeometry = new THREE.SphereGeometry(1500, 32, 32);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Gradient sky
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#0a0e27');
    gradient.addColorStop(0.5, '#1a237e');
    gradient.addColorStop(1, '#0a0e27');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add stars
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = 'white';
      ctx.fillRect(
        Math.random() * 512,
        Math.random() * 512,
        Math.random() * 2,
        Math.random() * 2
      );
    }

    const skyTexture = new THREE.CanvasTexture(canvas);
    const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(skyMesh);
  }

  private createTrack() {
    // Track base
    const trackGeometry = new THREE.PlaneGeometry(600, 400);
    const trackMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a2e });
    this.trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
    this.trackMesh.receiveShadow = true;
    this.trackMesh.rotation.x = -Math.PI / 2; // Lay flat on XZ plane
    this.scene.add(this.trackMesh);

    // Track borders (raised edges)
    const borderHeight = 10;

    // Outer border - oval shape
    const ovalPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-250, 0, -150),
      new THREE.Vector3(-280, 0, 0),
      new THREE.Vector3(-250, 0, 150),
      new THREE.Vector3(0, 0, 180),
      new THREE.Vector3(250, 0, 150),
      new THREE.Vector3(280, 0, 0),
      new THREE.Vector3(250, 0, -150),
      new THREE.Vector3(0, 0, -180),
      new THREE.Vector3(-250, 0, -150),
    ]);

    // Create border walls
    const points = ovalPath.getPoints(200);
    this.trackPoints = points;
    points.forEach((point, index) => {
      const borderGeometry = new THREE.BoxGeometry(20, borderHeight, 5);
      const borderMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffa500,
        shininess: 100
      });
      const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
      borderMesh.position.copy(point);
      borderMesh.castShadow = true;
      borderMesh.receiveShadow = true;

      // Rotate border to face outward
      const nextPoint = points[(index + 1) % points.length];
      const direction = new THREE.Vector3().subVectors(nextPoint, point);
      borderMesh.lookAt(borderMesh.position.clone().add(direction));

      this.scene.add(borderMesh);
    });

    // Road ribbon along centerline
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const segLen = p1.distanceTo(p2);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const angle = Math.atan2(dir.x, dir.z);

      const roadGeom = new THREE.PlaneGeometry(segLen, this.trackWidth);
      const roadMat = new THREE.MeshPhongMaterial({ color: 0x2c2c2c, side: THREE.DoubleSide });
      const road = new THREE.Mesh(roadGeom, roadMat);
      road.position.copy(mid);
      road.rotation.x = -Math.PI / 2; // horizontal
      road.rotation.y = angle;
      road.receiveShadow = true;
      this.scene.add(road);
    }

    // Checkpoints (goal rings)
    const checkpointPositions = [
      { x: 0, z: -150 },
      { x: 200, z: 0 },
      { x: 0, z: 150 },
    ];

    checkpointPositions.forEach((pos, idx) => {
      const checkpoint: Checkpoint = {
        id: `checkpoint-${idx}`,
        position: { x: pos.x, y: 5, z: pos.z },
        radius: 40,
      };

      // Create ring mesh
      const ringGeometry = new THREE.TorusGeometry(40, 5, 16, 100);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.position.set(pos.x, 5, pos.z);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.castShadow = true;
      this.scene.add(ringMesh);

      checkpoint.mesh = ringMesh;
      this.checkpoints.push(checkpoint);
    });
  }

  private createVehicleMesh(color: string): THREE.Mesh {
    // Main body
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 4);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 100,
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.position.z = -0.3;

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(1.6, 1, 1.5);
    const cabinMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      shininess: 80,
    });
    const cabinMesh = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabinMesh.castShadow = true;
    cabinMesh.receiveShadow = true;
    cabinMesh.position.z = 0;
    cabinMesh.position.y = 1;

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 16);
    const wheelMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      shininess: 30,
    });

    const wheelPositions = [
      [-0.9, -0.5, 1],
      [0.9, -0.5, 1],
      [-0.9, -0.5, -1],
      [0.9, -0.5, -1],
    ];

    const wheels: THREE.Mesh[] = [];
    wheelPositions.forEach((pos) => {
      const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheelMesh.castShadow = true;
      wheelMesh.receiveShadow = true;
      wheelMesh.rotation.z = Math.PI / 2;
      wheelMesh.position.set(pos[0], pos[1], pos[2]);
      wheels.push(wheelMesh);
    });

    // Combine into group
    const vehicleGroup = new THREE.Group();
    vehicleGroup.add(bodyMesh);
    vehicleGroup.add(cabinMesh);
    wheels.forEach((wheel) => vehicleGroup.add(wheel));

    return vehicleGroup as any;
  }

  addVehicle(id: string, name: string, color: string): void {
    const mesh = this.createVehicleMesh(color);
    mesh.position.set(0, 1, 0);
    this.scene.add(mesh);

    const vehicle: Vehicle = {
      id,
      name,
      color,
      position: { x: 0, y: 1, z: 0 },
      rotation: 0,
      velocity: 0,
      acceleration: 0,
      mesh,
      lap: 0,
      nextCheckpointIndex: 0,
    };

    this.vehicles.set(id, vehicle);
  }

  updateVehicle(
    id: string,
    controls: { forward: boolean; backward: boolean; left: boolean; right: boolean }
  ): void {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return;

    // Acceleration
    const maxSpeed = 0.5;
    const acceleration = 0.02;
    const friction = 0.95;

    if (controls.forward) {
      vehicle.acceleration = Math.min(vehicle.acceleration + acceleration, maxSpeed);
    } else if (controls.backward) {
      vehicle.acceleration = Math.max(vehicle.acceleration - acceleration * 1.5, -maxSpeed * 0.5);
    } else {
      vehicle.acceleration *= friction;
    }

    vehicle.velocity = vehicle.acceleration;

    // Rotation
    const turnSpeed = 0.05;
    if (Math.abs(vehicle.velocity) > 0.01) {
      if (controls.left) {
        vehicle.rotation += turnSpeed;
      }
      if (controls.right) {
        vehicle.rotation -= turnSpeed;
      }
    }

    // Position update
    vehicle.position.x += Math.sin(vehicle.rotation) * vehicle.velocity;
    vehicle.position.z += Math.cos(vehicle.rotation) * vehicle.velocity;

    // Off-track handling: slow down and gently correct back to centerline
    if (this.trackPoints.length) {
      let nearestIdx = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < this.trackPoints.length; i += 2) { // sample every other point for speed
        const tp = this.trackPoints[i];
        const dx = vehicle.position.x - tp.x;
        const dz = vehicle.position.z - tp.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = i;
        }
      }
      const nearestPoint = this.trackPoints[nearestIdx];
      if (nearestPoint) {
        const offAmount = nearestDist - this.trackWidth / 2;
        if (offAmount > 0) {
          // Apply stronger friction off track
          vehicle.acceleration *= 0.9;
          vehicle.velocity *= 0.9;
          // Nudge back toward track center
          const pushDir = new THREE.Vector3(
            nearestPoint.x - vehicle.position.x,
            0,
            nearestPoint.z - vehicle.position.z
          ).normalize();
          const pushStrength = Math.min(offAmount / (this.trackWidth), 1) * 0.3;
          vehicle.position.x += pushDir.x * pushStrength;
          vehicle.position.z += pushDir.z * pushStrength;
        }
      }
    }

    // Update mesh
    vehicle.mesh.position.set(vehicle.position.x, vehicle.position.y, vehicle.position.z);
    vehicle.mesh.rotation.y = vehicle.rotation;

    // Checkpoint detection
    this.checkCheckpoints(vehicle);
  }

  private checkCheckpoints(vehicle: Vehicle): void {
    const targetIndex = vehicle.nextCheckpointIndex % this.checkpoints.length;
    const targetCheckpoint = this.checkpoints[targetIndex];
    if (!targetCheckpoint) return;

    const dx = vehicle.position.x - targetCheckpoint.position.x;
    const dz = vehicle.position.z - targetCheckpoint.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < targetCheckpoint.radius) {
      // Correct checkpoint reached in sequence
      this.onCheckpointReached?.(vehicle.id, targetCheckpoint.id);
      vehicle.nextCheckpointIndex += 1;

      // Completed a lap
      if (vehicle.nextCheckpointIndex >= this.checkpoints.length) {
        vehicle.lap += 1;
        vehicle.nextCheckpointIndex = 0;
        this.onLapCompletedCallback?.(vehicle.id, vehicle.lap);
      }
    }
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = (): void => {
    if (!this.isRunning) return;

    this.time += 0.016;

    // Update camera to follow first vehicle
    const firstVehicle = Array.from(this.vehicles.values())[0];
    if (firstVehicle) {
      const cameraDistance = 30; // behind vehicle
      const cameraHeight = 15;
      const targetX = firstVehicle.position.x - Math.sin(firstVehicle.rotation) * cameraDistance;
      const targetZ = firstVehicle.position.z - Math.cos(firstVehicle.rotation) * cameraDistance;
      const targetY = firstVehicle.position.y + cameraHeight;
      this.cameraTarget.set(targetX, targetY, targetZ);
      this.camera.position.lerp(this.cameraTarget, 0.1); // smooth follow
      this.camera.lookAt(firstVehicle.position.x, firstVehicle.position.y + 5, firstVehicle.position.z);

      // Animate checkpoint rings
      this.checkpoints.forEach((checkpoint) => {
        if (checkpoint.mesh) {
          checkpoint.mesh.rotation.z += 0.02;
          checkpoint.mesh.position.y = 5 + Math.sin(this.time * 2) * 2;
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animate);
  };

  private onWindowResize = (): void => {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  dispose(): void {
    this.stop();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  getVehicle(id: string): Vehicle | undefined {
    return this.vehicles.get(id);
  }

  getCheckpoints(): Checkpoint[] {
    return this.checkpoints;
  }
}
