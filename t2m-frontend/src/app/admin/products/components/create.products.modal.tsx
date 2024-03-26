'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, Button, InputNumber } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';
const { Option } = Select;

interface IProps {
    getData: any
    isCreateModalOpen: boolean
    setIsCreateModalOpen: (v: boolean) => void
}

const CreatProductModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const { getData, isCreateModalOpen, setIsCreateModalOpen } = props

    const onFinish = async (values: any) => {
        const { name, monthsDuration, accessLevel, price } = values
        const data = { name, monthsDuration, accessLevel, price }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: data
        })

        if (res.data) {
            await getData()
            notification.success({
                message: "Tạo mới sản phẩm thành công"
            })
            handleClose()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    };

    const [form] = Form.useForm()

    const handleClose = () => {
        form.resetFields()
        setIsCreateModalOpen(false)
    }

    const validateProductName = async (_: RuleObject, value: string) => {
        const productRegex = /^[A-Z0-9]{1,10}$/;
        if (value && !productRegex.test(value.split('@')[0])) {
            throw new Error('Tên sản phẩm không đúng định dạng, tối đa 10 kí tự bao gồm chữ hoa hoặc số.');
        }
    };
    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {

        return (
            <Modal
                title="Tạo mới sản phẩm"
                open={isCreateModalOpen}
                onOk={() => form.submit()}
                onCancel={handleClose}
                maskClosable={false}>

                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    {/* Dummy fields */}
                    <div style={{ display: 'none' }}>
                        <Input name="username" type="text" autoComplete="username" />
                        <Input name="password" type="password" autoComplete="current-password" />
                    </div>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Tên sản phẩm"
                        name="name"
                        rules={[
                            { required: true, message: 'Tên sản phẩm không được để trống!' },
                            { validator: validateProductName }
                        ]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Thời hạn (Tháng)"
                        name="monthsDuration"
                        rules={[
                            { required: true, message: 'Thời hạn không được để trống!' },
                        ]}
                    >
                        <Select placeholder="Chọn thời hạn cho sản phẩm">
                            {
                                Array.from({ length: 24 }, (_, i) => i + 1).map(value => (
                                    <Option key={value} value={value}>{value} Tháng</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Access Level"
                        name="accessLevel"
                        rules={[{ required: true, message: 'Access Level không được để trống!' }]}>
                        <Select
                            placeholder="Chọn Access Level cho sản phẩm"
                        >
                            <Option value={1}>Level 1</Option>
                            <Option value={2}>Level 2</Option>
                            <Option value={3}>Level 3</Option>
                            <Option value={4}>Level 4</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Giá sản phẩm"
                        name="price"
                        rules={[
                            { required: true, message: 'Giá sản phẩm không được để trống!' },
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={100000}
                            step={100000}
                            placeholder="Tối thiểu 100,000" />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default CreatProductModal