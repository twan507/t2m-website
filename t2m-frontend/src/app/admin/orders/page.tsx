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

import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';


interface DataType {
    _id: string;
    type: string;
    buyer: string;
    saler: string;
    price: number;
    code: string;
    createdAt: string;
}

type DataIndex = keyof DataType;

const PageOrders: React.FC = () => {

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
    const [updateDiscountCodeRecord, setUpdateDiscountCodeRecord] = useState()

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    })

    const getData = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`,
            method: "GET",
            queryParams: { current: meta.current, pageSize: meta.pageSize },
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
        })
        try { setListUsers(res.data.result) } catch (error) { }
        try { setMeta(res.data.meta) } catch (error) { }
    }

    const handleOnChange = async (current: number, pageSize: number) => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`,
            method: "GET",
            queryParams: { current: current, pageSize: pageSize },
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
        })
        try { setListUsers(res.data.result) } catch (error) { }
        try { setMeta(res.data.meta) } catch (error) { }
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
            title: 'Mã đơn hàng',
            dataIndex: '_id',
            ...getColumnSearchProps('_id'),
        },
        {
            title: 'Loại đơn hàng',
            dataIndex: 'type',
            sorter: (a, b) => a.daysLeft - b.daysLeft,
            sortDirections: ['descend', 'ascend'],
            render: (value, record) => {
                const tagColor = value === 'Tạo mới' ? 'green' : 'blue'
                return (
                    <Tag color={tagColor}>
                        {value}
                    </Tag>
                )
            }
        },
        {
            title: 'Giá trị',
            dataIndex: 'price',
            render: (text) => {
                return text?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            },
        },
        {
            title: 'Khách hàng mua',
            dataIndex: 'buyer',
            ...getColumnSearchProps('buyer'),
        },
        {
            title: 'Mã giới thiệu',
            dataIndex: 'code',
            ...getColumnSearchProps('code'),
        },
        {
            title: 'Người tạo đơn',
            dataIndex: 'saler',
            ...getColumnSearchProps('buyer'),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            sortDirections: ['descend', 'ascend'],
            render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
        },

    ];
    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {

        return (
            <>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1> Danh sách đơn hàng</h1>
                    <Button icon={<PlusCircleOutlined />} onClick={() => setIsCreateModalOpen(true)} type={'primary'} style={{ fontSize: 16, height: 'auto' }}>Tạo mới</Button>
                </div>

                <style>
                    {`
          .custom-table .ant-table-thead > tr > th,
          .custom-table .ant-table-tbody > tr > td {
            padding: 15px;
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

export default PageOrders;