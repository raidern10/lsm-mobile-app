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
  catatanList: () => api.get("/siswa/catatan").then((r) => r.data),
  observasi: () => api.get("/siswa/observasi").then((r) => r.data),
  nilai: () => api.get("/siswa/nilai").then((r) => r.data),
};
export const cetakApi = {
  jurnal: (siswaId?: number) =>
    api.get(`/cetak/jurnal${siswaId ? `/${siswaId}` : ""}`).then((r) => r.data),
};
