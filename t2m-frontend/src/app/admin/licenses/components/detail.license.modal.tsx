'use client'
import { useAppSelector } from '@/redux/store';
import { Modal, Button, TableProps, Table, notification, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ImageLicenseModal from './show.images.modal';
import { CaretUpOutlined, DeleteOutlined } from '@ant-design/icons';
import ExtendLicenseModal from './extend.license.modal';
import { sendRequest } from '@/utlis/api';

interface IProps {
    getData: any
    isDetailModalOpen: boolean
    setIsDetailModalOpen: (v: boolean) => void
    updateLicenseRecord: any
}


const DetailLicenseModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const { getData, isDetailModalOpen, setIsDetailModalOpen, updateLicenseRecord } = props

    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)
    const [detailLicenseRecord, setDetailLicenseRecord] = useState(false)

    const undoExtend = async () => {

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/licenses/undo-extend`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: { id: updateLicenseRecord._id }
        })

        if (res.data) {
            await getData()
            setIsDetailModalOpen(false)
            notification.success({
                message: "Xoá gia hạn License thành công"
            })
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    };

    const columns: TableProps<any>['columns'] = [
        {
            title: 'ID đơn hàng',
            dataIndex: 'orderId',
        },
        {
            title: 'Ngày gia hạn',
            dataIndex: 'setDate',
            sorter: (a, b) => new Date(a.setDate).getTime() - new Date(b.setDate).getTime(),
            sortDirections: ['descend', 'ascend'],
            render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'newEndDate',
            sorter: (a, b) => new Date(a.newEndDate).getTime() - new Date(b.newEndDate).getTime(),
            sortDirections: ['descend', 'ascend'],
            render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
        },
        {
            title: 'Thời gian gia hạn',
            align: "center",
            dataIndex: 'monthExtend',
            render: (value) => `${value} Tháng`,
        },
        {
            title: 'Giá gia hạn',
            dataIndex: 'price',
            render: (text) => {
                return text?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            },
        },
        {
            title: 'Người gia hạn',
            dataIndex: 'extendedBy',
        },
        {
            title: 'Hình ảnh',
            align: "center",
            render: (value, record) => <Button type='primary' ghost size='small'
                onClick={() => {
                    setIsImageModalOpen(true)
                    setDetailLicenseRecord(record)
                }}
            >
                Show
            </Button>
        },

    ];


    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {

        return (
            <>
                <ImageLicenseModal
                    isImageModalOpen={isImageModalOpen}
                    setIsImageModalOpen={setIsImageModalOpen}
                    detailLicenseRecord={detailLicenseRecord}
                    updateLicenseRecord={updateLicenseRecord}
                />
                <ExtendLicenseModal
                    getData={getData}
                    isExtendModalOpen={isExtendModalOpen}
                    setIsExtendModalOpen={setIsExtendModalOpen}
                    updateLicenseRecord={updateLicenseRecord}
                    setIsDetailModalOpen={setIsDetailModalOpen}
                />

                <style>
                    {`
                    .ant-input-number-handler-wrap {
                    opacity: 1 !important;
                    visibility: visible !important;
                  }
                `}
                </style>
                <Modal
                    title="Lịch sử gia hạn License"
                    open={isDetailModalOpen}
                    onCancel={() => setIsDetailModalOpen(false)}
                    footer={false}
                    style={{ minWidth: "1000px" }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: "20px", marginBottom: "20px" }}>
                        <Button
                            icon={<CaretUpOutlined />}
                            onClick={() => setIsExtendModalOpen(true)} type={'primary'}
                            style={{ fontSize: 14, height: 'auto' }}
                        >
                            Gia hạn
                        </Button>
                        <Popconfirm
                            title="Xoá gia hạn cuối cùng?"
                            onConfirm={() => undoExtend()}
                            okText="Yes"
                            cancelText="No">
                            <Button
                                icon={<DeleteOutlined />} danger
                                style={{ fontSize: 14, height: 'auto' }}
                            >
                                Xoá gia hạn cuối
                            </Button>
                        </Popconfirm>

                    </div>
                    <Table
                        className="custom-table"
                        columns={columns}
                        dataSource={updateLicenseRecord?.durationLog}
                        rowKey={"setDate"}
                    />
                </Modal >
            </>
        )
    }
}
export default DetailLicenseModal