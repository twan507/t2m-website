'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, Button } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';
const { Option } = Select;

interface IProps {
    getData: any
    isUpdateModalOpen: boolean
    setIsUpdateModalOpen: (v: boolean) => void
    updateUserRecord: any
}

const UpdateUserModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    let tempInitial: string[] = []
    const [validSponsorsCode, setValidSponsorsCode] = useState(tempInitial)

    const { getData, isUpdateModalOpen, setIsUpdateModalOpen, updateUserRecord } = props


    const getSponsorsCodeList = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discountcodes/sponsorcode`,
            method: "GET",
        })
        setValidSponsorsCode(res.data)
    }

    useEffect(() => {
        if (updateUserRecord) {
            form.setFieldsValue({
                email: updateUserRecord.email,
                name: updateUserRecord.name,
                phoneNumber: updateUserRecord.phoneNumber,
                sponsorCode: updateUserRecord.sponsorCode
            })
        }
    }, [isUpdateModalOpen])

    useEffect(() => {
        getSponsorsCodeList()
    }, [])

    const validateSponsorsCode = (_: RuleObject, value: any) => {
        if (!value || validSponsorsCode.includes(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Mã giới thiệu không tồn tại!'));
    };

    //Hàm kiểm tra email
    const validateEmail = async (_: RuleObject, value: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (value && !emailRegex.test(value)) {
            throw new Error('Email không đúng định dạng.');
        }
    };

    //Hàm kiểm tra số điện thoại
    const validatePhoneNumber = async (_: RuleObject, value: string): Promise<void> => {
        const phoneRegex = /^0\d{9}$/;
        if (!value || phoneRegex.test(value)) {
            return;
        }
        throw new Error('Số điện thoại không đúng.');
    };

    const onFinish = async (values: any) => {
        const { name, email, password, phoneNumber, sponsorCode } = values
        const data = { name, email, password, phoneNumber, sponsorCode }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${updateUserRecord._id}`,
            method: "PATCH",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: data
        })

        if (res.data) {
            await getData()
            notification.success({
                message: `Cập nhật thông tin người dùng thành công`
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
        setIsUpdateModalOpen(false)
    }

    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {
        return (
            <Modal
                title="Chỉnh sửa thông tin người dùng"
                open={isUpdateModalOpen}
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
                        label="Tên người dùng"
                        name="name"
                        rules={[{ required: true, message: 'Tên người dùng không được để trống!' }]}
                    >
                        <Input placeholder="Nhập tên đầy đủ của người dùng" />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Số điện thoại không được để trống!' },
                            { validator: validatePhoneNumber }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại người dùng" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        name="sponsorCode"
                        label="Mã giới thiệu"
                        rules={[{ validator: validateSponsorsCode }]}
                    >
                        <Input placeholder="Nhập mã giới thiệu (Nếu có)" style={{ width: "100%" }} />
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
export default UpdateUserModal