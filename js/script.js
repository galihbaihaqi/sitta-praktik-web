// ============================================================
// script.js — SITTA Universitas Terbuka
// Gabungan: Login + Dashboard (greeting, jam, cari DO, laporan,
// histori) + Tracking Pengiriman + Informasi Stok Bahan Ajar
// Catatan: file ini dibaca SETELAH js/data.js dimuat
// (data dummy ada di data.js; di sini hanya logika/DOM).
// Satu file dipakai di index.html, dashboard.html, tracking.html
// DAN stok.html.
// Bagian untuk tiap halaman hanya jalan jika elemennya ada di halaman.
// ============================================================

// ---------- Helper: ambil elemen by ID ----------
const $ = (id) => document.getElementById(id);

// ---------- Validasi format email ----------
const emailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ============================================================
// BAGIAN 1 — DATA & HELPER UMUM
// ============================================================

// ---------- Manajemen akun ----------
// Akun demo bawaan — bisa juga diganti dengan dataPengguna dari data.js
const AKUN_DEMO = [{ email: "admin@email.com", password: "123456" }];

function ambilAkun() {
  // Gabungkan akun demo + akun dari data.js (dataPengguna) + akun baru dari localStorage
  let dariDataJs = [];
  if (typeof dataPengguna !== "undefined") {
    dariDataJs = dataPengguna.map(function (p) {
      return { email: p.email, password: p.password };
    });
  }

  let tersimpan = [];
  try {
    tersimpan = JSON.parse(localStorage.getItem("akun") || "[]");
  } catch (e) {}

  return AKUN_DEMO.concat(dariDataJs).concat(tersimpan);
}

function simpanAkun(akunBaru) {
  let tersimpan = [];
  try {
    tersimpan = JSON.parse(localStorage.getItem("akun") || "[]");
  } catch (e) {}
  tersimpan.push(akunBaru);
  try {
    localStorage.setItem("akun", JSON.stringify(tersimpan));
  } catch (e) {}
}

// ---------- Nama pengguna yang sedang login ----------
// Sesi disimpan login sebagai email di sessionStorage("userLogin").
// Nama dicari di dataPengguna (data.js) berdasarkan email; jika tidak
// ada, dipakai bagian depan email (admin@email.com -> "Admin").
function getNamaPengguna() {
  let email = "";
  try {
    email = sessionStorage.getItem("userLogin") || "";
  } catch (e) {}
  if (!email) return "Pengguna";

  if (typeof dataPengguna !== "undefined") {
    const p = dataPengguna.find(function (x) { return x.email === email; });
    if (p && (p.nama || p.name)) return p.nama || p.name;
  }

  const depan = email.split("@")[0];
  return depan.charAt(0).toUpperCase() + depan.slice(1);
}

// ---------- Logout (dipanggil dari tombol "Keluar") ----------
function logout() {
  try {
    sessionStorage.removeItem("userLogin");
  } catch (e) {}
  window.location.href = "index.html";
}

// ---------- Helper modal ----------
const buka  = (id) => $(id).classList.add("show");
const tutup = (id) => $(id).classList.remove("show");

function tampilPesan(tipe, judul, isi) {
  $("boxPesan").className = "modal " + tipe;
  $("pesanJudul").textContent = judul;
  $("pesanIsi").textContent   = isi;
  buka("modalPesan");
}

// Tombol data-close menutup overlay yang disebutkan
document.querySelectorAll("[data-close]").forEach(function (el) {
  el.addEventListener("click", function () {
    tutup(el.dataset.close);
  });
});

// Klik di luar modal menutup overlay
document.querySelectorAll(".overlay").forEach(function (ov) {
  ov.addEventListener("click", function (e) {
    if (e.target === ov) ov.classList.remove("show");
  });
});

// Tekan Escape menutup semua overlay
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".overlay").forEach(function (o) {
      o.classList.remove("show");
    });
  }
});

// ============================================================
// BAGIAN 2 — HALAMAN LOGIN (index.html)
// Hanya aktif jika ada elemen #formLogin
// ============================================================
function initLogin() {

  // ---------- LOGIN ----------
  $("formLogin").addEventListener("submit", function (e) {
    e.preventDefault();

    const email    = $("email").value.trim();
    const password = $("password").value;

    if (!email || !password) {
      tampilPesan("error", "Login gagal", "Email dan password wajib diisi.");
      return;
    }

    const cocok = ambilAkun().some(function (a) {
      return a.email === email && a.password === password;
    });

    if (!cocok) {
      tampilPesan("error", "Login gagal", "Email/password yang anda masukkan salah.");
      return;
    }

    // Simpan sesi pengguna ke sessionStorage
    try {
      sessionStorage.setItem("userLogin", email);
    } catch (e) {}

    tampilPesan("success", "Login berhasil", "Selamat datang, " + email + "!");

    // Tombol OK pada modal pesan mengarahkan ke dashboard
    const tombolOkModal = document.querySelector('#boxPesan button[data-close="modalPesan"]');
    tombolOkModal.onclick = function () {
      window.location.href = "dashboard.html";
    };
  });

  // ---------- LUPA PASSWORD ----------
  $("btnLupa").addEventListener("click", function () {
    $("lupaMsg").textContent = "";
    $("formLupa").reset();
    buka("modalLupa");
    $("lupaEmail").focus();
  });

  $("formLupa").addEventListener("submit", function (e) {
    e.preventDefault();
    const msg   = $("lupaMsg");
    const email = $("lupaEmail").value.trim();

    if (!emailValid(email)) {
      msg.className   = "msg err";
      msg.textContent = "Masukkan alamat email yang valid.";
      return;
    }

    msg.className   = "msg ok";
    msg.textContent = "Tautan reset password telah dikirim ke " + email + ".";
  });

  // ---------- DAFTAR ----------
  $("btnDaftar").addEventListener("click", function () {
    $("daftarMsg").textContent = "";
    $("formDaftar").reset();
    buka("modalDaftar");
    $("daftarEmail").focus();
  });

  $("formDaftar").addEventListener("submit", function (e) {
    e.preventDefault();
    const msg    = $("daftarMsg");
    const email  = $("daftarEmail").value.trim();
    const p1     = $("daftarPass").value;
    const p2     = $("daftarPass2").value;

    const gagal = function (t) {
      msg.className   = "msg err";
      msg.textContent = t;
    };

    if (!emailValid(email))                               return gagal("Masukkan alamat email yang valid.");
    if (p1.length < 6)                                   return gagal("Password minimal 6 karakter.");
    if (p1 !== p2)                                       return gagal("Password dan ulangi password tidak sama.");
    if (ambilAkun().some(function (a) { return a.email === email; }))
                                                          return gagal("Email sudah terdaftar.");

    simpanAkun({ email: email, password: p1 });
    tutup("modalDaftar");
    tampilPesan("success", "Pendaftaran berhasil", "Akun dibuat. Silakan login dengan email dan password Anda.");
    $("email").value    = email;
    $("password").value = "";
  });
}

// ============================================================
// BAGIAN 3 — HALAMAN DASHBOARD (dashboard.html)
// Hanya aktif jika ada elemen #greeting
// ============================================================

// Tahapan status pengiriman (urutan = index)
const TAHAPAN = [
  "Pesanan Dibuat",      // 0
  "Diproses",            // 1
  "Dikemas",             // 2
  "Dikirim",             // 3
  "Tiba di Kota Tujuan", // 4
  "Diterima"             // 5
];

// Index tahapan -> warna status
function warnaStatus(idx) {
  if (idx >= TAHAPAN.length - 1) return "selesai";   // hijau
  if (idx >= 3) return "perjalanan";                 // biru
  return "proses";                                   // oranye
}

// ---------- Util format ----------
function rupiah(angka) {
  if (typeof angka === "string" && isNaN(Number(angka))) return angka; // sudah berformat, mis. "Rp 180.000"
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

function tanggalIndo(str) {
  const d = new Date(str.replace(" ", "T"));
  if (isNaN(d)) return str;
  let hasil = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  if (str.includes(" ")) {
    hasil += ", " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":");
  }
  return hasil;
}

// Cegah XSS saat menyisipkan teks ke innerHTML
function esc(teks) {
  const el = document.createElement("div");
  el.textContent = teks;
  return el.innerHTML;
}

// ---------- Greeting + jam ----------
function getSalam(jam) {
  if (jam >= 4  && jam < 11) return "Selamat pagi";
  if (jam >= 11 && jam < 15) return "Selamat siang";
  if (jam >= 15 && jam < 18) return "Selamat sore";
  return "Selamat malam";
}

function updateWaktu() {
  const now  = new Date();
  const nama = getNamaPengguna();

  $("greeting").textContent = getSalam(now.getHours()) + ", " + nama + "!";

  $("clock").textContent =
    now.toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }) + " — " +
    now.toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).replace(/\./g, ":") + " WIB";
}

function isiInfoPengguna() {
  const nama = getNamaPengguna();
  if ($("topNama"))   $("topNama").textContent   = nama;
  if ($("topAvatar")) $("topAvatar").textContent = nama.charAt(0).toUpperCase();
}

// ---------- Pencarian Delivery Order ----------
function renderHasil(noDO, data) {
  const idx    = data.statusIndex;
  const tone   = warnaStatus(idx);
  const persen = Math.round((idx / (TAHAPAN.length - 1)) * 100);

  // Stepper tahapan
  const stepper = TAHAPAN.map(function (label, i) {
    const kelas = i < idx ? "done" : i === idx ? "current" : "todo";
    return '<li class="step ' + kelas + '">' +
             '<span class="step-dot">' + (i < idx ? "✓" : "") + "</span>" +
             '<span class="step-label">' + esc(label) + "</span>" +
           "</li>";
  }).join("");

  // Riwayat perjalanan (terbaru di atas)
  const riwayat = data.riwayat.slice().reverse().map(function (r, i) {
    return '<li class="' + (i === 0 ? "latest" : "") + '">' +
             "<time>" + esc(tanggalIndo(r.tgl)) + "</time>" +
             "<span>" + esc(r.ket) + "</span>" +
           "</li>";
  }).join("");

  $("hasilDO").innerHTML =
    '<div class="do-card">' +

      '<div class="do-head">' +
        "<div>" +
          '<p class="do-label">Nama Mahasiswa</p>' +
          '<h3 class="do-nama">' + esc(data.nama) + "</h3>" +
          '<p class="do-nim">NIM ' + esc(data.nim) + " · DO " + esc(noDO) + "</p>" +
        "</div>" +
        '<span class="badge badge-' + tone + '">' + esc(TAHAPAN[idx]) + "</span>" +
      "</div>" +

      '<div class="do-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"' +
           ' aria-valuenow="' + persen + '" aria-label="Progres pengiriman ' + persen + ' persen">' +
        '<div class="bar"><div class="bar-fill bar-' + tone + '" style="width:0%" data-target="' + persen + '"></div></div>' +
        '<span class="bar-persen">' + persen + "%</span>" +
      "</div>" +

      '<ol class="stepper">' + stepper + "</ol>" +

      '<table class="do-table"><tbody>' +
        "<tr><th>Ekspedisi</th><td>" + esc(data.ekspedisi) + "</td></tr>" +
        "<tr><th>Tanggal Kirim</th><td>" + esc(tanggalIndo(data.tanggalKirim)) + "</td></tr>" +
        "<tr><th>Jenis Paket</th><td>" + esc(data.jenisPaket) + "</td></tr>" +
        '<tr><th>Total Pembayaran</th><td class="harga">' + rupiah(data.totalBayar) + "</td></tr>" +
      "</tbody></table>" +

      '<h4 class="riwayat-judul">Riwayat perjalanan paket</h4>' +
      '<ul class="riwayat">' + riwayat + "</ul>" +
    "</div>";

  // Animasi progress bar: set lebar setelah elemen dirender
  requestAnimationFrame(function () {
    const fill = $("hasilDO").querySelector(".bar-fill");
    if (fill) fill.style.width = fill.dataset.target + "%";
  });
}

function renderError(pesan) {
  $("hasilDO").innerHTML = '<div class="do-error" role="alert">' + esc(pesan) + "</div>";
}

function cariDO() {
  const input = $("inputDO");
  const noDO  = input.value.trim();

  if (!noDO) {
    renderError("Nomor Delivery Order belum diisi. Masukkan nomor DO lalu tekan Cari.");
    input.focus();
    return;
  }
  if (!/^\d{5,15}$/.test(noDO)) {
    renderError("Format nomor DO tidak valid. Gunakan angka saja, 5–15 digit.");
    input.focus();
    return;
  }

  // Simulasi loading ~0,6 detik agar terasa seperti request ke server
  const tombol = $("btnCari");
  tombol.disabled = true;
  tombol.textContent = "Mencari…";
  $("hasilDO").innerHTML = '<div class="do-loading">Mencari data pengiriman…</div>';

  setTimeout(function () {
    const data = DATA_DO[noDO];
    if (data) {
      renderHasil(noDO, data);
    } else {
      renderError("Nomor DO " + noDO + " tidak ditemukan. Periksa kembali nomor yang Anda masukkan.");
    }
    tombol.disabled = false;
    tombol.textContent = "Cari";
  }, 600);
}

// ---------- Navigasi: dropdown Laporan & hamburger ----------
function toggleDropdown(id) {
  const el   = $(id);
  const btn  = el.querySelector(".drop-btn");
  const open = el.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
}

function initMenuMobile() {
  const toggle = $("toggle");
  const menu   = $("menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", function () {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
}

// ---------- Laporan & Histori (panel di dashboard) ----------
function jumlahModul(d) {
  const m = /\((\d+)\s*modul\)/.exec(d.jenisPaket);
  return m ? Number(m[1]) : 0;
}

function persenDO(d) {
  return Math.round((d.statusIndex / (TAHAPAN.length - 1)) * 100);
}

// 1) Monitoring Progress DO Bahan Ajar
function renderMonitoring() {
  const q  = ($("monCari").value || "").trim().toLowerCase();
  const st = $("monStatus").value;
  const semua = Object.keys(DATA_DO);

  const rows = semua.filter(function (no) {
    const d = DATA_DO[no];
    if (st && warnaStatus(d.statusIndex) !== st) return false;
    return !q || no.toLowerCase().indexOf(q) !== -1 || d.nama.toLowerCase().indexOf(q) !== -1;
  });

  $("monBody").innerHTML = rows.length ? rows.map(function (no) {
    const d = DATA_DO[no];
    const tone = warnaStatus(d.statusIndex);
    const p = persenDO(d);
    return "<tr>" +
      "<td>" + esc(no) + "</td>" +
      "<td>" + esc(d.nama) + "</td>" +
      "<td>" + esc(d.ekspedisi) + "</td>" +
      '<td><span class="badge badge-' + tone + '">' + esc(TAHAPAN[d.statusIndex]) + "</span></td>" +
      '<td class="kolom-progres"><div class="progres-mini">' +
        '<div class="bar"><div class="bar-fill bar-' + tone + '" style="width:' + p + '%"></div></div>' +
        "<span>" + p + "%</span></div></td>" +
      '<td><button type="button" class="btn-detail" data-do="' + esc(no) + '">Detail</button></td>' +
    "</tr>";
  }).join("") : '<tr><td colspan="6" class="kosong">Tidak ada DO yang cocok dengan pencarian.</td></tr>';

  $("monInfo").textContent = rows.length + " dari " + semua.length + " DO ditampilkan.";
}

// 2) Rekap Bahan Ajar
function renderRekap() {
  const list = Object.keys(DATA_DO).map(function (k) { return DATA_DO[k]; });
  const totalModul = list.reduce(function (s, d) { return s + jumlahModul(d); }, 0);
  const totalNilai = list.reduce(function (s, d) { return s + d.totalBayar; }, 0);
  const diterima   = list.filter(function (d) { return warnaStatus(d.statusIndex) === "selesai"; }).length;

  const stat = function (label, nilai) {
    return '<div class="stat"><span class="stat-nilai">' + nilai + '</span><span class="stat-label">' + label + "</span></div>";
  };
  $("rekapStats").innerHTML =
    stat("Total DO", list.length) +
    stat("Total modul", totalModul) +
    stat("DO sudah diterima", diterima + " dari " + list.length) +
    stat("Total nilai", rupiah(totalNilai));

  // Per ekspedisi
  const eks = {};
  list.forEach(function (d) {
    eks[d.ekspedisi] = eks[d.ekspedisi] || { jml: 0, modul: 0, nilai: 0 };
    eks[d.ekspedisi].jml++;
    eks[d.ekspedisi].modul += jumlahModul(d);
    eks[d.ekspedisi].nilai += d.totalBayar;
  });
  $("rekapEkspedisi").innerHTML = Object.keys(eks).sort().map(function (n) {
    return "<tr><td>" + esc(n) + "</td><td>" + eks[n].jml + "</td><td>" + eks[n].modul +
           "</td><td>" + rupiah(eks[n].nilai) + "</td></tr>";
  }).join("");

  // Per jenis paket
  const pkt = {};
  list.forEach(function (d) {
    pkt[d.jenisPaket] = pkt[d.jenisPaket] || { jml: 0, nilai: 0 };
    pkt[d.jenisPaket].jml++;
    pkt[d.jenisPaket].nilai += d.totalBayar;
  });
  $("rekapPaket").innerHTML = Object.keys(pkt).sort().map(function (n) {
    return "<tr><td>" + esc(n) + "</td><td>" + pkt[n].jml + "</td><td>" + rupiah(pkt[n].nilai) + "</td></tr>";
  }).join("");

  // Per status pengiriman
  $("rekapStatus").innerHTML = TAHAPAN.map(function (nama, i) {
    const n = list.filter(function (d) { return d.statusIndex === i; }).length;
    return "<tr><td>" + esc(nama) + "</td><td>" + n + "</td></tr>";
  }).join("");
}

// 3) Histori Transaksi Bahan Ajar
function filterHistori() {
  const q  = ($("histCari").value || "").trim().toLowerCase();
  const st = $("histStatus").value;
  return DATA_HISTORI.filter(function (t) {
    if (st && t.status !== st) return false;
    return !q || [t.id, t.noDO, t.nama, t.ket].join(" ").toLowerCase().indexOf(q) !== -1;
  }).sort(function (a, b) { return b.tgl.localeCompare(a.tgl) || b.id.localeCompare(a.id); });
}

function renderHistori() {
  const rows = filterHistori();
  const kelasStatus = { "Lunas": "selesai", "Menunggu Pembayaran": "proses", "Dibatalkan": "batal" };

  $("histBody").innerHTML = rows.length ? rows.map(function (t) {
    return "<tr>" +
      "<td>" + esc(t.id) + "</td>" +
      "<td>" + esc(tanggalIndo(t.tgl)) + "</td>" +
      "<td>" + esc(t.noDO) + "</td>" +
      "<td>" + esc(t.nama) + "</td>" +
      "<td>" + esc(t.ket) + "</td>" +
      '<td class="angka">' + rupiah(t.total) + "</td>" +
      '<td><span class="badge badge-' + kelasStatus[t.status] + '">' + esc(t.status) + "</span></td>" +
    "</tr>";
  }).join("") : '<tr><td colspan="7" class="kosong">Tidak ada transaksi yang cocok.</td></tr>';

  const lunas = rows.filter(function (t) { return t.status === "Lunas"; })
                    .reduce(function (s, t) { return s + t.total; }, 0);
  $("histInfo").textContent = rows.length + " transaksi ditampilkan. Total pembayaran lunas: " + rupiah(lunas) + ".";
}

function unduhHistori() {
  const q = function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; };
  const baris = [["ID Transaksi", "Tanggal", "No. DO", "Mahasiswa", "Keterangan", "Total", "Status"]]
    .concat(filterHistori().map(function (t) {
      return [t.id, t.tgl, t.noDO, t.nama, t.ket, t.total, t.status];
    }));
  const csv  = "\uFEFF" + baris.map(function (r) { return r.map(q).join(","); }).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "histori-transaksi.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

// ---------- Pengatur panel ----------
const PANEL_RENDER = {
  monitoring: renderMonitoring,
  rekap:      renderRekap,
  histori:    renderHistori
};

function showPanel(nama) {
  if (!PANEL_RENDER[nama]) return;
  Object.keys(PANEL_RENDER).forEach(function (k) {
    const el = $("panel-" + k);
    if (el) el.hidden = (k !== nama);
  });
  PANEL_RENDER[nama]();
  try { history.replaceState(null, "", "#" + nama); } catch (e) {}
  $("panel-" + nama).scrollIntoView({ behavior: "smooth", block: "start" });
}

function tutupPanel() {
  Object.keys(PANEL_RENDER).forEach(function (k) {
    const el = $("panel-" + k);
    if (el) el.hidden = true;
  });
  try { history.replaceState(null, "", location.pathname); } catch (e) {}
}

function initPanels() {
  document.addEventListener("click", function (e) {
    // Menu / kartu yang membuka panel
    const pemicu = e.target.closest("[data-panel]");
    if (pemicu) {
      e.preventDefault();
      showPanel(pemicu.dataset.panel);
      const dd = $("dropLaporan");
      if (dd) {
        dd.classList.remove("open");
        const b = dd.querySelector(".drop-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      }
      const menu = $("menu");
      if (menu) menu.classList.remove("open");
      return;
    }

    // Tombol Tutup pada panel
    if (e.target.closest("[data-close-panel]")) {
      tutupPanel();
      return;
    }

    // Tombol Detail pada tabel monitoring -> jalankan pencarian DO
    const detail = e.target.closest("[data-do]");
    if (detail) {
      $("inputDO").value = detail.dataset.do;
      cariDO();
      $("judulDO").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Filter langsung saat mengetik / memilih
  $("monCari").addEventListener("input", renderMonitoring);
  $("monStatus").addEventListener("change", renderMonitoring);
  $("histCari").addEventListener("input", renderHistori);
  $("histStatus").addEventListener("change", renderHistori);
  $("btnUnduhHistori").addEventListener("click", unduhHistori);

  // Buka panel langsung jika URL berisi #monitoring / #rekap / #histori
  const awal = location.hash.slice(1);
  if (PANEL_RENDER[awal]) showPanel(awal);
}

// Katalog sampul bahan ajar (dari dataBahanAjar di data.js)
function renderKatalog() {
  const wadah = $("katalog");
  if (!wadah) return;
  wadah.textContent = "";
  dataBahanAjar.forEach(function (b) {
    const a      = buatEl("a", { class: "buku", href: "stok.html?cari=" + encodeURIComponent(b.kodeBarang) });
    const sampul = buatEl("div", { class: "buku-cover" });
    const img    = buatEl("img", { src: b.cover, alt: "Sampul " + b.namaBarang, loading: "lazy" });
    img.addEventListener("error", function () { img.remove(); sampul.textContent = b.kodeBarang; });
    sampul.append(img);
    a.append(
      sampul,
      buatEl("strong", null, b.namaBarang),
      buatEl("span", null, b.kodeBarang + " · Stok " + Number(b.stok).toLocaleString("id-ID"))
    );
    wadah.append(a);
  });
}

function initDashboard() {
  renderKatalog();
  updateWaktu();
  setInterval(updateWaktu, 1000);

  if ($("btnCari") && $("inputDO")) {
    $("btnCari").addEventListener("click", cariDO);
    $("inputDO").addEventListener("keydown", function (e) {
      if (e.key === "Enter") cariDO();
    });
  }

  initPanels();
  initMenuMobile();
}

// ============================================================
// BAGIAN 4 — HALAMAN TRACKING (tracking.html)
// Hanya aktif jika ada elemen #formCari
// Data dari data.js: dataTracking, dataBahanAjar, dataPengguna
// ============================================================

// Progres bar berdasarkan status. Jika riwayat terakhir "Selesai Antar",
// progres otomatis 100% dan label menjadi "Selesai".
const PROGRES_STATUS = {
  "Diproses": 20,
  "Dikemas": 40,
  "Dikirim": 50,
  "Dalam Perjalanan": 70
};

// Helper membuat elemen DOM (aman dari XSS karena memakai textContent)
function buatEl(tag, attrs, teks) {
  const e = document.createElement(tag);
  if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
  if (teks !== undefined) e.textContent = teks;
  return e;
}

const cariBahanAjar = (kodeLokasi) => dataBahanAjar.find(function (b) { return b.kodeLokasi === kodeLokasi; });
const cariPengguna  = (nama)       => dataPengguna.find(function (p) { return p.nama === nama; });

function hitungStatus(d) {
  const terakhir = d.perjalanan[d.perjalanan.length - 1];
  if (terakhir && /^selesai antar/i.test(terakhir.keterangan)) {
    return { label: "Selesai", progress: 100 };
  }
  const p = PROGRES_STATUS[d.status];
  return { label: d.status, progress: p === undefined ? 10 : p };
}

// Pecah "Judul. Info tambahan" menjadi judul + keterangan kecil
function pecahKeterangan(teks) {
  const i = teks.search(/\.\s+/);
  if (i > 0) {
    const sub = teks.slice(i).replace(/^\.\s+/, "");
    if (sub) return { ket: teks.slice(0, i), sub: sub };
  }
  return { ket: teks, sub: "" };
}

function tampilkanTracking(noDO, d) {
  const hasil = $("hasil");
  hasil.innerHTML = "";

  const st      = hitungStatus(d);
  const selesai = st.progress === 100;
  const bahan   = cariBahanAjar(d.paket);
  const user    = cariPengguna(d.nama);

  // Kartu biru
  const kartu = buatEl("section", { class: "kartu" });
  kartu.append(
    buatEl("div", { class: "nama" }, d.nama),
    buatEl("div", { class: "tgl" }, tanggalIndo(d.tanggalKirim)),
    buatEl("div", { class: "nim" }, "No. DO " + noDO),
    buatEl("div")
  );
  if (user) {
    kartu.append(buatEl("div", { class: "rute" }, user.lokasi + " (" + user.role + ")"));
  }

  // Status + detail
  const status = buatEl("section", { class: "panel" });
  status.append(buatEl("h2", null, "Status Pengiriman"));
  const baris = buatEl("div", { class: "status-row" });
  baris.append(
    buatEl("span", { class: "badge" + (selesai ? " selesai" : "") }, st.label),
    buatEl("span", { class: "persen" }, st.progress + "%")
  );
  const bar = buatEl("div", { class: "bar", role: "progressbar", "aria-valuenow": st.progress, "aria-valuemin": 0, "aria-valuemax": 100 });
  const isi = buatEl("div", { class: selesai ? "selesai" : "" });
  bar.append(isi);
  status.append(baris, bar);

  const jenisPaket = bahan
    ? bahan.namaBarang + " (" + bahan.kodeBarang + "), " + bahan.jenisBarang + " edisi " + bahan.edisi
    : d.paket;

  const detail = buatEl("dl", { class: "detail" });
  [
    ["No. Delivery Order", noDO],
    ["Ekspedisi", d.ekspedisi],
    ["Tanggal Kirim", tanggalIndo(d.tanggalKirim)],
    ["Jenis Paket", jenisPaket],
    ["Total Pembayaran", rupiah(d.total)]
  ].forEach(function (item) {
    const kotak = buatEl("div");
    kotak.append(buatEl("dt", null, item[0]), buatEl("dd", null, item[1]));
    detail.append(kotak);
  });
  status.append(detail);

  // Timeline (data berurutan dari yang terlama, tampilkan terbaru di atas)
  const perjalanan = buatEl("section", { class: "panel" });
  perjalanan.append(buatEl("h2", null, "Perjalanan Paket"));
  const ul = buatEl("ul", { class: "timeline" });
  d.perjalanan.slice().reverse().forEach(function (p) {
    const t   = pecahKeterangan(p.keterangan);
    const li  = buatEl("li");
    const ket = buatEl("div", { class: "ket" }, t.ket);
    if (t.sub) ket.append(buatEl("small", null, t.sub));
    li.append(ket, buatEl("div", { class: "waktu" }, p.waktu));
    ul.append(li);
  });
  perjalanan.append(ul);

  hasil.append(kartu, status, perjalanan);
  requestAnimationFrame(function () { isi.style.width = st.progress + "%"; });
}

// Dropdown Laporan & hamburger untuk halaman tracking & stok (tracking.html, stok.html)
function initNavGelap() {
  const dd  = $("laporan");
  const btn = dd.querySelector(".drop-btn");
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    btn.setAttribute("aria-expanded", dd.classList.toggle("open"));
  });
  document.addEventListener("click", function () {
    dd.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  });
  const tgl = $("toggle");
  tgl.addEventListener("click", function () {
    tgl.setAttribute("aria-expanded", $("menu").classList.toggle("show"));
  });
}

function initTracking() {
  // ---------- Form pencarian ----------
  $("formCari").addEventListener("submit", function (e) {
    e.preventDefault();
    const noDO  = $("noDO").value.trim();
    const hasil = $("hasil");

    if (!noDO) {
      hasil.innerHTML = "";
      hasil.append(buatEl("div", { class: "error" }, "Nomor DO/Billing wajib diisi."));
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(dataTracking, noDO)) {
      hasil.innerHTML = "";
      hasil.append(buatEl("div", { class: "error" }, "Data dengan nomor DO " + noDO + " tidak ditemukan."));
      return;
    }
    tampilkanTracking(noDO, dataTracking[noDO]);
  });

  initNavGelap();
}

// ============================================================
// BAGIAN 5 — HALAMAN INFORMASI STOK (stok.html)
// Hanya aktif jika ada elemen #stokBody
// Data awal dari data.js: dataBahanAjar. Baris yang ditambahkan
// pengguna disimpan di localStorage("stokBaru").
// ============================================================

const AMBANG_MENIPIS = 200;           // stok di bawah angka ini = "Menipis"
const KUNCI_STOK_BARU = "stokBaru";
let daftarStok = [];                  // data kerja (data.js + tambahan pengguna)

function stokStatus(n) {
  if (n <= 0)               return { kode: "habis",   label: "Habis" };
  if (n < AMBANG_MENIPIS)   return { kode: "menipis", label: "Menipis" };
  return { kode: "aman", label: "Aman" };
}

const stokKunci = (item) => item.kodeLokasi + "|" + item.kodeBarang;

function muatStokBaru() {
  try {
    const arr = JSON.parse(localStorage.getItem(KUNCI_STOK_BARU) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function simpanStokBaru() {
  try {
    localStorage.setItem(KUNCI_STOK_BARU, JSON.stringify(daftarStok.filter(function (x) { return x.baru; })));
  } catch (e) {}
}

// Sampul: gambar jika ada & berhasil dimuat, jika tidak tampil kotak berisi kode barang
function stokBuatCover(item, ukuran) {
  const wrap = buatEl("div", { class: "cover " + ukuran });
  const placeholder = function () {
    wrap.textContent = "";
    wrap.classList.add("kosong");
    wrap.append(buatEl("span", null, String(item.kodeBarang || "?").slice(0, 4)));
  };
  if (item.cover) {
    const img = buatEl("img", { src: item.cover, alt: "Sampul " + item.namaBarang, loading: "lazy" });
    img.addEventListener("error", placeholder);
    wrap.append(img);
  } else {
    placeholder();
  }
  return wrap;
}

// Membuat satu baris <tr> dengan DOM
function stokBuatBaris(item) {
  const tr = buatEl("tr", { "data-kunci": stokKunci(item) });
  const st = stokStatus(Number(item.stok));

  const sel = function (label, isi, kelas) {
    const td = buatEl("td", { "data-label": label });
    if (kelas) td.className = kelas;
    if (typeof isi === "string" || typeof isi === "number") td.textContent = isi;
    else td.append(isi);
    return td;
  };

  const tdCover = buatEl("td", { class: "kol-cover" });
  tdCover.append(stokBuatCover(item, "mini"));

  const tdNama = buatEl("td", { "data-label": "Nama barang", class: "nama" }, item.namaBarang);
  if (item.baru) tdNama.append(buatEl("span", { class: "badge baru" }, "Baru"));

  const tdStok = buatEl("td", { "data-label": "Stok", class: "angka" });
  tdStok.append(
    buatEl("span", { class: "stok-nilai" }, Number(item.stok).toLocaleString("id-ID")),
    buatEl("span", { class: "badge " + st.kode }, st.label)
  );

  const tdAksi = buatEl("td", { "data-label": "Aksi" });
  const aksi = buatEl("div", { class: "aksi" });
  aksi.append(buatEl("button", { type: "button", class: "btn-kecil", "data-aksi": "detail" }, "Detail"));
  if (item.baru) {
    aksi.append(buatEl("button", { type: "button", class: "btn-kecil hapus", "data-aksi": "hapus" }, "Hapus"));
  }
  tdAksi.append(aksi);

  tr.append(
    tdCover,
    sel("Kode lokasi", item.kodeLokasi),
    sel("Kode barang", item.kodeBarang),
    tdNama,
    sel("Jenis", item.jenisBarang),
    sel("Edisi", item.edisi),
    tdStok,
    tdAksi
  );
  return tr;
}

function stokRingkasan() {
  const total = daftarStok.reduce(function (s, x) { return s + Number(x.stok); }, 0);
  const menipis = daftarStok.filter(function (x) { return Number(x.stok) < AMBANG_MENIPIS; }).length;
  $("sJudul").textContent   = daftarStok.length.toLocaleString("id-ID");
  $("sStok").textContent    = total.toLocaleString("id-ID");
  $("sMenipis").textContent = menipis.toLocaleString("id-ID");
}

function stokRender() {
  const q  = ($("stokCari").value || "").trim().toLowerCase();
  const st = $("stokStatus").value;

  const tampil = daftarStok.filter(function (x) {
    if (st && stokStatus(Number(x.stok)).kode !== st) return false;
    return !q || [x.namaBarang, x.kodeBarang, x.kodeLokasi].join(" ").toLowerCase().indexOf(q) !== -1;
  });

  const tbody = $("stokBody");
  tbody.textContent = "";
  if (tampil.length === 0) {
    const tr = buatEl("tr");
    tr.append(buatEl("td", { colspan: "8", class: "kosong" }, "Tidak ada bahan ajar yang cocok."));
    tbody.append(tr);
  } else {
    tampil.forEach(function (x) { tbody.append(stokBuatBaris(x)); });
  }

  $("stokInfo").textContent = tampil.length + " dari " + daftarStok.length + " bahan ajar ditampilkan.";
  stokRingkasan();
}

// Dialog detail (mirip halaman detail pada aplikasi mobile)
function stokDetail(item) {
  const st  = stokStatus(Number(item.stok));
  const isi = $("detailIsi");
  isi.textContent = "";
  isi.append(stokBuatCover(item, "besar"));

  const dl = buatEl("dl", { class: "detail-stok" });
  [
    ["Kode Lokasi", item.kodeLokasi],
    ["Kode Barang", item.kodeBarang],
    ["Nama Barang", item.namaBarang],
    ["Jenis Barang", item.jenisBarang],
    ["Edisi", item.edisi],
    ["Stok", Number(item.stok).toLocaleString("id-ID") + " eksemplar (" + st.label + ")"]
  ].forEach(function (b) {
    const kotak = buatEl("div");
    kotak.append(buatEl("dt", null, b[0]), buatEl("dd", null, String(b[1])));
    dl.append(kotak);
  });
  isi.append(dl);
  $("dlgDetail").showModal();
}

// ---------- Form tambah stok ----------
function stokBukaForm(buka) {
  $("panelTambah").hidden = !buka;
  $("btnTambah").setAttribute("aria-expanded", buka);
  $("stokError").textContent = "";
  if (buka) {
    $("fLokasi").focus();
    $("panelTambah").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function stokTampilPesan(teks) {
  const el = $("stokPesan");
  el.textContent = teks;
  el.hidden = false;
  clearTimeout(stokTampilPesan.timer);
  stokTampilPesan.timer = setTimeout(function () { el.hidden = true; }, 5000);
}

function stokTambah(e) {
  e.preventDefault();
  const galat = function (teks, idField) {
    $("stokError").textContent = teks;
    if (idField) $(idField).focus();
  };

  const lokasi = $("fLokasi").value.trim().toUpperCase();
  const kode   = $("fKode").value.trim().toUpperCase();
  const nama   = $("fNama").value.trim();
  const jenis  = $("fJenis").value;
  const edisi  = $("fEdisi").value.trim();
  const stok   = $("fStok").value.trim();
  const cover  = $("fCover").value.trim();

  if (!/^[A-Z0-9]{3,12}$/.test(lokasi)) return galat("Kode lokasi wajib diisi: 3–12 huruf atau angka, tanpa spasi.", "fLokasi");
  if (!/^[A-Z0-9]{4,12}$/.test(kode))   return galat("Kode barang wajib diisi: 4–12 huruf atau angka, tanpa spasi.", "fKode");
  if (nama.length < 2)                  return galat("Nama barang wajib diisi (minimal 2 karakter).", "fNama");
  if (!/^\d+$/.test(edisi) || Number(edisi) < 1) return galat("Edisi harus berupa angka bulat minimal 1.", "fEdisi");
  if (!/^\d+$/.test(stok))              return galat("Stok harus berupa angka bulat, 0 atau lebih.", "fStok");

  const item = {
    kodeLokasi: lokasi,
    kodeBarang: kode,
    namaBarang: nama,
    jenisBarang: jenis,
    edisi: edisi,
    stok: Number(stok),
    cover: cover,
    baru: true
  };

  if (daftarStok.some(function (x) { return stokKunci(x) === stokKunci(item); })) {
    return galat("Stok untuk kode barang " + kode + " di lokasi " + lokasi + " sudah ada.", "fKode");
  }

  daftarStok.push(item);
  simpanStokBaru();

  // Kosongkan filter agar baris baru pasti terlihat, lalu render dan sorot barisnya
  $("stokCari").value = "";
  $("stokStatus").value = "";
  stokRender();

  const baris = $("stokBody").querySelector('tr[data-kunci="' + stokKunci(item) + '"]');
  if (baris) {
    baris.classList.add("sorot");
    baris.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  $("formStok").reset();
  $("fEdisi").value = "1";
  $("fStok").value = "0";
  stokBukaForm(false);
  stokTampilPesan("Stok baru ditambahkan: " + nama + " (" + kode + ") sebanyak " + item.stok.toLocaleString("id-ID") + " eksemplar.");
}

function initStok() {
  daftarStok = dataBahanAjar.map(function (x) { return Object.assign({}, x); }).concat(muatStokBaru());

  // Kata kunci kiriman dari kotak cari di dashboard (?cari=...)
  const kataKunci = new URLSearchParams(window.location.search).get("cari");
  if (kataKunci) $("stokCari").value = kataKunci;
  stokRender();

  $("stokCari").addEventListener("input", stokRender);
  $("stokStatus").addEventListener("change", stokRender);

  $("btnTambah").addEventListener("click", function () { stokBukaForm($("panelTambah").hidden); });
  $("btnBatal").addEventListener("click", function () { stokBukaForm(false); });
  $("formStok").addEventListener("submit", stokTambah);

  // Tombol Detail / Hapus di dalam tabel (event delegation)
  $("stokBody").addEventListener("click", function (e) {
    const tombol = e.target.closest("[data-aksi]");
    if (!tombol) return;
    const tr   = tombol.closest("tr");
    const item = daftarStok.find(function (x) { return stokKunci(x) === tr.dataset.kunci; });
    if (!item) return;

    if (tombol.dataset.aksi === "detail") {
      stokDetail(item);
    } else if (tombol.dataset.aksi === "hapus") {
      if (window.confirm('Hapus stok "' + item.namaBarang + '"?')) {
        daftarStok = daftarStok.filter(function (x) { return x !== item; });
        simpanStokBaru();
        stokRender();
        stokTampilPesan("Stok " + item.namaBarang + " dihapus.");
      }
    }
  });

  initNavGelap();
}

// ============================================================
// HEADER BERSAMA (top bar: nama pengguna + kotak cari)
// Dipakai di dashboard.html, tracking.html dan stok.html
// ============================================================
function initHeader() {
  isiInfoPengguna();

  // Kotak cari di top bar: Enter mencari bahan ajar.
  // Di halaman stok langsung memfilter tabel; di halaman lain membuka stok.html.
  const topCari = $("topCari");
  if (!topCari) return;
  topCari.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    const q = topCari.value.trim();
    if ($("stokBody")) {
      $("stokCari").value = q;
      stokRender();
    } else {
      window.location.href = "stok.html" + (q ? "?cari=" + encodeURIComponent(q) : "");
    }
  });
}

// ============================================================
// INISIALISASI — pilih bagian sesuai halaman yang terbuka
// ============================================================
if ($("formLogin")) initLogin();
if ($("topNama"))   initHeader();
if ($("greeting"))  initDashboard();
if ($("formCari"))  initTracking();
if ($("stokBody"))  initStok();