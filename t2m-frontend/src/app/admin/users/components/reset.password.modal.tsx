'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, Button } from 'antd';
import { FormInstance, RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';

interface IProps {
    getData: any
    isResetPasswordOpen: boolean
    setIsResetPasswordOpen: (v: boolean) => void
    updateUserRecord: any
}

const ResetPasswordModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id
    const [form] = Form.useForm()

    const { getData, isResetPasswordOpen, setIsResetPasswordOpen, updateUserRecord } = props


    useEffect(() => {
        if (updateUserRecord) {
            form.setFieldsValue({
                email: updateUserRecord.email,
            })
        }
    }, [isResetPasswordOpen])

    //Hàm kiểm tra password
    const validatePassword = async (_: RuleObject, value: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (value && !passwordRegex.test(value)) {
            throw new Error('Mật khẩu tối thiểu 6 kí tự, bao gồm chữ in hoa và chữ số.');
        }
    };

    //Hàm kiểm tra confirm password
    const validatePasswordsMatch = async (_: RuleObject, value: string) => {
        if (form.getFieldValue('newPassword') !== value) {
            throw new Error('Mật khẩu xác nhận chưa trùng khớp');
        }
    };


    const handleClose = () => {
        form.resetFields()
        setIsResetPasswordOpen(false)
    }

    const onFinish = async (values: any) => {
        const { newPassword, confirmPassword } = values
        const data = { newPassword, confirmPassword }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/admin-change-password`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: { email: updateUserRecord.email, newPassword: data.newPassword, confirmPassword: data.confirmPassword }
        })

        if (res.data) {
            await getData()
            notification.success({
                message: `Đặt lại mật khẩu thành công cho ${updateUserRecord.email}`
            })
            handleClose()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    }

    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {
        return (
            <Modal
                title="Đặt lại mật khẩu người dùng"
                open={isResetPasswordOpen}
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
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Mật khẩu không được để trống!' },
                            { validator: validatePassword }
                        ]}
                    >
                        <Input.Password placeholder="Mật khẩu tối thiểu 6 kí tự, bao gồm chữ in hoa và chữ số." />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Xác nhận mật khẩu không được để trống!' },
                            { validator: validatePasswordsMatch }
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu" />
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

export default ResetPasswordModal