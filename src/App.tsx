import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

type Divisi = 'Inbound' | 'Outbound' | 'Sorting' | 'Packing' | 'Rework';

type StatusOperasional = 'ACTIVE' | 'BREAK' | 'OFF';

type Karyawan = {
  key: string;
  nama: string;
  divisi: Divisi;
  status: StatusOperasional;
  imeiTerpantau: number;
  updatedAt: string; // ISO string
};

const DIVISI: Divisi[] = ['Inbound', 'Outbound', 'Sorting', 'Packing', 'Rework'];

const DATA_AWAL: Karyawan[] = [
  {
    key: 'k1',
    nama: 'Andi Saputra',
    divisi: 'Inbound',
    status: 'ACTIVE',
    imeiTerpantau: 1240,
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    key: 'k2',
    nama: 'Siti Nurhaliza',
    divisi: 'Inbound',
    status: 'BREAK',
    imeiTerpantau: 620,
    updatedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString()
  },
  {
    key: 'k3',
    nama: 'Budi Pratama',
    divisi: 'Outbound',
    status: 'ACTIVE',
    imeiTerpantau: 980,
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString()
  },
  {
    key: 'k4',
    nama: 'Rina Oktaviani',
    divisi: 'Sorting',
    status: 'OFF',
    imeiTerpantau: 0,
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    key: 'k5',
    nama: 'Fajar Maulana',
    divisi: 'Packing',
    status: 'ACTIVE',
    imeiTerpantau: 770,
    updatedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString()
  },
  {
    key: 'k6',
    nama: 'Dewi Kusuma',
    divisi: 'Rework',
    status: 'BREAK',
    imeiTerpantau: 410,
    updatedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString()
  }
];

function statusMeta(status: StatusOperasional) {
  switch (status) {
    case 'ACTIVE':
      return { color: 'green' as const, label: 'Aktif' };
    case 'BREAK':
      return { color: 'orange' as const, label: 'Istirahat' };
    case 'OFF':
      return { color: 'red' as const, label: 'Off/Absen' };
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  // simple readable format for Indonesian locale
  return d.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function App() {
  const [filterDivisi, setFilterDivisi] = useState<Divisi | 'ALL'>('ALL');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA_AWAL.filter((row) => {
      const matchesDivisi = filterDivisi === 'ALL' ? true : row.divisi === filterDivisi;
      const matchesQuery = q.length === 0 ? true : row.nama.toLowerCase().includes(q);
      return matchesDivisi && matchesQuery;
    });
  }, [filterDivisi, query]);

  const columns: ColumnsType<Karyawan> = [
    {
      title: 'Nama Karyawan',
      dataIndex: 'nama',
      key: 'nama'
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
        return <Tag color={meta.color}>{meta.label}</Tag>;
      }
    },
    {
      title: 'IMEI Terpantau',
      dataIndex: 'imeiTerpantau',
      key: 'imeiTerpantau',
      sorter: (a, b) => a.imeiTerpantau - b.imeiTerpantau,
      align: 'right'
    },
    {
      title: 'Last Update',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (iso: string) => formatTime(iso)
    }
  ];

  const tableProps: TableProps<Karyawan> = {
    rowKey: 'key',
    columns,
    dataSource: filtered,
    pagination: { pageSize: 10 }
  };

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Badge.Ribbon text="React + Vite + Ant Design" color="blue" />
        <Badge.Ribbon text="Deployment: Production" color="purple" />
        <div style={{ marginLeft: 'auto' }}>
          <Space>
            <Button type="primary" onClick={() => { setQuery(''); setFilterDivisi('ALL'); }}>
              Reset Filter
            </Button>
          </Space>
        </div>
      </div>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Space wrap>
            <Select
              style={{ width: 220 }}
              value={filterDivisi}
              onChange={(v) => setFilterDivisi(v)}
              options={[
                { value: 'ALL', label: 'Semua Divisi' },
                ...DIVISI.map((d) => ({ value: d, label: d }))
              ]}
            />

            <Input
              allowClear
              style={{ width: 320 }}
              placeholder="Cari nama karyawan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              prefix={<SearchOutlined />}
            />

            <Tag color="blue">Data: {filtered.length} pekerja</Tag>
          </Space>

          <Table {...tableProps} />

          <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>
            Legenda status: <Tag color="green">Aktif</Tag> <Tag color="orange">Istirahat</Tag> <Tag color="red">Off/Absen</Tag>
          </div>
        </Space>
      </Card>
    </div>
  );
}

