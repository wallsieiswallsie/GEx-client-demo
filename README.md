# Detail Package App

## Fitur Utama
1. **Autentikasi**
   - Register pengguna baru.
   - Login dengan kredensial yang terdaftar.

2. **Sinkronisasi Database**
   - Menggunakan **PostgreSQL** sebagai database utama.
   - Menyimpan data paket secara terstruktur.

3. **Input Data Paket** (`InputDetailPackage.jsx`)
   - Tambah data paket dengan detail:
     - Nama penerima/pengirim.
     - Nomor resi.
     - Panjang, lebar, tinggi (cm).
     - Berat aktual (kg).
     - Kode pengiriman (kapal / pesawat).

4. **Display Data Paket** (`DisplayDetailPackage.jsx`)
   - Menampilkan seluruh data paket dari database.
   - Menyertakan perhitungan:
     - **Berat volumetrik (P × L × T / divisor)**  
       - Divisor kapal: **4000**  
       - Divisor pesawat: **6000**
     - **Berat terpakai**: membandingkan berat aktual vs volumetrik.
     - **Harga pengiriman** berdasarkan moda pengiriman.

## Teknologi yang Digunakan
- **Frontend**: React.js
- **Backend**: Node.js + Hapi
- **Database**: PostgreSQL
- **ORM/Query Builder**: Knex.js
- **Auth**: JWT (JSON Web Token)
- **Cloud**: Google Cloud Storage

## Cara Menjalankan
1. Clone repositori ini
   ```bash
   git clone <repository-url>

2. Masuk ke direktori proyek
    cd detail-package-app
3. Install dependencies
    npm install
4. Jalankan server backend
    npm run dev
5. Jalankan frontend
    npm run start

## Note
- Pastikan PostgreSQL sudah terinstall dan dijalankan.
- Buat database sesuai konfigurasi .env.
- Fitur perhitungan berat volumetrik dan harga sudah otomatis tampil di modul DisplayDetailPackage.