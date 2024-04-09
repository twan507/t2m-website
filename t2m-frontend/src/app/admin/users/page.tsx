'use client'
import React, { useEffect, useRef, useState } from 'react';
import { CheckOutlined, CheckSquareOutlined, CloseOutlined, CloseSquareOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableColumnType, TableProps } from 'antd';
import { Button, Input, Popconfirm, Space, Table, Tag, notification } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { sendRequest } from '@/utlis/api';

import {
  EditOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  RedoOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';

import ResetPasswordModal from './components/reset.password.modal';
import ManageCTVModal from './components/manege.ctv.modal';
import UpdateUserModal from './components/update.user.modal';
import CreateUserModal from './components/create.user.modal';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';

interface DataType {
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  affiliateCode: string;
  license: string
  sponsorCode: string;
  createdAt: string;
}

type DataIndex = keyof DataType;

const PageUsers: React.FC = () => {

  const authInfo = useAppSelector((state) => state.auth)
  const authState = !!authInfo?.user?._id

  const router = useRouter()

  useEffect(() => {
    if (!authState || authInfo.user.role !== "T2M ADMIN") {
      router.push("/admin");
    }
  }, [authState, router]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<any>(null);

  const [listUsers, setListUsers] = useState([])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isCTVModalOpen, setIsCTVModalOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [updateUserRecord, setUpdateUserRecord] = useState()

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  })

  const getData = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`,
      method: "GET",
      queryParams: { current: meta.current, pageSize: meta.pageSize },
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
    })
    try { setListUsers(res.data.result) } catch (error) { }
    try { setMeta(res.data.meta) } catch (error) { }
  }

  const handleOnChange = async (current: number, pageSize: number) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`,
      method: "GET",
      queryParams: { current: current, pageSize: pageSize },
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
    })
    try { setListUsers(res.data.result) } catch (error) { }
    try { setMeta(res.data.meta) } catch (error) { }
  }

  const confirmDelete = async (id: any) => {

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`,
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
    })

    if (res.data) {
      await getData()
      notification.success({
        message: "Xoá người dùng thành công"
      })

    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message
      })
    }
  };

  useEffect(() => {
    getData()
  }, [authState])

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          // placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Email',
      dataIndex: 'email',
      render: (value, record) => <a>{value}</a>,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      ...getColumnSearchProps('phoneNumber'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      ...getColumnSearchProps('role'),
      render: (value, record) => {
        const tagColor = value === 'T2M ADMIN' ? 'purple' :
          value === 'T2M CTV' ? 'blue' :
            value === 'T2M USER' ? 'default' : 'green';

        return (
          <Tag color={tagColor}>
            {value}
          </Tag>
        );
      },
    },
    {
      title: 'Mã CTV',
      dataIndex: 'affiliateCode',
      ...getColumnSearchProps('affiliateCode'),
      render: (value, record) => (
        <Tag color={'volcano'}>
          {value}
        </Tag>
      )
    },
    {
      title: 'Mã giới thiệu',
      dataIndex: 'sponsorCode',
      ...getColumnSearchProps('sponsorCode'),
      render: (value, record) => (
        <Tag color={'green'}>
          {value}
        </Tag>
      )
    },
    {
      title: 'License',
      dataIndex: 'license',
      render: (value, record) => (
        <Tag color={value ? 'green' : 'volcano'}>
          {value ? <CheckOutlined /> : <CloseOutlined />}
        </Tag>
      ),
      sorter: (a, b) => {
        const aValue = a.license ? 1 : 0;
        const bValue = b.license ? 1 : 0;
        return aValue - bValue;
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['descend', 'ascend'],
      render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
    },
    {
      title: 'Quyền CTV',
      align: 'center',
      render: (value, record) => {
        if (record.role === 'T2M USER') {
          return (
            <Button
              type={"primary"}
              ghost
              icon={<CaretUpOutlined />}
              onClick={() => {
                setIsCTVModalOpen(true)
                setUpdateUserRecord(record)
              }}>
              CTV
            </Button>
          )
        } else if (record.role === 'T2M CTV') {
          return (
            <Button
              type={"primary"} danger
              icon={<CaretDownOutlined />}
              onClick={() => {
                setIsCTVModalOpen(true)
                setUpdateUserRecord(record)
              }}>
              CTV
            </Button>
          )
        }
      }
    },
    {
      title: 'Chỉnh sửa thông tin',
      align: 'center',
      render: (value, record) => {
        return (
          <>
            <Button shape="circle"
              style={{ marginLeft: "5px" }}
              icon={<EditOutlined />}
              type={"primary"}
              onClick={() => {
                setIsUpdateModalOpen(true)
                setUpdateUserRecord(record)
              }}
            />
            <Button
              type={"primary"} shape='circle'
              icon={<RedoOutlined />}
              style={{ marginLeft: "5px" }}
              onClick={() => {
                setIsResetPasswordOpen(true)
                setUpdateUserRecord(record)
              }} />
            <Popconfirm
              title="Xoá người dùng"
              description={`${record.name}?`}
              onConfirm={() => confirmDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type={"primary"} danger
                icon={<DeleteOutlined />}
                style={{ marginLeft: "5px" }}
              />
            </Popconfirm>
          </>
        )
      }
    },
  ];
  const [checkAuth, setCheckAuth] = useState(true);

  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <>
        <CreateUserModal
          getData={getData}
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />

        <UpdateUserModal
          getData={getData}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          updateUserRecord={updateUserRecord}
        />

        <ManageCTVModal
          getData={getData}
          isCTVModalOpen={isCTVModalOpen}
          setIsCTVModalOpen={setIsCTVModalOpen}
          updateUserRecord={updateUserRecord}
        />

        <ResetPasswordModal
          getData={getData}
          isResetPasswordOpen={isResetPasswordOpen}
          setIsResetPasswordOpen={setIsResetPasswordOpen}
          updateUserRecord={updateUserRecord}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1> Danh sách Users</h1>
          <Button icon={<PlusCircleOutlined />} onClick={() => setIsCreateModalOpen(true)} type={'primary'} style={{ fontSize: 16, height: 'auto' }}>Tạo mới</Button>
        </div>

        <style>
          {`
          .custom-table .ant-table-thead > tr > th,
          .custom-table .ant-table-tbody > tr > td {
            padding: 10px;
          }
        `}
        </style>

        <Table
          className="custom-table"
          columns={columns}
          dataSource={listUsers}
          rowKey={"_id"}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            onChange: (current: number, pageSize: number) => { handleOnChange(current, pageSize) },
            showSizeChanger: true,
            pageSizeOptions: ['10', `${meta.total}`],
          }}
        />
      </>
    )
  }
}

export default PageUsers;