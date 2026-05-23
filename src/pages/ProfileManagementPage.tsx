import React from 'react';
import { Card, Col, Input, Row, Space, Table, Tag, Typography, Upload, Button, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Divisi } from '../routes/types';

const { Title, Text } = Typography;

type ProfileData = {
  nama: string;
  divisi: Divisi;
  role: string;
  email: string;
};

type KaryawanRow = {
  id: string;
  nama: string;
  divisi: Divisi;
  nomorKaryawan: string;
};

type KPIRow = {
  id: string;
  karyawanNama: string;
  metrik: string;
  value: number;
  updatedAt: string;
};

const DIVISI: Divisi[] = ['Inbound', 'Outbound', 'Sorting', 'Packing', 'Rework'];

const templateColumns: ColumnsType<KaryawanRow> = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Nama', dataIndex: 'nama', key: 'nama' },
  { title: 'Divisi', dataIndex: 'divisi', key: 'divisi' },
  { title: 'No Karyawan', dataIndex: 'nomorKaryawan', key: 'nomorKaryawan' }
];

export default function ProfileManagementPage() {
  const [form] = Form.useForm();

  const [profile, setProfile] = React.useState<ProfileData>({
    nama: 'Admin DC',
    divisi: 'Inbound',
    role: 'Manager',
    email: 'admin@cileungsi-dc.local'
  });

  const [karyawanData, setKaryawanData] = React.useState<KaryawanRow[]>([
    { id: 'EMP-0001', nama: 'Andi Saputra', divisi: 'Inbound', nomorKaryawan: 'KRY-0001' },
    { id: 'EMP-0002', nama: 'Siti Nurhaliza', divisi: 'Inbound', nomorKaryawan: 'KRY-0002' }
  ]);

  const [kpiData, setKpiData] = React.useState<KPIRow[]>([
    { id: 'KPI-1', karyawanNama: 'Andi Saputra', metrik: 'IMEI / Jam', value: 128.4, updatedAt: new Date().toISOString() },
    { id: 'KPI-2', karyawanNama: 'Siti Nurhaliza', metrik: 'IMEI / Jam', value: 92.1, updatedAt: new Date().toISOString() }
  ]);

  return (
    <div style={{ padding: 16, maxWidth: 1320, margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size={14} style={{ width: '100%' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Profile Management
            </Title>
            <Text type="secondary">
              (Prototype UI) Edit profile, input data karyawan, barcode generator, KPI, import Excel & template.
            </Text>
          </div>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card type="inner" title="Edit Profile" size="small">
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={profile}
                  onFinish={(values) => {
                    setProfile(values as ProfileData);
                  }}
                >
                  <Form.Item name="nama" label="Nama">
                    <Input />
                  </Form.Item>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                  <Form.Item name="divisi" label="Divisi">
                    <Input readOnly value={profile.divisi} />
                  </Form.Item>
                  <Form.Item name="role" label="Role">
                    <Input readOnly value={profile.role} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Simpan Profil
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card type="inner" title="Input Data Karyawan" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text>Karyawan akan tersimpan ke memory (prototype).</Text>
                  <Button
                    onClick={() => {
                      const next: KaryawanRow = {
                        id: `EMP-${String(karyawanData.length + 1).padStart(4, '0')}`,
                        nama: `Karyawan ${karyawanData.length + 1}`,
                        divisi: DIVISI[(karyawanData.length + 1) % DIVISI.length],
                        nomorKaryawan: `KRY-${String(karyawanData.length + 1).padStart(4, '0')}`
                      };
                      setKaryawanData((prev) => [next, ...prev]);
                    }}
                  >
                    + Tambah Contoh Karyawan
                  </Button>
                </Space>

                <div style={{ marginTop: 12 }}>
                  <Text strong>Data Karyawan (prototype):</Text>
                  <Table<KaryawanRow>
                    style={{ marginTop: 8 }}
                    size="small"
                    rowKey="id"
                    columns={templateColumns}
                    dataSource={karyawanData}
                    pagination={{ pageSize: 5 }}
                  />
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card type="inner" title="Barcode Generator" size="small">
                <Text type="secondary">
                  Prototype: pada versi berikutnya akan pakai library barcode (atau render SVG/Canvas) berdasarkan nomorKaryawan.
                </Text>
                <div style={{ marginTop: 12 }}>
                  <Tag color="blue">Contoh: {karyawanData[0]?.nomorKaryawan ?? '-'} </Tag>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card type="inner" title="Data KPI Karyawan" size="small">
                <Table<KPIRow>
                  size="small"
                  rowKey="id"
                  columns={[
                    { title: 'Karyawan', dataIndex: 'karyawanNama', key: 'karyawanNama' },
                    { title: 'Metrik', dataIndex: 'metrik', key: 'metrik' },
                    { title: 'Value', dataIndex: 'value', key: 'value', render: (v) => v.toFixed(2) },
                    { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt', render: (iso) => new Date(iso).toLocaleString('id-ID') }
                  ]}
                  dataSource={kpiData}
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card type="inner" title="Import melalui File Excel" size="small">
                <Upload
                  beforeUpload={() => false}
                  accept=".xlsx,.xls,.csv"
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Pilih File Excel</Button>
                </Upload>
                <div style={{ marginTop: 10 }}>
                  <Text type="secondary">
                    Prototype: parsing Excel akan ditambahkan (mis. pakai xlsx library). Pada tahap ini hanya UI.
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card type="inner" title="Template Data Karyawan" size="small">
                <Text type="secondary">Unduh template untuk format import (prototype).</Text>
                <div style={{ marginTop: 12 }}>
                  <Tag color="purple">Template: EMP_ID, Nama, Divisi, No Karyawan</Tag>
                </div>
                <Button
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    const csv = [
                      'id,nama,divisi,nomorKaryawan',
                      'EMP-0001,Andi Saputra,Inbound,KRY-0001'
                    ].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'template_data_karyawan.csv';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download Template CSV
                </Button>
              </Card>
            </Col>
          </Row>
        </Space>
      </Card>
    </div>
  );
}

