// ============================================================
// data.js — Data dummy SITTA Universitas Terbuka
// Dimuat SEBELUM script.js (lihat tag <script> di tiap halaman).
// Bagian 1 (lampiran soal): dataPengguna, dataBahanAjar, dataTracking
// Bagian 2 (tambahan)     : DATA_DO, DATA_HISTORI (untuk dashboard)
// ============================================================

const dataPengguna = [
  {
    id: 1,
    nama: "Rina Wulandari",
    email: "rina@ut.ac.id",
    password: "rina123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Jakarta"
  },
  {
    id: 2,
    nama: "Agus Pranoto",
    email: "agus@ut.ac.id",
    password: "agus123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Makassar"
  },
  {
    id: 3,
    nama: "Siti Marlina",
    email: "siti@ut.ac.id",
    password: "siti123",
    role: "Puslaba",
    lokasi: "Pusat"
  },
  {
    id: 4,
    nama: "Doni Setiawan",
    email: "doni@ut.ac.id",
    password: "doni123",
    role: "Fakultas",
    lokasi: "FISIP"
  },
  {
    id: 5,
    nama: "Admin SITTA",
    email: "admin@ut.ac.id",
    password: "admin123",
    role: "Administrator",
    lokasi: "Pusat"
  }
];

const dataBahanAjar = [
  {
    kodeLokasi: "0TMP01",
    kodeBarang: "ASIP4301",
    namaBarang: "Pengantar Ilmu Komunikasi",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 548,
    cover: "img/pengantar_komunikasi.jpg"
  },
  {
    kodeLokasi: "0JKT01",
    kodeBarang: "EKMA4216",
    namaBarang: "Manajemen Keuangan",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 392,
    cover: "img/manajemen_keuangan.jpg"
  },
  {
    kodeLokasi: "0SBY02",
    kodeBarang: "EKMA4310",
    namaBarang: "Kepemimpinan",
    jenisBarang: "BMP",
    edisi: "1",
    stok: 278,
    cover: "img/kepemimpinan.jpg"
  },
  {
    kodeLokasi: "0MLG01",
    kodeBarang: "BIOL4211",
    namaBarang: "Mikrobiologi Dasar",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 165,
    cover: "img/mikrobiologi.jpg"
  },
  {
    kodeLokasi: "0UPBJJBDG",
    kodeBarang: "PAUD4401",
    namaBarang: "Perkembangan Anak Usia Dini",
    jenisBarang: "BMP",
    edisi: "4",
    stok: 204,
    cover: "img/paud_perkembangan.jpg"
  }
];

const dataTracking = {
  "2023001234": {
    nomorDO: "2023001234",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-25",
    paket: "0JKT01",
    total: "Rp 180.000",
    perjalanan:[
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-25 14:07:56",
        keterangan: "Tiba di Hub: TANGERANG SELATAN"
      },
      {
        waktu: "2025-08-25 18:45:30",
        keterangan: "Diteruskan ke Kantor Jakarta Selatan"
      }
    ]
  },
  "2023005678": {
    nomorDO: "2023005678",
    nama: "Agus Pranoto",
    status: "Dikirim",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-25",
    paket: "0UPBJJBDG",
    total: "Rp 220.000",
    perjalanan:[
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-25 14:07:56",
        keterangan: "Tiba di Hub: TANGERANG SELATAN"
      },
      {
        waktu: "2025-08-25 16:30:10",
        keterangan: "Diteruskan ke Kantor Kota Bandung"
      },
      {
        waktu: "2025-08-26 12:15:33",
        keterangan: "Tiba di Hub: Kota BANDUNG"
      },
      {
        waktu: "2025-08-26 15:06:12",
        keterangan: "Proses antar ke Cimahi"
      },
      {
        waktu: "2025-08-26 20:00:00",
        keterangan: "Selesai Antar. Penerima: Agus Pranoto"
      }
    ]
  }
};

// ============================================================
// BAGIAN 2 — Data tambahan untuk Dashboard
// ============================================================

// ---------- Data dummy Delivery Order (simulasi database) ----------
// Kunci = Nomor Delivery Order
const DATA_DO = {
  "2025001": {
    nama: "Budi Santoso",
    nim: "049123456",
    ekspedisi: "JNE Express",
    tanggalKirim: "2025-03-10",
    jenisPaket: "Paket Semester Genap (8 modul)",
    totalBayar: 385000,
    statusIndex: 5,
    riwayat: [
      { tgl: "2025-03-08 09:15", ket: "Pesanan diterima sistem" },
      { tgl: "2025-03-09 13:40", ket: "Bahan ajar dikemas di gudang UT" },
      { tgl: "2025-03-10 08:05", ket: "Paket diserahkan ke JNE Express" },
      { tgl: "2025-03-11 17:30", ket: "Paket dalam perjalanan ke kota tujuan" },
      { tgl: "2025-03-13 10:20", ket: "Paket tiba di kantor cabang tujuan" },
      { tgl: "2025-03-14 14:00", ket: "Paket diterima oleh Budi Santoso" }
    ]
  },
  "2025002": {
    nama: "Siti Rahmawati",
    nim: "049234567",
    ekspedisi: "J&T Express",
    tanggalKirim: "2025-03-12",
    jenisPaket: "Paket Modul Mata Kuliah Pilihan (4 modul)",
    totalBayar: 190000,
    statusIndex: 3,
    riwayat: [
      { tgl: "2025-03-10 10:00", ket: "Pesanan diterima sistem" },
      { tgl: "2025-03-11 15:20", ket: "Bahan ajar dikemas di gudang UT" },
      { tgl: "2025-03-12 09:45", ket: "Paket diserahkan ke J&T Express" },
      { tgl: "2025-03-13 19:10", ket: "Paket dalam perjalanan ke kota tujuan" }
    ]
  },
  "2025003": {
    nama: "Andi Prasetyo",
    nim: "049345678",
    ekspedisi: "POS Indonesia",
    tanggalKirim: "2025-03-14",
    jenisPaket: "Paket Registrasi Awal (12 modul)",
    totalBayar: 560000,
    statusIndex: 1,
    riwayat: [
      { tgl: "2025-03-13 11:30", ket: "Pesanan diterima sistem" }
    ]
  },
  "2025004": {
    nama: "Dewi Lestari",
    nim: "049456789",
    ekspedisi: "SiCepat",
    tanggalKirim: "2025-03-09",
    jenisPaket: "Paket Semester Ganjil (6 modul)",
    totalBayar: 295000,
    statusIndex: 4,
    riwayat: [
      { tgl: "2025-03-07 08:50", ket: "Pesanan diterima sistem" },
      { tgl: "2025-03-08 14:15", ket: "Bahan ajar dikemas di gudang UT" },
      { tgl: "2025-03-09 10:00", ket: "Paket diserahkan ke SiCepat" },
      { tgl: "2025-03-10 21:40", ket: "Paket dalam perjalanan ke kota tujuan" },
      { tgl: "2025-03-12 09:05", ket: "Paket tiba di kantor cabang tujuan" }
    ]
  },
  "2025005": {
    nama: "Rizky Maulana",
    nim: "049567890",
    ekspedisi: "JNE Express",
    tanggalKirim: "2025-03-15",
    jenisPaket: "Paket Semester Genap (8 modul)",
    totalBayar: 385000,
    statusIndex: 2,
    riwayat: [
      { tgl: "2025-03-13 16:20", ket: "Pesanan diterima sistem" },
      { tgl: "2025-03-14 10:10", ket: "Pesanan sedang diproses gudang" },
      { tgl: "2025-03-15 08:30", ket: "Bahan ajar dikemas di gudang UT" }
    ]
  },
  "2025006": {
    nama: "Maya Putri",
    nim: "049678901",
    ekspedisi: "J&T Express",
    tanggalKirim: "2025-03-11",
    jenisPaket: "Paket Modul Mata Kuliah Pilihan (4 modul)",
    totalBayar: 190000,
    statusIndex: 5,
    riwayat: [
      { tgl: "2025-03-09 09:00", ket: "Pesanan diterima sistem" },
      { tgl: "2025-03-10 11:25", ket: "Bahan ajar dikemas di gudang UT" },
      { tgl: "2025-03-11 09:15", ket: "Paket diserahkan ke J&T Express" },
      { tgl: "2025-03-12 20:00", ket: "Paket dalam perjalanan ke kota tujuan" },
      { tgl: "2025-03-14 08:45", ket: "Paket tiba di kantor cabang tujuan" },
      { tgl: "2025-03-14 16:30", ket: "Paket diterima oleh Maya Putri" }
    ]
  },
  "2025007": {
    nama: "Hendra Wijaya",
    nim: "049789012",
    ekspedisi: "POS Indonesia",
    tanggalKirim: "2025-03-13",
    jenisPaket: "Paket Registrasi Awal (12 modul)",
    totalBayar: 560000,
    statusIndex: 3,
    riwayat: [
      { tgl: "2025-03-11 13:00", ket: "Pesanan diterima sistem" },
      { tgl: "2025-03-12 10:30", ket: "Bahan ajar dikemas di gudang UT" },
      { tgl: "2025-03-13 09:00", ket: "Paket diserahkan ke POS Indonesia" },
      { tgl: "2025-03-14 18:20", ket: "Paket dalam perjalanan ke kota tujuan" }
    ]
  }
};

// Data dummy histori transaksi bahan ajar
// status: "Lunas" | "Menunggu Pembayaran" | "Dibatalkan"
const DATA_HISTORI = [
  { id: "TRX-0001", tgl: "2025-03-08", noDO: "2025001", nama: "Budi Santoso",   ket: "Paket Semester Genap (8 modul)",              total: 385000, status: "Lunas" },
  { id: "TRX-0002", tgl: "2025-03-10", noDO: "2025002", nama: "Siti Rahmawati", ket: "Paket Modul Mata Kuliah Pilihan (4 modul)",   total: 190000, status: "Lunas" },
  { id: "TRX-0003", tgl: "2025-03-13", noDO: "2025003", nama: "Andi Prasetyo",  ket: "Paket Registrasi Awal (12 modul)",            total: 560000, status: "Lunas" },
  { id: "TRX-0004", tgl: "2025-03-07", noDO: "2025004", nama: "Dewi Lestari",   ket: "Paket Semester Ganjil (6 modul)",             total: 295000, status: "Lunas" },
  { id: "TRX-0005", tgl: "2025-03-13", noDO: "2025005", nama: "Rizky Maulana",  ket: "Paket Semester Genap (8 modul)",              total: 385000, status: "Lunas" },
  { id: "TRX-0006", tgl: "2025-03-09", noDO: "2025006", nama: "Maya Putri",     ket: "Paket Modul Mata Kuliah Pilihan (4 modul)",   total: 190000, status: "Lunas" },
  { id: "TRX-0007", tgl: "2025-03-11", noDO: "2025007", nama: "Hendra Wijaya",  ket: "Paket Registrasi Awal (12 modul)",            total: 560000, status: "Lunas" },
  { id: "TRX-0008", tgl: "2025-03-15", noDO: "2025008", nama: "Lina Marlina",   ket: "Paket Semester Ganjil (6 modul)",             total: 295000, status: "Menunggu Pembayaran" },
  { id: "TRX-0009", tgl: "2025-03-14", noDO: "2025009", nama: "Fajar Nugroho",  ket: "Paket Modul Mata Kuliah Pilihan (4 modul)",   total: 190000, status: "Menunggu Pembayaran" },
  { id: "TRX-0010", tgl: "2025-03-06", noDO: "2025010", nama: "Tono Hartono",   ket: "Paket Semester Genap (8 modul)",              total: 385000, status: "Dibatalkan" }
];
