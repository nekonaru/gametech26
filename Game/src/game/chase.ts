import * as THREE from 'three';
import { eventBus } from '../core/events.js';
import { audioManager } from '../core/audio.js';
import { settingsManager } from '../core/settings.js';

/** Data operasi `startChase`: titik muncul dan kecepatan mengikuti pemain. */
export interface ChaseStartData {
  pos?: [number, number, number];
  speed?: number;
}

/**
 * Bayang yang mengikuti pemain selama satu adegan. Sengaja tidak mengunci
 * kontrol atau mengakhiri permainan: ini tekanan naratif, bukan jalur gagal,
 * sehingga tidak pernah membuat auto-play atau pemain yang membaca dialog
 * mengalami stall. Mode Naratif dan Horor Lembut menonaktifkannya.
 */
export class ChaseDirector {
  private group: THREE.Group | null = null;
  private readonly origin = new THREE.Vector3();
  private speed = 1.15;
  private cooldown = 0;

  private readonly bodyGeometry = new THREE.CapsuleGeometry(0.32, 1.2, 4, 8);
  private readonly eyeGeometry = new THREE.SphereGeometry(0.035, 6, 4);
  private readonly bodyMaterial = new THREE.MeshBasicMaterial({
    color: 0x07070a, transparent: true, opacity: 0.9, depthWrite: false
  });
  private readonly eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xb4302a });

  start(parent: THREE.Object3D, data: ChaseStartData): boolean {
    const access = settingsManager.get('accessibility');
    if (access.narrativeMode || access.softHorror) return false;
    this.stop();

    const pos = data.pos ?? [0, 0, 0];
    this.origin.set(pos[0], pos[1], pos[2]);
    this.speed = Math.max(0.2, Math.min(3, data.speed ?? 1.15));
    this.cooldown = 2.5;

    const group = new THREE.Group();
    const body = new THREE.Mesh(this.bodyGeometry, this.bodyMaterial);
    body.position.y = 0.85;
    group.add(body);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(this.eyeGeometry, this.eyeMaterial);
      eye.position.set(side * 0.12, 1.38, -0.28);
      group.add(eye);
    }
    group.position.copy(this.origin);
    parent.add(group);
    this.group = group;
    return true;
  }

  stop(): void {
    if (!this.group) return;
    this.group.removeFromParent();
    this.group = null;
  }

  update(deltaTime: number, playerPosition: THREE.Vector3): void {
    if (!this.group) return;
    this.cooldown = Math.max(0, this.cooldown - deltaTime);

    const dx = playerPosition.x - this.group.position.x;
    const dz = playerPosition.z - this.group.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > 0.05) {
      const step = Math.min(distance, this.speed * deltaTime);
      this.group.position.x += (dx / distance) * step;
      this.group.position.z += (dz / distance) * step;
    }

    // Kontak memicu kejut sekali, lalu bayang kembali ke titik awal. Tidak ada
    // game over: pemain boleh lari, bersembunyi di dialog, atau menunggu op
    // `stopChase` dari naskah.
    if (distance < 0.9 && this.cooldown === 0) {
      this.cooldown = 4;
      eventBus.emit('horror:jumpscare', { duration: 600 });
      audioManager.playProcedural('static', { category: 'sfx', volume: 0.4 });
      this.group.position.copy(this.origin);
    }
  }

  dispose(): void {
    this.stop();
    this.bodyGeometry.dispose();
    this.eyeGeometry.dispose();
    this.bodyMaterial.dispose();
    this.eyeMaterial.dispose();
  }
}
