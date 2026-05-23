export type Divisi = 'Inbound' | 'Outbound' | 'Sorting' | 'Packing' | 'Rework';
export type StatusOperasional = 'ACTIVE' | 'BREAK' | 'OFF';

export type Karyawan = {
  key: string;
  nama: string;
  divisi: Divisi;
  status: StatusOperasional;
  imeiTerpantau: number;
  updatedAt: string; // ISO string
};

export type KaryawanProfile = {
  id: string;
  nama: string;
  divisi: Divisi;
  jabatan?: string;
  nomorKaryawan?: string;
};

export type KPIKaryawan = {
  id: string;
  karyawanId: string;
  metrik: string;
  value: number;
  updatedAt: string;
};

export type ScanEvent = {
  id: string;
  karyawanId: string;
  karyawanNama: string;
  divisi: Divisi;
  direction: 'IN' | 'OUT';
  held: boolean;
  imei: string;
  timestamp: string;
};

