'use client'
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableColumnType, TableProps } from 'antd';
import { Button, Input, Popconfirm, Space, Switch, Table, Tag, notification } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { sendRequest } from '@/utlis/api';

import {
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import CreatLicenseModal from './components/create.licenses.modal';
import UpdateLicenseModal from './components/update.licenses.modal';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import DetailLicenseModal from './components/detail.license.modal';


interface DataType {
  product: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  userEmail: string;
  accessLevel: number;
  discountCode: string;
  discountPercent: number;
  finalPrice: number;
  isActive: boolean;
  createdBy: string;
}


type DataIndex = keyof DataType;


const PageLicenses: React.FC = () => {
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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updateLicenseRecord, setUpdateLicenseRecord] = useState()

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  })

  const getData = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/licenses`,
      method: "GET",
      queryParams: { current: meta.current, pageSize: meta.pageSize },
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
    })
    try { setListUsers(res.data.result) } catch (error) { }
    try { setMeta(res.data.meta) } catch (error) { }
  }

  const handleOnChange = async (current: number, pageSize: number) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/licenses`,
      method: "GET",
      queryParams: { current: current, pageSize: pageSize },
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
    })
    try { setListUsers(res.data.result) } catch (error) { }
    try { setMeta(res.data.meta) } catch (error) { }
  }

  const confirmDelete = async (id: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/licenses/${id}`,
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
    })

    if (res.data) {
      await getData()
      notification.success({
        message: "Xoá License thành công"
      })
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message
      })
    }
  };

  const changeActive = async (record: any, status: boolean) => {

    const res_user = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/find-by-email`,
      method: "POST",
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
      body: { email: record.userEmail }
    })

    if (res_user?.data.isDeleted) {
      notification.error({
        message: `Người dùng ${record.userEmail} đã bị xoá, không thể kích hoạt License này`
      })
      return
    }

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/licenses/${record._id}`,
      method: "PATCH",
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
      body: { status: status }
    })


    if (res.data) {
      await getData()
      notification.success({
        message: `Điều chỉnh trạng thái thành công`
      })
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message
      })
    }
  }

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
      title: 'Tên sản phẩm',
      dataIndex: 'product',
      ...getColumnSearchProps('product'),
      render: (value, record) => {
        const tagColor = value === 'FREE' ? '#404040' :
          record.accessLevel === 1 ? '#1E7607' :
            record.accessLevel === 2 ? '#1777ff' :
              record.accessLevel === 3 ? '#7539B7' : '#98217c';
        return (
          <Tag color={tagColor}>
            {value}
          </Tag>
        )
      }
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['descend', 'ascend'],
      render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['descend', 'ascend'],
      render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
    },
    {
      title: 'Ngày còn lại',
      dataIndex: 'daysLeft',
      sorter: (a, b) => a.daysLeft - b.daysLeft,
      sortDirections: ['descend', 'ascend'],
      render: (value) => Math.round(value),
    },
    {
      title: 'Người dùng',
      dataIndex: 'userEmail',
      ...getColumnSearchProps('userEmail'),
    },
    {
      title: 'Mã giới thiệu',
      dataIndex: 'discountCode',
      ...getColumnSearchProps('discountCode'),
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'discountPercent',
      render: (value) => `${value}%`
    },
    {
      title: 'Tổng giá trị',
      dataIndex: 'finalPrice',
      render: (text) => {
        return text?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      ...getColumnSearchProps('createdBy'),
      render: (value: any, record) => value?.email
    },
    {
      title: 'Thông tin gia hạn',
      align: 'center',
      render: (value, record) => <Button type='primary' ghost size='small'
        onClick={() => {
          setIsDetailModalOpen(true)
          setUpdateLicenseRecord(record)
        }}
      >
        Chi tiết
      </Button>
    },
    {
      title: 'Trạng thái',
      align: 'center',
      dataIndex: 'isActive',
      sorter: (a, b) => {
        const aValue = a.isActive ? "Active" : "Inactive";
        const bValue = b.isActive ? "Active" : "Inactive";
        return aValue.localeCompare(bValue);
      },
      sortDirections: ['descend', 'ascend'],
      render: (value, record) => {
        const tagColor = value === true ? 'green' : 'red'
        return (
          <Tag color={tagColor}>
            {value ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: 'Thay đổi trạng thái',
      align: 'center',
      dataIndex: 'isActive',
      render: (value, record) => < Switch defaultChecked={value} onChange={() => changeActive(record, value ? false : true)} />
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
                setUpdateLicenseRecord(record)
              }}
            />
            <Popconfirm
              title="Xoá License này?"
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
        <CreatLicenseModal
          getData={getData}
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />

        <UpdateLicenseModal
          getData={getData}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          updateLicenseRecord={updateLicenseRecord}
        />

        <DetailLicenseModal
          getData={getData}
          isDetailModalOpen={isDetailModalOpen}
          setIsDetailModalOpen={setIsDetailModalOpen}
          updateLicenseRecord={updateLicenseRecord}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1> Danh sách Licenses</h1>
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
  };
}
export default PageLicenses;