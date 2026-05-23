import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Tag, Tooltip, Progress, Input, Select, Space, Badge, Card, Typography, Button } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

import TopNav, { type AppMenuKey } from './components/app/TopNav';
import DashboardPage from './pages/DashboardPage';
import type { Divisi, Karyawan, StatusOperasional } from './routes/types';

const { Title, Text } = Typography;

type SimData = {
  imeiTerpantauBase: number;
  status: StatusOperasional;
  breakChance: number; // per tick
  offChance: number; // per tick
};

const DIVISI: Divisi[] = ['Inbound', 'Outbound', 'Sorting', 'Packing', 'Rework'];

// Data contoh (bisa diganti ke API nantinya)
const DATA_AWAL: Array<
  Omit<Karyawan, 'imeiTerpantau' | 'updatedAt'> & SimData
> = [
  {
    key: 'k1',
    nama: 'Andi Saputra',
    divisi: 'Inbound',
    status: 'ACTIVE',
    imeiTerpantauBase: 1240,
    breakChance: 0.04,
    offChance: 0.01
  },
  {
    key: 'k2',
    nama: 'Siti Nurhaliza',
    divisi: 'Inbound',
    status: 'BREAK',
    imeiTerpantauBase: 620,
    breakChance: 0.08,
    offChance: 0.03
  },
  {
    key: 'k3',
    nama: 'Budi Pratama',
    divisi: 'Outbound',
    status: 'ACTIVE',
    imeiTerpantauBase: 980,
    breakChance: 0.03,
    offChance: 0.015
  },
  {
    key: 'k4',
    nama: 'Rina Oktaviani',
    divisi: 'Sorting',
    status: 'OFF',
    imeiTerpantauBase: 0,
    breakChance: 0.05,
    offChance: 0.2
  },
  {
    key: 'k5',
    nama: 'Fajar Maulana',
    divisi: 'Packing',
    status: 'ACTIVE',
    imeiTerpantauBase: 770,
    breakChance: 0.03,
    offChance: 0.01
  },
  {
    key: 'k6',
    nama: 'Dewi Kusuma',
    divisi: 'Rework',
    status: 'BREAK',
    imeiTerpantauBase: 410,
    breakChance: 0.1,
    offChance: 0.05
  }
];

function statusMeta(status: StatusOperasional) {
  switch (status) {
    case 'ACTIVE':
      return { color: 'green' as const, label: 'Aktif', hint: 'Sedang memproses' };
    case 'BREAK':
      return { color: 'orange' as const, label: 'Istirahat', hint: 'Sedang berhenti sementara' };
    case 'OFF':
      return { color: 'red' as const, label: 'Off/Absen', hint: 'Tidak sedang bertugas' };
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toStatusFromRandom(
  status: StatusOperasional,
  rng: number,
  breakChance: number,
  offChance: number
) {
  if (status === 'ACTIVE') {
    if (rng < offChance) return 'OFF' as const;
    if (rng < offChance + breakChance) return 'BREAK' as const;
    return 'ACTIVE' as const;
  }
  if (status === 'BREAK') {
    if (rng < offChance * 0.6) return 'OFF' as const;
    if (rng < offChance * 0.6 + breakChance * 0.5) return 'BREAK' as const;
    return 'ACTIVE' as const;
  }
  if (rng < offChance * 0.1) return 'OFF' as const;
  return rng < offChance * 0.1 + 0.25 ? ('BREAK' as const) : ('ACTIVE' as const);
}

// Placeholder pages for now (akan diisi berikutnya sesuai permintaan fitur)
function ProfileManagementPage() {
  return (
    <div style={{ padding: 16, maxWidth: 1320, margin: '0 auto' }}>
      <Card>
        <Title level={4}>Profile Management</Title>
        <Text type="secondary">
          Menu ini akan menampilkan: edit profile, input data karyawan, barcode generator, KPI karyawan, import Excel, template.
        </Text>
      </Card>
    </div>
  );
}

function ScanInOutPage() {
  return (
    <div style={{ padding: 16, maxWidth: 1320, margin: '0 auto' }}>
      <Card>
        <Title level={4}>Scan In & Out Karyawan</Title>
        <Text type="secondary">
          Menu ini akan menampilkan tombol IN HOLD dan OUT HOLD lengkap dengan logika scan.
        </Text>
      </Card>
    </div>
  );
}

export default function App() {
  const [activeKey, setActiveKey] = useState<AppMenuKey>('dashboard');

  const [filterDivisi, setFilterDivisi] = useState<Divisi | 'ALL'>('ALL');
  const [query, setQuery] = useState('');
  const [autoSimOn, setAutoSimOn] = useState(true);

  const [rows, setRows] = useState<Karyawan[]>(() => {
    const now = new Date();
    return DATA_AWAL.map((d, idx) => ({
      key: d.key,
      nama: d.nama,
      divisi: d.divisi,
      status: d.status,
      imeiTerpantau: d.imeiTerpantauBase,
      updatedAt: new Date(now.getTime() - idx * 3 * 60 * 1000).toISOString()
    }));
  });

  const simRef = useRef<Map<string, SimData>>(new Map(DATA_AWAL.map((d) => [d.key, d])));

  useEffect(() => {
    if (!autoSimOn) return;

    const interval = window.setInterval(() => {
      const now = new Date();

      setRows((prev) => {
        return prev.map((r) => {
          const sim = simRef.current.get(r.key);
          if (!sim) return r;

          const rng = Math.random();
          const nextStatus = toStatusFromRandom(r.status, rng, sim.breakChance, sim.offChance);

          let nextImei = r.imeiTerpantau;
          if (nextStatus === 'ACTIVE') nextImei = nextImei + Math.floor(18 + Math.random() * 38);
          else if (nextStatus === 'BREAK') nextImei = nextImei + Math.floor(3 + Math.random() * 10);

          nextImei = clamp(nextImei, 0, 999999);

          const shouldUpdateTimestamp = nextStatus !== r.status || Math.random() < 0.7;

          return {
            ...r,
            status: nextStatus,
            imeiTerpantau: nextImei,
            updatedAt: shouldUpdateTimestamp ? now.toISOString() : r.updatedAt
          };
        });
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [autoSimOn]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesDivisi = filterDivisi === 'ALL' ? true : row.divisi === filterDivisi;
      const matchesQuery = q.length === 0 ? true : row.nama.toLowerCase().includes(q);
      return matchesDivisi && matchesQuery;
    });
  }, [rows, filterDivisi, query]);

  const counts = useMemo(() => {
    const inView = filtered;
    const active = inView.filter((r) => r.status === 'ACTIVE').length;
    const brk = inView.filter((r) => r.status === 'BREAK').length;
    const off = inView.filter((r) => r.status === 'OFF').length;
    return { active, brk, off, total: inView.length };
  }, [filtered]);

  const maxImei = useMemo(() => {
    return Math.max(1, ...filtered.map((r) => r.imeiTerpantau));
  }, [filtered]);


  const columns: ColumnsType<Karyawan> = [
    {
      title: 'Nama Karyawan',
      dataIndex: 'nama',
      key: 'nama',
      sorter: (a, b) => a.nama.localeCompare(b.nama)
    },
    {
      title: 'Divisi',
      dataIndex: 'divisi',
      key: 'divisi',
      filters: DIVISI.map((d) => ({ text: d, value: d })),
      onFilter: (value, record) => record.divisi === value,
      filterSearch: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_value, record) => {
        const meta = statusMeta(record.status);
        return (
          <Tooltip title={meta.hint}>
            <Tag color={meta.color}>{meta.label}</Tag>
          </Tooltip>
        );
      }
    },
    {
      title: 'IMEI Terpantau',
      dataIndex: 'imeiTerpantau',
      key: 'imeiTerpantau',
      sorter: (a, b) => a.imeiTerpantau - b.imeiTerpantau,
      align: 'right',
      render: (value: number) => (
        <div style={{ minWidth: 140 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <Text>{value.toLocaleString('id-ID')}</Text>
            <Text type="secondary">/ {maxImei.toLocaleString('id-ID')}</Text>
          </div>
          <Progress percent={Math.round((value / maxImei) * 100)} size="small" showInfo={false} />
        </div>
      )
    },
    {
      title: 'Last Update',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (iso: string) => formatTime(iso)
    }
  ];

  const tableProps: TableProps<Karyawan> = {
    rowKey: 'key',
    columns,
    dataSource: filtered,
    pagination: { pageSize: 10 },
    size: 'middle'
  };

  const onReset = () => {
    setQuery('');
    setFilterDivisi('ALL');
  };

  const renderBody = () => {
    if (activeKey === 'profile') return <ProfileManagementPage />;
    if (activeKey === 'scan_inout') return <ScanInOutPage />;

    // Dashboard (existing table + better header)
    return (
      <div>
        <div style={{ padding: 12, background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <Badge.Ribbon text="React + Vite + Ant Design" color="blue" style={{ marginLeft: 0 }} />
        </div>
        <DashboardPage counts={counts} autoSimOn={autoSimOn} onToggleLive={() => setAutoSimOn((v) => !v)} />

        <div style={{ padding: 16, maxWidth: 1320, margin: '0 auto' }}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <Space wrap>
                <Select
                  style={{ width: 230 }}
                  value={filterDivisi}
                  onChange={(v) => setFilterDivisi(v)}
                  options={[{ value: 'ALL', label: 'Semua Divisi' }, ...DIVISI.map((d) => ({ value: d, label: d }))]}
                />

                <Input
                  allowClear
                  style={{ width: 360 }}
                  placeholder="Cari nama karyawan..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  prefix={<SearchOutlined />}
                />

                <Tag color="blue">Data: {filtered.length} pekerja</Tag>

                <Button onClick={onReset}>Reset Filter</Button>
              </Space>

              <Table {...tableProps} />

              <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>
                Legenda status:&nbsp;
                <Tag color="green">Aktif</Tag>&nbsp;
                <Tag color="orange">Istirahat</Tag>&nbsp;
                <Tag color="red">Off/Absen</Tag>
              </div>
            </Space>
          </Card>
        </div>

        <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>
          {autoSimOn ? 'Live update aktif (simulasi) — refresh tiap ~5 detik' : 'Live update dijeda'}
        </div>
      </div>
    );
  };

  return (
    <div>
      <TopNav activeKey={activeKey} onChange={(key) => setActiveKey(key)} />
      {renderBody()}
    </div>
  );
}


