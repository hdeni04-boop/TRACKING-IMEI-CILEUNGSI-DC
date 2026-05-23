import React from 'react';
import { Card, Tag, Typography, Space, Button } from 'antd';

export default function DashboardPage({
  counts,
  autoSimOn,
  onToggleLive
}: {
  counts: { active: number; brk: number; off: number; total: number };
  autoSimOn: boolean;
  onToggleLive: () => void;
}) {
  const { Title, Text } = Typography;

  return (
    <div style={{ padding: 16, maxWidth: 1320, margin: '0 auto' }}>
      <Card style={{ marginBottom: 12 }}>
        <Space direction="vertical" size={10} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 280px', minWidth: 280 }}>
              <Title level={4} style={{ margin: 0 }}>
                Monitoring & Tracking IMEI HP - Cileungsi DC
              </Title>
              <Text type="secondary">
                Real-time status pekerja per divisi (simulasi) • Ringkasan cepat dan tabel terfilter
              </Text>
            </div>
            <div style={{ flex: '0 0 auto' }}>
              <Space wrap>
                <Tag color="green">Aktif: {counts.active}</Tag>
                <Tag color="orange">Istirahat: {counts.brk}</Tag>
                <Tag color="red">Off/Absen: {counts.off}</Tag>
                <Tag color="blue">Total: {counts.total}</Tag>
              </Space>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Button type={autoSimOn ? 'primary' : 'default'} onClick={onToggleLive}>
                {autoSimOn ? 'Pause Live' : 'Resume Live'}
              </Button>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
}

