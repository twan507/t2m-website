'use client'
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, Button } from 'antd';
import { FormInstance, RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';
import ForgetPasswordModal from './forgetpassword.modal';
import { useAppSelector } from '@/redux/store';

interface IProps {
    isChangePasswordOpen: boolean
    setIsChangePasswordOpen: (v: boolean) => void
}

const ChangePasswordModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const [form] = Form.useForm()

    const { isChangePasswordOpen, setIsChangePasswordOpen } = props

    const [isForgetPasswordOpen, setIsForgetPasswordOpen] = useState(false)

    //Hàm kiểm tra password
    const validatePassword = async (_: RuleObject, value: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (value && !passwordRegex.test(value)) {
            throw new Error('Mật khẩu tối thiểu 6 kí tự, bao gồm cả ký tự in hoa và chữ số.');
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
        setIsChangePasswordOpen(false)
    }

    const onFinish = async (values: any) => {
        const { currentPassword, newPassword, confirmPassword } = values
        const data = { currentPassword, newPassword, confirmPassword }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/change-password`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: data
        })

        if (res.data) {
            notification.success({
                message: `Đổi mật khẩu thành công`
            })
            handleClose()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    }

    const [loadings, setLoadings] = useState<boolean[]>([]);

    const enterLoading = (index: number) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        setTimeout(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 6000);
    };

    return (
        <>
            <style>
                {`
      .custom-modal .ant-modal-content {
        background-color: transparent !important;
        box-shadow: none !important;
      }
      .custom-modal .ant-modal-header,
      .custom-modal .ant-modal-body,
      .custom-modal .ant-modal-footer {
        background-color: transparent !important;
      }
      .custom-modal .ant-modal-wrap {
        background-color: transparent !important;
      }

      .custom-modal .ant-input {
        background-color: #333333;
        border: 0px;
        color: #dfdfdf;
      }

      .custom-modal .ant-input-password input {
        background-color: #333333;
        color: #dfdfdf
      }

      .custom-modal .ant-input-password {
        background-color: #333333;
        border: 0px;
      }

      .custom-modal .ant-input::placeholder {
        color: #666666;
      }

      .custom-modal .ant-input-password input::placeholder {
        color: #666666;
      }

      .custom-modal .ant-input-password-icon {
        color: #999999 !important;
      }          

      .custom-modal .ant-input-password-icon:hover {
        color: #dfdfdf !important;
      }

    `}
            </style>
            <ForgetPasswordModal
                isForgetPasswordOpen={isForgetPasswordOpen}
                setIsForgetPasswordOpen={setIsForgetPasswordOpen}
            />
            <Modal
                className="custom-modal"
                open={isChangePasswordOpen}
                onOk={() => form.submit()}
                onCancel={handleClose}
                footer={null}
                closeIcon={null}
            >
                <Form

                    form={form}
                    layout='vertical'
                    style={{
                        maxWidth: '500px',
                        width: '100%',
                        padding: '10px 30px 10px 30px',
                        boxSizing: 'border-box', // Đảm bảo padding và border không làm tăng kích thước tổng thể của Form
                        backgroundColor: '#191919',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px 0 black' /* Đổ bóng với độ sâu 2px và màu đen có độ trong suốt 10% */
                    }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"

                >
                    <Form.Item style={{ display: 'flex', justifyContent: 'left', marginBottom: '10px' }}>
                        <h1
                            style={{ fontSize: 20, color: '#dfdfdf' }}
                        >
                            Thay đổi mật khẩu
                        </h1>
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "20px" }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Mật khẩu cũ</span>}
                        name="currentPassword"
                        rules={[
                            { required: true, message: 'Mật khẩu không được để trống!' },
                            { validator: validatePassword }
                        ]}
                    >
                        <Input.Password placeholder="Tối thiểu 6 kí tự, bao gồm cả ký tự in hoa và chữ số." />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "20px" }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Mật khẩu mới</span>}
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Mật khẩu không được để trống!' },
                            { validator: validatePassword }
                        ]}
                    >
                        <Input.Password placeholder="Tối thiểu 6 kí tự, bao gồm cả ký tự in hoa và chữ số." />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Xác nhận mật khẩu</span>}
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Xác nhận mật khẩu không được để trống!' },
                            { validator: validatePasswordsMatch }
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu" />
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginTop: '5px', marginRight: '-15px' }}>
                        <Button
                            type='link'
                            style={{ fontSize: 14, fontStyle: 'italic', textDecoration: 'underline' }}
                            onClick={() => {
                                setIsForgetPasswordOpen(true)
                                setIsChangePasswordOpen(false)
                            }}
                        >
                            Quên mật khẩu?
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '0px', marginTop: '10px' }}>
                        <Button type="primary"
                            onClick={() => {
                                form.submit()
                                enterLoading(0)
                            }}
                            block loading={loadings[0]}
                            style={{
                                height: '40px', // hoặc bất kỳ độ cao nào bạn muốn
                                fontWeight: 'bold', // làm chữ đậm
                                fontSize: 16,
                                marginBottom: '20px'
                            }}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal >
        </>
    )
}

export default ChangePasswordModal