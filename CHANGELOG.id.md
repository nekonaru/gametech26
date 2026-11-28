## v4.0.0

Pembaruan sistem dengan dua puzzle baru, impor save, Pengaturan cepat, dan pemulihan grafis yang aman.

## Fitur baru

- **Bab kode balai.** Bab b24 menambah puzzle radio Morse dan keypad telepon, serta ending 15.
- **Impor save.** Layar Muat menerima berkas save tervalidasi ke Slot 1.
- **Pengaturan cepat.** Tombol di HUD membuka Pengaturan saat bermain dan kembali ke game saat ditutup.
- **Pemulihan grafis.** Konteks WebGL yang hilang menjeda game dan melanjutkannya dengan aman saat pulih.

## Peningkatan

- **Variasi puzzle.** Layar puzzle kini mendukung delapan tipe dengan aturan Bantuan dan Lewati yang sama.
- **Umpan balik status.** Hasil impor ditampilkan di layar Muat tanpa meninggalkannya.

## Perbaikan bug

- **Jumlah listener.** Tombol Pengaturan cepat memakai satu handler terikat, bukan listener yang menumpuk.

## v3.0.0

Pembaruan naratif dengan rekaman echo, New Game Plus, efek persepsi, dan bab mimpi baru.

## Fitur baru

- **Bab mimpi.** Bab b23 menambah rekaman echo, dua ending, dan tab Rekaman baru di ponsel.
- **New Game Plus.** Selesaikan satu ending untuk membawa variabel, echo, dan ending terbuka ke permainan baru.
- **Persepsi.** Keyakinan rendah mengubah warna dunia dan menambah bisikan jauh, dinonaktifkan oleh setelan aksesibilitas.

## Peningkatan

- **Katalog echo.** Rekaman didefinisikan di `echoes.json` dan divalidasi seperti konten lain.
- **Nilai save.** Jalur permainan baru dan migrasi menjaga konsistensi field state baru.

## Perbaikan bug

- **State menu.** New Game Plus tetap nonaktif sampai satu ending terbuka.

## v2.0.0

Pembaruan pengalaman dan mekanik dengan stealth, crafting, bab baru, dan antarmuka yang lebih jelas.

## Fitur baru

- **Bab stealth.** Bab b22 menambah rute patroli, meter deteksi, zona sembunyi, dan ending 12.
- **Crafting.** Resep dari `recipes.json` bisa dirakit lewat panel baru di inventaris.
- **Pilihan terkunci.** Opsi dialog yang syaratnya belum terpenuhi tetap tampil dengan alasan singkat.
- **Token desain.** Focus ring, token gerak, dan dukungan reduced motion berlaku di seluruh antarmuka.

## Peningkatan

- **Umpan balik deteksi.** HUD menampilkan deteksi dan status sembunyi lewat meter ringkas.
- **Kompatibilitas save.** Save lama mendapat nilai bawaan untuk variabel baru saat dimuat.
- **Interaksi lebih halus.** Tombol punya state aktif dan panel modal memakai animasi masuk yang konsisten.

## Perbaikan bug

- **Identitas dialog.** Pilihan tanpa node tujuan tetap cocok dengan opsi yang benar.
- **Kebersihan listener.** Tombol crafting inventaris memakai satu handler terikat, bukan listener yang menumpuk.

## v1.1.0

Pembaruan konten dan keandalan yang menambah bab baru, mekanik bayang pengikut, dan perbaikan di penyimpanan, input, audio, antarmuka, serta rendering.

## Fitur baru

- **Bab lorong bayang.** Bab b21 menambah scene `lorong_bayang` dan ending 11 dengan dialog Indonesia dan Inggris.
- **Bayang pengikut.** Op skrip `startChase` dan `stopChase` memunculkan bayang yang bereaksi terhadap jarak pemain dan nonaktif di Mode Naratif serta Horor Lembut.
- **Sisi joystick.** Pilihan joystick kiri atau kanan yang tersimpan kini benar-benar mengubah zona kendali sentuh.

## Peningkatan

- **Visual deterministik.** Waktu grain mengikuti delta frame nyata, tick dinamis tidak lagi melewati satu panggilan, dan baseline regresi visual stabil antarjalankan.
- **Loop render lebih ringan.** Kamera, pencahayaan, dan pemeriksaan layar memakai objek scratch atau membatasi baca DOM, dan tekstur bersama tidak dibuang antarscene.
- **Pembongkaran bersih.** Sub-sistem render, listener jendela, dan langganan pengaturan dilepas saat dispose, termasuk listener konteks audio dan global game.
- **Validasi konten lebih aman.** `loadScene` kini mewajibkan id bab yang ada, dan pilihan dialog dengan `onSelect` tanpa node tujuan tetap berjalan.

## Perbaikan bug

- **Penyimpanan.** Kegagalan IndexedDB beralih ke localStorage, dan pemuatan menolak save rusak atau checksum tidak cocok.
- **Input sentuh.** Identifier sentuh terpisah membuat gerak dan menoleh tetap bekerja, dan pengikatan ulang tombol menukar kunci yang bertabrakan.
- **Audio.** Suara prosedural mematuhi opsi spasial dan id sumber unik, serta listener jendela dilepas saat dispose.
- **Ponsel dan antarmuka.** Interval jam ponsel dan listener yang menumpuk dihentikan, listener pengikatan tombol bisa dibatalkan, dan listener skip prologue dilepas saat layar ditutup.
- **Alur skrip.** Rangkaian operasi lama berhenti setelah bab berganti, dan peristiwa tegangan hanya dipancarkan saat nilainya berubah.
