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
