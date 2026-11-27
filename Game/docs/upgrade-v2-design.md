# Desain Update Besar v2.0.0

Dokumen ini adalah rancangan akhir untuk paket pembaruan besar `Asap yang Tak Padam`.
Semua ide di sini berupa rencana, bukan fakta tentang keadaan saat ini.
Bahasa dokumen mengikuti proyek, yaitu Bahasa Indonesia.
Nama file, op, dan field memakai Bahasa Inggris sesuai konvensi kode.

## 1. Tujuan dan batasan

**Tujuan:** mengubah permainan dari cerita linear dengan satu mekanik kejaran menjadi sistem horor naratif modular yang memiliki banyak cabang, mekanik, dan ukuran kualitas yang jelas.

**Batasan:**

- Tetap static site tanpa backend, database, atau akun.
- UI dan docs berbahasa Indonesia dengan padanan English.
- Lint harus tetap 0 error, 45 tes lama tidak boleh dilemahkan, dan 7 audit suite harus lolos.
- Auto-play tidak boleh stall, regresi visual memakai ambang yang sama, dan Lighthouse tetap di bawah budget 4,75 MB.
- `dist/` tetap dikomit agar game bisa dimainkan tanpa toolchain.
- Rilis memakai alur branch, PR, CI, auto-merge, lalu tag hanya setelah CI hijau.

## 2. Versi dan penanda

Versi target adalah `2.0.0` karena paket ini menambah skema save dan banyak fitur baru yang mengubah perilaku lama.
Tag memakai `v2.0.0` dan judul rilis memakai `Asap yang Tak Padam v2.0.0`.

## 3. Daftar fitur final

Tanda **M** berarti wajib, **S** berarti sebaiknya masuk, dan **C** berarti opsional.

| No | Fitur | Prioritas | Area |
|----|-------|-----------|------|
| F01 | Save skema v2 dengan migrasi otomatis dari v1 | M | `core/save.ts` |
| F02 | Feature flag per sistem di Pengaturan | M | `core/settings.ts` |
| F03 | Kontrak konten v2 untuk patrol, sembunyi, resep, echo, jadwal | M | `public/data/` |
| F04 | Ops skrip baru dan pendaftaran di validator | M | `scriptRunner.ts` |
| F05 | Deteksi garis pandang dan kebisingan | M | `game/stealth.ts` |
| F06 | Tempat sembunyi aktif | M | `game/stealth.ts` |
| F07 | Patrol NPC dengan rute waypoint | M | `game/patrol.ts` |
| F08 | Kejaran lanjutan yang bisa kehilangan jejak | S | `game/chase.ts` |
| F09 | Crafting berbasis resep | M | `game/crafting.ts` |
| F10 | Inventory dua slot aktif dan hotbar sentuh | S | `ui/inventory.ts` |
| F11 | Persepsi dan halusinasi yang bisa dimatikan | S | `game/perception.ts` |
| F12 | Siklus siang malam dan jadwal NPC | S | `game/schedule.ts` |
| F13 | Echo collectible yang diputar lewat ponsel | S | `game/phone.ts` |
| F14 | Mode foto ponsel untuk petunjuk visual | C | `ui/phone.ts` |
| F15 | Quick time event opsional | C | `core/input.ts` |
| F16 | Puzzle radio Morse | S | `ui/puzzleUI.ts` |
| F17 | Puzzle keypad telepon | S | `ui/puzzleUI.ts` |
| F18 | Puzzle rotasi cermin | S | `ui/puzzleUI.ts` |
| F19 | Puzzle memori urutan ketukan | C | `ui/puzzleUI.ts` |
| F20 | Puzzle penyambungan kabel | C | `ui/puzzleUI.ts` |
| F21 | Puzzle roda sandi | C | `ui/puzzleUI.ts` |
| F22 | Enam bab linear b22 sampai b27 | M | `public/data/chapters/` |
| F23 | Empat bab cabang baru | S | `public/data/chapters/` |
| F24 | Lima ending baru ending 12 sampai ending 16 | M | `endings.json` |
| F25 | POV bergantian di dalam satu bab | S | `scriptRunner.ts` |
| F26 | New Game Plus | S | `ui/menu.ts` |
| F27 | Ringkasan keputusan di awal bab | S | `ui/hud.ts` |
| F28 | Galeri ending dengan filter pencapaian | C | `ui/gallery.ts` |
| F29 | Menu utama dengan sembilan entri | S | `ui/menu.ts` |
| F30 | HUD meter deteksi, sembunyi, dan kompas delapan arah | S | `ui/hud.ts` |
| F31 | Dialog dengan siluet, gaya teks, dan riwayat dicari | S | `ui/dialog.ts` |
| F32 | Pengaturan perluasan dan remap gamepad | S | `ui/settingsUI.ts` |
| F33 | Impor save tervalidasi dan thumbnail slot | S | `ui/loadUI.ts` |
| F34 | PWA offline penuh | S | `core/sw.ts` |
| F35 | Notifikasi pencapaian untuk echo dan resep | C | `game/achievements.ts` |
| F36 | Kualitas adaptif berdasarkan FPS | S | `render/postprocess.ts` |
| F37 | Penanganan hilangnya konteks WebGL | S | `core/engine.ts` |
| F38 | Instancing dan LOD untuk aset scene | S | `render/scenes/` |
| F39 | Tes unit untuk sistem baru | M | `*.test.ts` |
| F40 | Regresi visual delapan view dan auto-play tiga jalur | S | `tools/` |
| F41 | Warning lint diturunkan ke nol | C | seluruh `src/` |
| F42 | Dokumen penulisan konten v2 | M | `docs/chapter-spec.md` |

## 4. Skema data baru

Semua berkas baru diletakkan di `public/data/` dan mengikuti aturan locale yang sudah ada.
Setiap kunci teks memakai kunci locale, bukan kalimat tersisip di JSON.

### 4.1 Patrol dan zona sembunyi

Berkas: `public/data/patrols.json`

```json
{
  "routes": [
    {
      "id": "patroli_jalan",
      "scene": "jalan_desa",
      "points": [[0, 0, -2], [3, 0, -4], [3, 0, -7]],
      "waitMs": 1200,
      "speed": 1.6,
      "viewDistance": 7,
      "viewAngle": 70
    }
  ],
  "hideZones": [
    { "id": "lemari_kamar", "scene": "rumah_dimas", "position": [-2, 0, -4], "radius": 1.2 }
  ]
}
```

### 4.2 Resep crafting

Berkas: `public/data/recipes.json`

```json
{
  "recipes": [
    {
      "id": "senter_rusak",
      "inputs": ["kabel", "baterai"],
      "output": "senter_rusak",
      "titleKey": "craft.senter.title",
      "descKey": "craft.senter.desc"
    }
  ]
}
```

### 4.3 Echo

Berkas: `public/data/echoes.json`

```json
{
  "echoes": [
    {
      "id": "echo_suara_kaki",
      "titleKey": "echo.kaki.title",
      "bodyKey": "echo.kaki.body",
      "audioKey": "footstep",
      "unlockClue": "jejak_kaki"
    }
  ]
}
```

### 4.4 Jadwal NPC

Berkas: `public/data/schedule.json`

```json
{
  "schedules": [
    { "npc": "rudi", "scene": "kedai_kopi", "from": "16:00", "to": "19:00" },
    { "npc": "rudi", "scene": "rumah_dimas", "from": "19:00", "to": "23:00" }
  ]
}
```

## 5. Save skema v2

`SAVE_VERSION` naik menjadi `2`.
Field lama tetap dibaca.
Field baru diisi nilai bawaan saat migrasi.

```ts
interface SaveDataV2 extends SaveDataV1 {
  saveVersion: 2;
  migratedFrom?: 1;
  features: {
    stealth: boolean;
    crafting: boolean;
    perception: boolean;
    echo: boolean;
    camera: boolean;
    qte: boolean;
  };
  crafted: string[];
  echoes: string[];
  perception: number;
  newGamePlus: boolean;
}
```

**Aturan migrasi:** `isValidSaveData` menerima versi 1 dan 2, lalu `migrateSave` mengisi field baru tanpa membuang checksum lama yang masih cocok.
Checksum dihitung ulang setelah migrasi dan ditulis kembali oleh `put()`.

## 6. Ops skrip baru

Semua op berikut masuk `KNOWN_OPS` di `tools/validate-content.mjs` dan `switch` di `executeOperation`.

| Op | Field | Perilaku |
|----|-------|----------|
| `startPatrol` | `id`, `route`, `speed?`, `viewDistance?`, `viewAngle?` | Mengaktifkan patrol dari rute JSON |
| `stopPatrol` | `id` | Menghentikan patrol dan menghapus figur dari scene |
| `setHideZone` | `id`, `active` | Mengaktifkan atau menonaktifkan zona sembunyi |
| `setNoise` | `radius`, `duration?` | Menimbulkan kebisingan yang menarik patrol |
| `craft` | `recipe` | Memakai resep, membuang input, menambah output |
| `giveEcho` | `id` | Menambah rekaman ke daftar echo pemain |
| `setPerception` | `value?`, `delta?` | Mengubah variabel `keyakinan` dan memicu efek persepsi |

**Keputusan desain:** nilai `deteksi` dan `tersembunyi` ditulis ke `gameState.variables` sebagai `deteksi` dan `tersembunyi`.
Dengan begitu kondisi lama `vars.keyakinan` tetap berfungsi dan kondisi baru cukup memakai `vars.deteksi >= 0.7`, tanpa mengubah tanda tangan `evaluateCondition`.

## 7. Modul baru dan API

```ts
// game/stealth.ts
export interface PatrolRoute {
  id: string;
  scene: string;
  points: Array<[number, number]>;
  waitMs?: number;
  speed?: number;
  viewDistance?: number;
  viewAngle?: number;
}
export interface HideZone {
  id: string;
  scene: string;
  position: [number, number, number];
  radius?: number;
}
export class StealthDirector {
  load(data: { routes: PatrolRoute[]; hideZones: HideZone[] }): void;
  update(dt: number, ctx: StealthContext): void;
  getDetection(): number;
  isHidden(): boolean;
  dispose(): void;
}
```

```ts
// game/crafting.ts
export class CraftingDirector {
  load(recipes: Recipe[]): void;
  canCraft(id: string): boolean;
  craft(id: string): boolean;
  dispose(): void;
}
```

```ts
// game/perception.ts
export class PerceptionDirector {
  update(dt: number, keyakinan: number, flags: AccessibilityFlags): void;
  dispose(): void;
}
```

**Integrasi:** `Game` membuat satu instance per director di `setupGameSystems()`, memanggil `update()` dari `updateGameSystems()`, dan melepasnya di `dispose()`.
Komunikasi dengan naskah memakai `eventBus`, bukan referensi langsung dari `scriptRunner`.

## 8. Perubahan UI dan pengaturan

- **Feature flag:** `settings.features` berisi enam sakelar. Fitur M aktif secara bawaan, fitur C bernilai false sampai pemain menyalakannya.
- **Menu:** sembilan entri dengan New Game Plus hanya aktif bila ada save selesai.
- **HUD:** meter deteksi dan status sembunyi muncul hanya saat stealth aktif. Kompas memakai delapan arah dan mengikuti `goalFor`.
- **Dialog:** pilihan dengan syarat yang tidak terpenuhi tetap terlihat, bertanda kunci, dan menampilkan alasan singkat dari locale.
- **Pengaturan:** preset grafis, resolusi adaptif, volume teks, remap gamepad, palet buta warna, dan batas efek kejut.
- **Muat:** tombol Impor memakai `isValidSaveData`, lalu menulis ke slot pilihan. Ekspor sudah ada dan dipertahankan.
- **Ponsel:** tab Rekaman baru untuk echo dan tombol kamera bila fitur foto aktif.

## 9. Validator tambahan

`validate-content.mjs` dan validator lain perlu menerima:

- setiap `startPatrol.route` harus ada di `patrols.json`;
- setiap `setHideZone.id` harus ada di `hideZones`;
- setiap `craft.recipe` harus ada di `recipes.json`;
- setiap `giveEcho.id` harus ada di `echoes.json`;
- setiap `playSound.key` dari echo harus ada di katalog audio;
- semua puzzle baru memiliki `onSolve`, `onSkip`, dan `onHelp`;
- setiap bab baru punya `chapterEnd` atau `ending` yang dapat dicapai;
- tidak ada kunci locale baru yang hilang di ID atau EN.

## 10. Tes dan ukuran keberhasilan

- **Kompilasi:** `npx tsc --noEmit` menghasilkan 0 error.
- **Lint:** 0 error, warning tidak naik di atas baseline paket yang sedang dikerjakan.
- **Tes:** semua 45 tes lama lolos, tes baru untuk stealth, crafting, migrasi save, ops, dan puzzle lolos. Target cakupan cabang modul baru minimal 80 persen.
- **Audit:** 7 suite lolos, termasuk simetri locale ID dan EN.
- **Auto-play:** satu jalur penuh dan dua jalur smoke mencapai tiga ending berbeda, tanpa stall dan tanpa error konsol.
- **Visual:** delapan view regresi visual berada di bawah ambang lama. Baseline hanya ditulis ulang bila perubahan visual memang disengaja.
- **Kinerja:** Lighthouse performance minimal 0,4, accessibility minimal 0,7, best practices dan SEO minimal 0,9, bobot total di bawah 4,75 MB.
- **Kompatibilitas:** save versi 1 terbuka, termigrasi, dan tetap bisa dilanjutkan.

## 11. Urutan PR

| PR | Isi | Alasan |
|----|-----|--------|
| 1 | F01, F02, F03, F04, F42 | Fondasi sebelum fitur lain menyentuh state |
| 2 | F05, F06, F07, F08 | Sistem stealth dan patrol |
| 3 | F09, F10 | Inventory dan crafting |
| 4 | F11, F12, F13, F14, F15 | Persepsi, jadwal, echo, foto, QTE |
| 5 | F16 sampai F21 | Puzzle baru |
| 6 | F22, F23, F24, F25 | Konten bab dan ending batch pertama |
| 7 | F26, F27, F28 | New Game Plus, ringkasan, galeri |
| 8 | F29 sampai F35 | Menu, HUD, dialog, pengaturan, muat, PWA |
| 9 | F36 sampai F41 | Kinerja, tes, regresi visual, lint |
| 10 | Changelog bilingual, versi 2.0.0, tag, release | Rilis setelah CI hijau |

## 12. Risiko dan penanganan

- **Volume konten:** tiap bab butuh JSON, locale ID dan EN, serta jalur keluar yang tervalidasi. Dibagi dua batch agar auto-play tetap cepat.
- **Waktu CI:** auto-play penuh dengan tiga cabang bisa mendekati batas 25 menit. Pakai satu jalur penuh dan dua jalur smoke terarah.
- **Budget aset:** puzzle dan audio baru memakai aset prosedural atau rekaman kecil agar Lighthouse tidak turun.
- **Kompatibilitas save:** migrasi v1 ke v2 wajib menangani save tanpa field baru dan save tanpa checksum.
- **Feature flag:** semua sistem baru bisa dimatikan supaya pemain lama dan harness tidak mengalami perubahan mendadak.
- **Regresi visual:** ambang tidak pernah dilonggarkan. Baseline hanya diperbarui bila perubahan visual memang disengaja dan dicatat di commit terpisah.

## 13. Definisi selesai

Paket dinyatakan selesai bila semua kriteria di bagian 10 terpenuhi, perubahan sudah dikomit dan didorong, CI hijau, PR di-merge, `dist/` sesuai sumber, smoke test `node serve.cjs` memberi HTTP 200, dan rilis v2.0.0 memiliki catatan bilingual yang sejajar dengan changelog.
