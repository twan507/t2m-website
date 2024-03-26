'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, Button } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';

interface IProps {
    getData: any
    isCTVModalOpen: boolean
    setIsCTVModalOpen: (v: boolean) => void
    updateUserRecord: any
}

const ManageCTVModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const [form] = Form.useForm()

    const { getData, isCTVModalOpen, setIsCTVModalOpen, updateUserRecord } = props



    useEffect(() => {
        if (updateUserRecord) {
            form.setFieldsValue({
                email: updateUserRecord.email,
            })
        }
    }, [isCTVModalOpen])


    const validateCTVCode = (_: RuleObject, value: any) => {
        // Định nghĩa biểu thức chính quy cho mã giới thiệu
        const regex = /^[A-Z0-9]{6}$/;

        // Kiểm tra nếu người dùng có role là T2M USER
        if (updateUserRecord.role === 'T2M USER') {
            // Kiểm tra xem mã có đúng định dạng không
            if (!value || !regex.test(value)) {
                return Promise.reject(new Error('Mã CTV phải có 6 kí tự, bao gồm chữ số và kí tự in hoa.'));
            }
            return Promise.resolve()
        } else {
            return Promise.resolve()
        }
    };

    //Hàm kiểm tra email
    const validateEmail = async (_: RuleObject, value: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (value && !emailRegex.test(value)) {
            throw new Error('Email không đúng định dạng.');
        }
    };

    const handleClose = () => {
        form.resetFields()
        setIsCTVModalOpen(false)
    }

    const onFinish = async (values: any) => {
        const { email, ctvCode } = values
        const data = { email, ctvCode }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/manage-ctv`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: { email: data.email, ctvCode: data.ctvCode }
        })

        if (res.data) {
            await getData()
            notification.success({
                message: `Điều chỉnh quyền CTV thành công`
            })
            handleClose()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    }

    let ctvCodePlaceHolder: any
    if (updateUserRecord) {
        ctvCodePlaceHolder = (updateUserRecord.role === 'T2M CTV' ? `Nhập mã ${updateUserRecord.affiliateCode} để xác nhận huỷ quyền CTV` : 'Tạo mã CTV mới')
    }
    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {

        return (
            <Modal
                title="Thay đổi quyền CTV người dùng"
                open={isCTVModalOpen}
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

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email không được để trống!' },
                            { validator: validateEmail }
                        ]}
                    >
                        <Input placeholder="Nhập Email người dùng mới" />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        name="ctvCode"
                        label="Mã CTV"
                        rules={[{ validator: validateCTVCode }]}
                    >
                        <Input placeholder={ctvCodePlaceHolder} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item style={{ display: 'none' }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
export default ManageCTVModal