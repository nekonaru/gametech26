/**
 * AmbienceDirector: lapisan "dunia di luar sana" di atas ambience bab.
 *
 * Tugasnya sederhana: sesekali membunyikan suara jauh yang TIDAK ditulis di
 * naskah (anjing menggonggong dari kejauhan, angin, satwa kabur, static radio
 * yang nyasar), plus letupan rendah (30 Hz) dan detak jantung yang makin
 * rapat saat tegangan tinggi. Tanpa ini desa terasa seperti set panggung;
 * dengan ini pemain sadar ada sesuatu di luar tembok.
 *
 * Semua suara lewat audioManager.play(), jadi file rekaman dipakai bila sudah
 * tiba, dan sintesis prosedural jadi cadangan otomatis (lihat recipeFor).
 * Tidak menyentuh naskah, save, atau state game: murni lapisan audio.
 */
import { audioManager } from '../core/audio.js';

interface DistantEvent {
  key: string;
  /** Volume dasar; diacak mengikuti variasi kecil tiap pemicu. */
  volume: number;
  category: 'ambience' | 'sfx';
}

const DISTANT_EVENTS: DistantEvent[] = [
  { key: 'dog_bark', volume: 0.07, category: 'ambience' },
  { key: 'wind_low', volume: 0.09, category: 'ambience' },
  { key: 'whisper_wind', volume: 0.05, category: 'ambience' },
  { key: 'satwa_kabur', volume: 0.06, category: 'ambience' },
  { key: 'distant_glow', volume: 0.05, category: 'ambience' },
  { key: 'static', volume: 0.04, category: 'sfx' }
];

export interface AmbienceUpdateOptions {
  /** true saat dialog, menu, atau overlay layar lain sedang terbuka. */
  quiet: boolean;
  /** Tegangan 0..1 dari TensionDirector. */
  tension: number;
}

class AmbienceDirector {
  private distantTimer = 14;   // pemicu pertama agak cepat supaya terasa hidup sejak awal
  private rumbleTimer = 8;
  private heartbeatTimer = 0;
  private heartbeatOn = false;

  /**
   * Dipanggil tiap frame dari loop game. Semua timer memakai detik nyata;
   * saat `quiet`, timer tidak berjalan (keputusan sunyi dijaga pemain, bukan
   * diputus secara paksa).
   */
  update(deltaTime: number, options: AmbienceUpdateOptions): void {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (options.quiet) return;

    const tension = Number.isFinite(options.tension)
      ? Math.max(0, Math.min(1, options.tension))
      : 0;

    // --- Suara jauh, acak, jarang --------------------------------------
    this.distantTimer -= deltaTime;
    if (this.distantTimer <= 0) {
      this.distantTimer = 19 + Math.random() * 22;
      this.playDistantEvent();
    }

    // --- Gema rendah 30 Hz ----------------------------------------------
    if (tension >= 0.35) {
      this.rumbleTimer -= deltaTime;
      if (this.rumbleTimer <= 0) {
        // Makin tegang, makin sering gemanya datang.
        this.rumbleTimer = 26 - tension * 15 + Math.random() * 6;
        audioManager.play('rumble', {
          category: 'ambience',
          volume: 0.14 + 0.2 * tension
        });
      }
    } else {
      this.rumbleTimer = Math.min(this.rumbleTimer, 10);
    }

    // --- Detak jantung makin rapat --------------------------------------
    if (tension >= 0.62) {
      this.heartbeatOn = true;
      this.heartbeatTimer -= deltaTime;
      if (this.heartbeatTimer <= 0) {
        // 1.05 detik pada batas bawah tegangan, mengecil ke ~0.6 detik.
        this.heartbeatTimer = Math.max(0.58, 1.05 - (tension - 0.62) * 1.35);
        audioManager.play('heartbeat', {
          category: 'sfx',
          volume: 0.2 + 0.42 * (tension - 0.62) / 0.38
        });
      }
    } else if (this.heartbeatOn && tension < 0.45) {
      this.heartbeatOn = false;
      this.heartbeatTimer = 0;
    }
  }

  private playDistantEvent(): void {
    const event = DISTANT_EVENTS[Math.floor(Math.random() * DISTANT_EVENTS.length)];
    audioManager.play(event.key, {
      category: event.category,
      volume: event.volume * (0.75 + Math.random() * 0.5)
    });
  }
}

export const ambienceDirector = new AmbienceDirector();
