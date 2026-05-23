import React from 'react';
import { Button, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  ProfileOutlined,
  ScanOutlined,
  UserSwitchOutlined,
  DashboardOutlined
} from '@ant-design/icons';

export type AppMenuKey = 'dashboard' | 'profile' | 'scan_inout';

export default function TopNav({
  activeKey,
  onChange
}: {
  activeKey: AppMenuKey;
  onChange: (key: AppMenuKey) => void;
}) {
  const items: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: 'Profile Management'
    },
    {
      key: 'scan_inout',
      icon: <ScanOutlined />,
      label: 'Scan In & Out'
    }
  ];

  return (
    <div
      style={{
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'space-between'
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16 }}>
        Monitoring IMEI • Cileungsi DC
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[activeKey]}
        items={items}
        onClick={(e) => onChange(e.key as AppMenuKey)}
        style={{ flex: 1, justifyContent: 'center' }}
      />
      <Button size="middle" icon={<UserSwitchOutlined />} onClick={() => onChange('dashboard')}>
        Home
      </Button>
    </div>
  );
}

