/* =====================================================
   tracking-app.js : logika Vue untuk tracking-vue.html
   Membutuhkan: Vue 2 (CDN) dan js/dataBahanAjar.js
   ===================================================== */
var app = new Vue({
  el: '#app',

  data: {
    pengirimanList: dataBahanAjar.pengirimanList,
    paketList: dataBahanAjar.paket,
    stok: dataBahanAjar.stok,
    tracking: JSON.parse(JSON.stringify(dataBahanAjar.tracking)),

    // pencarian
    kodeCari: '',
    kodeHasil: '',       // nomor DO yang sedang ditampilkan
    sudahCari: false,

    // form DO baru
    form: { nim: '', nama: '', ekspedisi: '', paket: '', tanggal: '', total: 0 },
    errors: {},
    pesan: '',

    // header
    topCari: '',
    menuOpen: false,
    dropdownOpen: false
  },

  computed: {
    // Objek -> array agar bisa di-v-for, DO terbaru di atas
    daftarDO: function () {
      var t = this.tracking;
      return Object.keys(t).sort().reverse().map(function (no) {
        return Object.assign({ noDO: no }, t[no]);
      });
    },

    // Nomor DO otomatis: DO + tahun berjalan + sequence 3 digit
    nomorDOBerikutnya: function () {
      var maks = 0;
      Object.keys(this.tracking).forEach(function (no) {
        var n = parseInt(no.split('-')[1], 10);
        if (n > maks) maks = n;
      });
      var seq = String(maks + 1);
      while (seq.length < 3) seq = '0' + seq;
      return 'DO' + new Date().getFullYear() + '-' + seq;
    },

    paketTerpilih: function () {
      var kode = this.form.paket;
      return this.paketList.find(function (p) { return p.kode === kode; }) || null;
    },

    // isi paket -> pasangan kode + judul dari data stok
    isiPaketTerpilih: function () {
      if (!this.paketTerpilih) return [];
      var stok = this.stok;
      return this.paketTerpilih.isi.map(function (kode) {
        var item = stok.find(function (s) { return s.kode === kode; });
        return { kode: kode, judul: item ? item.judul : '(judul tidak ditemukan)' };
      });
    },

    // hasil pencarian (null jika belum cari / tidak ada)
    hasil: function () {
      if (!this.kodeHasil) return null;
      var d = this.tracking[this.kodeHasil];
      return d ? Object.assign({ noDO: this.kodeHasil }, d) : null;
    },
    namaPaketHasil: function () {
      if (!this.hasil) return '';
      var kode = this.hasil.paket;
      var p = this.paketList.find(function (x) { return x.kode === kode; });
      return p ? p.kode + ' — ' + p.nama : kode;
    }
  },

  watch: {
    // 1) Pilih paket -> total harga otomatis dari data paket
    'form.paket': function () {
      this.form.total = this.paketTerpilih ? this.paketTerpilih.harga : 0;
      if (this.paketTerpilih) this.$delete(this.errors, 'paket');
    },

    // 2) NIM hanya boleh angka (dibersihkan saat mengetik)
    'form.nim': function (baru) {
      var bersih = String(baru).replace(/\D/g, '').slice(0, 15);
      if (bersih !== baru) this.form.nim = bersih;
    },

    // 3) Kolom cari dikosongkan -> hasil lama ikut hilang
    kodeCari: function (baru) {
      if (!baru.trim()) { this.kodeHasil = ''; this.sudahCari = false; }
    }
  },

  methods: {
    formatRupiah: function (n) {
      return 'Rp ' + Number(n).toLocaleString('id-ID');
    },
    kelasStatus: function (status) {
      if (status === 'Selesai') return 'selesai';
      if (status === 'Dalam Perjalanan') return 'jalan';
      return 'proses';
    },

    // tanggal lokal format YYYY-MM-DD (fungsi Date)
    hariIni: function () {
      var d = new Date();
      var bln = ('0' + (d.getMonth() + 1)).slice(-2);
      var tgl = ('0' + d.getDate()).slice(-2);
      return d.getFullYear() + '-' + bln + '-' + tgl;
    },
    waktuSekarang: function () {
      var d = new Date();
      function p(n) { return ('0' + n).slice(-2); }
      return this.hariIni() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    },

    /* ----- pencarian ----- */
    cari: function () {
      this.kodeHasil = this.kodeCari.trim().toUpperCase();
      this.sudahCari = true;
    },
    lihat: function (noDO) {
      this.kodeCari = noDO;
      this.cari();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /* ----- form DO baru ----- */
    resetForm: function () {
      this.form = { nim: '', nama: '', ekspedisi: '', paket: '', tanggal: this.hariIni(), total: 0 };
      this.errors = {};
    },
    validasi: function () {
      var f = this.form, e = {};
      if (!f.nim) e.nim = 'NIM wajib diisi.';
      else if (f.nim.length < 8) e.nim = 'NIM minimal 8 digit angka.';

      var nama = f.nama.trim();
      if (!nama) e.nama = 'Nama wajib diisi.';
      else if (nama.length < 3) e.nama = 'Nama minimal 3 karakter.';
      else if (!/^[A-Za-z .'-]+$/.test(nama)) e.nama = 'Nama hanya boleh huruf dan spasi.';

      if (!f.ekspedisi) e.ekspedisi = 'Pilih ekspedisi.';
      if (!f.paket) e.paket = 'Pilih paket bahan ajar.';
      if (!f.tanggal) e.tanggal = 'Tanggal kirim wajib diisi.';

      this.errors = e;
      return Object.keys(e).length === 0;
    },
    simpan: function () {
      if (!this.validasi()) return;
      var no = this.nomorDOBerikutnya;
      var f = this.form;
      this.$set(this.tracking, no, {
        nim: f.nim,
        nama: f.nama.trim(),
        status: 'Diproses',
        ekspedisi: f.ekspedisi,
        tanggalKirim: f.tanggal,
        paket: f.paket,
        total: f.total,
        perjalanan: [{ waktu: this.waktuSekarang(), keterangan: 'DO dibuat dan menunggu penerimaan di loket' }]
      });
      this.pesan = 'DO ' + no + ' berhasil dibuat.';
      this.lihat(no);
      this.resetForm();
    },

    /* ----- header ----- */
    cariDariTopbar: function () {
      window.location.href = 'stok-vue.html?q=' + encodeURIComponent(this.topCari);
    },
    logout: function () {
      try { sessionStorage.clear(); } catch (e) {}
      window.location.href = 'index.html';
    }
  },

  created: function () {
    this.form.tanggal = this.hariIni();
  }
});
