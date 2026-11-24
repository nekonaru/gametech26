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
