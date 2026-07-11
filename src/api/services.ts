import { api } from "./client";

export const authApi = {
  login: (payload: { login: string; password: string; device?: string }) =>
    api.post("/login", payload).then((r) => r.data),
  me: () => api.get("/me").then((r) => r.data),
  logout: () => api.post("/logout").then((r) => r.data),
};

export type JurnalItem = { unit_kerja: string; uraian: string };
export const jurnalApi = {
  list: (page = 1) =>
    api.get("/jurnals", { params: { page } }).then((r) => r.data),
  show: (id: number) => api.get(`/jurnals/${id}`).then((r) => r.data),
  create: (payload: { hari_tanggal: string; items: JurnalItem[] }) =>
    api.post("/jurnals", payload).then((r) => r.data),
  approve: (id: number, payload: { status?: string; catatan?: string }) =>
    api.post(`/jurnals/${id}/approve`, payload).then((r) => r.data),
};

// ===== Tipe: Catatan, Observasi, Nilai =====
export type CatatanPayload = {
  nama_pekerjaan: string;
  perencanaan_kegiatan: string;
  pelaksanaan_kegiatan: string;
};

export type Catatan = {
  id: number;
  nama_pekerjaan: string;
  perencanaan_kegiatan: string;
  pelaksanaan_kegiatan: string;
  catatan_instruktur: string | null;
  is_approved: boolean;
  siswa: { id: number; name: string; nisn: string };
  created_at: string;
};

export type ObservasiItem = {
  id?: number;
  permasalahan: string;
  solusi: string;
};

export type Observasi = {
  id: number;
  hari_tanggal: string;
  pekerjaan_projek: string | null;
  is_approved: boolean;
  siswa: { id: number; name: string; nisn: string };
  guru: { id: number | null; name: string | null };
  items: ObservasiItem[];
  created_at: string;
};

export type Nilai = {
  id: number;
  soft_skill: number | null;
  hard_skill: number | null;
  pengembangan_hard_skill: number | null;
  kewirausahaan: number | null;
  rata_rata: number | null;
  catatan_rekomendasi: string | null;
  nilai_guru: number | null;
  nilai_laporan: number | null;
  catatan_guru: string | null;
  nilai_akhir: number | null;
  instruktur: { id: number | null; name: string | null };
  guru: { id: number | null; name: string | null };
  updated_at: string;
};

export const absensiApi = {
  list: (params?: { page?: number; tanggal?: string }) =>
    api.get("/absensis", { params }).then((r) => r.data),
  create: (payload: {
    tanggal: string;
    status: "Hadir" | "Izin" | "Sakit" | "Alpha";
    jam_masuk?: string;
    jam_pulang?: string;
  }) => api.post("/absensis", payload).then((r) => r.data),
};

export const siswaApi = {
  // Catatan kegiatan (baca / tambah / ubah / hapus)
  catatanList: (page = 1) =>
    api.get("/siswa/catatan", { params: { page } }).then((r) => r.data),
  catatanCreate: (payload: CatatanPayload) =>
    api.post("/siswa/catatan", payload).then((r) => r.data),
  catatanUpdate: (id: number, payload: CatatanPayload) =>
    api.put(`/siswa/catatan/${id}`, payload).then((r) => r.data),
  catatanDelete: (id: number) =>
    api.delete(`/siswa/catatan/${id}`).then((r) => r.data),

  // Observasi & Nilai (baca milik sendiri)
  observasiList: (page = 1) =>
    api.get("/siswa/observasi", { params: { page } }).then((r) => r.data),
  nilai: () => api.get("/siswa/nilai").then((r) => r.data),
};

export const cetakApi = {
  jurnal: (siswaId?: number) =>
    api.get(`/cetak/jurnal${siswaId ? `/${siswaId}` : ""}`).then((r) => r.data),
  catatan: (siswaId?: number) =>
    api
      .get(`/cetak/catatan${siswaId ? `/${siswaId}` : ""}`)
      .then((r) => r.data),
  observasi: (siswaId?: number) =>
    api
      .get(`/cetak/observasi${siswaId ? `/${siswaId}` : ""}`)
      .then((r) => r.data),
  nilai: (siswaId?: number) =>
    api.get(`/cetak/nilai${siswaId ? `/${siswaId}` : ""}`).then((r) => r.data),
};

// ===== Tipe guru & instruktur =====
export type JurnalUpdatePayload = {
  status_persetujuan: "pending" | "disetujui" | "revisi";
  catatan_instruktur?: string | null;
};

export type NilaiInstrukturPayload = {
  user_id: number;
  soft_skill: number;
  hard_skill: number;
  pengembangan_hard_skill: number;
  kewirausahaan: number;
  catatan_rekomendasi?: string | null;
};

export type NilaiGuruPayload = {
  user_id: number;
  nilai_guru: number;
  nilai_laporan: number;
  catatan_guru?: string | null;
};

// ===== API INSTRUKTUR =====
export const instrukturApi = {
  siswa: (page = 1) =>
    api.get("/instruktur/siswa", { params: { page } }).then((r) => r.data),

  // Approve / revisi jurnal
  jurnalUpdate: (id: number, payload: JurnalUpdatePayload) =>
    api.put(`/instruktur/jurnal/${id}/update`, payload).then((r) => r.data),

  // Absensi (status HURUF KECIL: hadir/izin/sakit/alfa)
  absensiList: (page = 1) =>
    api.get("/instruktur/absensi", { params: { page } }).then((r) => r.data),
  absensiCreate: (payload: {
    siswa_id: number;
    tanggal: string;
    status: "hadir" | "izin" | "sakit" | "alfa";
  }) => api.post("/instruktur/absensi", payload).then((r) => r.data),

  // Catatan (butuh route GET /instruktur/catatan yang ditambahkan di langkah 0)
  catatanList: (page = 1) =>
    api.get("/instruktur/catatan", { params: { page } }).then((r) => r.data),
  catatanApprove: (id: number, isApproved: boolean) =>
    api.put(`/instruktur/catatan/${id}/approve`, { is_approved: isApproved }).then((r) => r.data),
  catatanKomentar: (id: number, catatan: string) =>
    api.put(`/instruktur/catatan/${id}/komentar`, { catatan_instruktur: catatan }).then((r) => r.data),

  // Nilai
  nilaiList: (page = 1, q?: string) =>
    api.get("/instruktur/nilai", { params: { page, q } }).then((r) => r.data),
  nilaiSimpan: (payload: NilaiInstrukturPayload) =>
    api.post("/instruktur/nilai", payload).then((r) => r.data),
};

// ===== API GURU =====
export const guruApi = {
  dashboard: () => api.get("/guru/dashboard").then((r) => r.data),
  siswa: (page = 1) =>
    api.get("/guru/siswa", { params: { page } }).then((r) => r.data),
  monitoringJurnal: (page = 1) =>
    api.get("/guru/monitoring/jurnal", { params: { page } }).then((r) => r.data),
  monitoringAbsensi: (page = 1) =>
    api.get("/guru/monitoring/absensi", { params: { page } }).then((r) => r.data),
  catatan: (page = 1) =>
    api.get("/guru/catatan", { params: { page } }).then((r) => r.data),
  nilaiList: (page = 1, q?: string) =>
    api.get("/guru/nilai", { params: { page, q } }).then((r) => r.data),
  nilaiSimpan: (payload: NilaiGuruPayload) =>
    api.post("/guru/nilai", payload).then((r) => r.data),
};