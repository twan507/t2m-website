'use client'
import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('', 'sub1', <MailOutlined />, [
    getItem(<Button ghost icon={<MailOutlined />} style={{ border: 0 }}
      onClick={() => { }}
    >Tổng quan thị trường</Button>, '1'),
    getItem(<Button ghost icon={<MailOutlined />} style={{ border: 0 }}
      onClick={() => { }}
    />, '1'),
    getItem(<Button ghost icon={<MailOutlined />} style={{ border: 0 }}
      onClick={() => { }}
    />, '1'),
    getItem(<Button ghost icon={<MailOutlined />} style={{ border: 0 }}
      onClick={() => { }}
    />, '1'),
  ]),
];

const onClick: MenuProps['onClick'] = (e) => {
  console.log('click', e);
};

const App: React.FC = () => (
  <Menu selectedKeys={[]} theme='dark' onClick={onClick} style={{ width: 256 }} mode="vertical" items={items} />
);

export default App;