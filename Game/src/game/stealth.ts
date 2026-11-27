import * as THREE from 'three';
import { assetUrl } from '../core/paths.js';
import { eventBus } from '../core/events.js';
import { gameState } from './state.js';

export interface PatrolRoute {
  id: string;
  scene: string;
  points: Array<[number, number]>;
  waitMs?: number;
  speed?: number;
  viewDistance?: number;
}

export interface HideZone {
  id: string;
  scene: string;
  position: [number, number, number];
  radius?: number;
  enabled: boolean;
}

interface ActivePatrol {
  id: string;
  mesh: THREE.Mesh;
  route: PatrolRoute;
  index: number;
  waitUntil: number;
}

export interface StealthContext {
  playerPosition: THREE.Vector3;
  sceneId: string;
  crouching: boolean;
  running: boolean;
  inDialog: boolean;
  paused: boolean;
}

/**
 * Deteksi patrol dan zona sembunyi. Sengaja tidak mengunci kontrol dan tidak
 * mengakhiri permainan: ini tekanan naratif, seperti mekanik kejaran.
 */
export class StealthDirector {
  private routes = new Map<string, PatrolRoute>();
  private hideZones: HideZone[] = [];
  private active = new Map<string, ActivePatrol>();
  private detection = 0;
  private hidden = false;
  private alerted = false;

  private readonly geometry = new THREE.CapsuleGeometry(0.3, 1, 4, 6);
  private readonly material = new THREE.MeshBasicMaterial({
    color: 0x111016, transparent: true, opacity: 0.75, depthWrite: false
  });

  async load(): Promise<void> {
    try {
      const response = await fetch(assetUrl('data/patrols.json'));
      if (!response.ok) return;
      const data = await response.json() as { routes?: PatrolRoute[]; hideZones?: HideZone[] };
      this.routes.clear();
      for (const route of data.routes ?? []) this.routes.set(route.id, route);
      this.hideZones = data.hideZones ?? [];
    } catch (error) {
      console.warn('[stealth] gagal memuat data patrol:', error);
    }
  }

  startPatrol(id: string, parent: THREE.Object3D): void {
    const route = this.routes.get(id);
    if (!route || this.active.has(id)) return;
    const mesh = new THREE.Mesh(this.geometry, this.material);
    const first = route.points[0] ?? [0, 0];
    mesh.position.set(first[0], 0.7, first[1]);
    parent.add(mesh);
    this.active.set(id, { id, mesh, route, index: 0, waitUntil: 0 });
  }

  stopPatrol(id: string): void {
    const patrol = this.active.get(id);
    if (!patrol) return;
    patrol.mesh.removeFromParent();
    this.active.delete(id);
  }

  stopAll(): void {
    for (const id of Array.from(this.active.keys())) this.stopPatrol(id);
    this.detection = 0;
    this.alerted = false;
    gameState.setVariable('deteksi', 0);
  }

  setHideZone(id: string, enabled: boolean): void {
    const zone = this.hideZones.find(z => z.id === id);
    if (zone) zone.enabled = enabled;
  }

  update(deltaTime: number, ctx: StealthContext): void {
    const now = performance.now();
    let seen = false;

    this.active.forEach(patrol => {
      if (!ctx.paused && !ctx.inDialog && patrol.route.scene === ctx.sceneId) {
        const nextIndex = (patrol.index + 1) % Math.max(1, patrol.route.points.length);
        const target = patrol.route.points[nextIndex];
        if (target && now >= patrol.waitUntil) {
          const dx = target[0] - patrol.mesh.position.x;
          const dz = target[1] - patrol.mesh.position.z;
          const distance = Math.hypot(dx, dz);
          const speed = Math.max(0.2, patrol.route.speed ?? 1.5);
          if (distance > 0.1) {
            const step = Math.min(distance, speed * deltaTime);
            patrol.mesh.position.x += (dx / distance) * step;
            patrol.mesh.position.z += (dz / distance) * step;
          } else {
            patrol.index = nextIndex;
            patrol.waitUntil = now + (patrol.route.waitMs ?? 800);
          }
        }
      }

      const distance = Math.hypot(
        ctx.playerPosition.x - patrol.mesh.position.x,
        ctx.playerPosition.z - patrol.mesh.position.z
      );
      if (distance <= (patrol.route.viewDistance ?? 6)) seen = true;
    });

    this.hidden = this.hideZones.some(zone => {
      if (!zone.enabled || zone.scene !== ctx.sceneId) return false;
      return Math.hypot(
        ctx.playerPosition.x - zone.position[0],
        ctx.playerPosition.z - zone.position[2]
      ) <= (zone.radius ?? 1.2);
    });

    const canDetect = seen && !this.hidden && !ctx.inDialog && !ctx.paused;
    const rate = canDetect ? (ctx.running ? 0.36 : ctx.crouching ? 0.08 : 0.2) : -0.3;
    this.detection = Math.max(0, Math.min(1, this.detection + rate * deltaTime));

    gameState.setVariable('deteksi', this.detection);
    gameState.setVariable('tersembunyi', this.hidden);

    if (this.detection >= 0.8 && !this.alerted) {
      this.alerted = true;
      eventBus.emit('stealth:spotted', {});
    } else if (this.detection <= 0.3 && this.alerted) {
      this.alerted = false;
      eventBus.emit('stealth:lost', {});
    }
  }

  getDetection(): number {
    return this.detection;
  }

  isHidden(): boolean {
    return this.hidden;
  }

  dispose(): void {
    this.stopAll();
    this.geometry.dispose();
    this.material.dispose();
  }
}
