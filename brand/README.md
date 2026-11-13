# Logo Asap yang Tak Padam

**Lilin Tak Padam**: lilin pemakaman dengan api yang tidak pernah padam. Api yang bisa padam, rasa bersalah yang tidak. Dipilih karena terbaca di semua ukuran, tegas di favicon, dan paling dekat dengan naskah.

Dibuat oleh BD Games, 2026.

## File

| Berkas | Isi |
|---|---|
| `symbol-dark.svg` | Simbol, untuk latar gelap |
| `symbol-light.svg` | Simbol, untuk latar terang |
| `symbol-mono.svg` | Simbol monokrom hitam, untuk cetakan satu warna |
| `symbol-mono-white.svg` | Simbol monokrom putih, untuk latar gelap pekat |
| `app-icon.svg` | Ikon aplikasi (tile gelap, gradien api) |
| `app-icon-maskable.svg` | Ikon maskable Android (glyph di zona aman 80%) |
| `lockup-horizontal-dark.svg` | Simbol + wordmark, latar gelap |
| `lockup-horizontal-light.svg` | Simbol + wordmark, latar terang |
| `lockup-stacked-dark.svg` | Simbol di atas wordmark, latar gelap |
| `lockup-stacked-light.svg` | Simbol di atas wordmark, latar terang |

Ikon PWA dan favicon sudah terpasang di `Game/public/` (`favicon.svg`, `favicon.ico`, `icon-192.png`, `icon-512.png`, `maskable-192.png`, `maskable-512.png`, `apple-touch-icon-180.png`). `og-image.png` (1200 x 630) ada di `Game/public/assets/brand/`.

## Warna

| Nama | HEX | Pakai |
|---|---|---|
| Bara | `#ff6b35` | Api (dasar) |
| Bara terang | `#ff8c1a` | Api (tengah gradien) |
| Emas | `#ffcc00` | Api (ujung gradien) |
| Bara gelap | `#d9481f` | Api di latar terang |
| Batu bara | `#0a0a0a` | Latar tile |
| Tulang | `#e0ddd5` | Badan lilin di latar gelap |
| Arang | `#141414` | Badan lilin di latar terang |

Gradien api hanya untuk ikon aplikasi. Cetakan dan satu warna memakai `symbol-mono.svg`.

## Aturan singkat

- **Ruang bersih**: jarak minimum di sekeliling simbol selebar badan lilin (±1/4 tinggi simbol).
- **Ukuran minimum**: 16 px untuk simbol monokrom, 32 px untuk simbol berwarna.
- **Latar**: simbol terang di latar gelap, simbol gelap di latar terang. Jangan taruh simbol bara di atas latar jingga.
- **Wordmark**: `ASAP` tebal (Courier New Bold) + `YANG TAK PADAM` berjarak lebar. Jangan mengganti font, jangan menulis ulang dengan font lain.
- **Jangan**: memutar, meregangkan, menaruh simbol di dalam bentuk lain, mengganti warna gradien, atau menambah efek bayangan/glow.

## Catatan teknis

Wordmark memakai `<text>` dengan Courier New; untuk produksi cetak, konversi teks menjadi outline. Semua simbol adalah `viewBox 0 0 256 256`, tanpa `<text>`, tanpa raster, tanpa filter.
