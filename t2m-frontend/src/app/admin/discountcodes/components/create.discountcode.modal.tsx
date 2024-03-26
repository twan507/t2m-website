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

const CreatDiscountCodeModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const { getData, isCreateModalOpen, setIsCreateModalOpen } = props

    const onFinish = async (values: any) => {
        const { code, maxDiscount } = values
        const data = { code, maxDiscount }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discountcodes`,
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

    const validateDiscountCode = async (_: RuleObject, value: string) => {
        const DiscountCodeRegex = /^[A-Z0-9]{6}$/;
        if (value && !DiscountCodeRegex.test(value.split('@')[0])) {
            throw new Error('Mã không đúng định dạng, tối đa 6 kí tự bao gồm chữ in hoa hoặc số.');
        }
    };

    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {

        return (
            <Modal
                title="Tạo mới mã giảm giá"
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
                        label="Mã giảm giá"
                        name="code"
                        rules={[
                            { required: true, message: 'Mã giảm giá không được để trống!' },
                            { validator: validateDiscountCode }
                        ]}
                    >
                        <Input placeholder="Nhập mã giảm giá" />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Tỉ lệ chiết khấu"
                        name="maxDiscount"
                        rules={[
                            { required: true, message: 'Thời hạn không được để trống!' },
                        ]}
                    >
                        <Select placeholder="Chọn tỉ lệ chiết khấu tối đa cho mã">
                            {
                                Array.from({ length: 10 }, (_, i) => (i + 1) * 5).map(value => (
                                    <Option key={value} value={value}>{value}%</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
export default CreatDiscountCodeModal