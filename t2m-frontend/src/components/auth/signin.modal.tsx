'use client'
import React, { useState } from 'react';
import { Button, Form, Input, Divider, Modal, notification } from 'antd';
import AuthSignUpModal from './signup.modal';
import ForgetPasswordModal from './forgetpassword.modal';
import { signIn } from '@/utlis/signIn';
import { useAppDispatch } from '@/redux/store';
import { setAuthState } from '@/redux/authSlice';


interface IProps {
    isSignInModalOpen: boolean
    setSignInModalOpen: (v: boolean) => void
}

type FieldType = {
    username?: string;
    password?: string;
};

const AuthSignInModal = (props: IProps) => {

    const dispatch = useAppDispatch();

    const [form] = Form.useForm()

    const { isSignInModalOpen, setSignInModalOpen } = props
    const [isSignUpModalOpen, setSignUpModalOpen] = useState(false)
    const [isForgetPasswordOpen, setIsForgetPasswordOpen] = useState(false)

    const handleClose = () => {
        form.resetFields()
        setSignInModalOpen(false)
    }

    const onFinish = async () => {
        const loginData = await signIn(form)
        if (loginData) {
            dispatch(setAuthState(loginData))
            handleClose()
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <style>
                {`

            .ant-input:-webkit-autofill,
            .ant-input:-webkit-autofill:hover, 
            .ant-input:-webkit-autofill:focus, 
            .ant-input:-webkit-autofill:active{
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: #dfdfdf !important;
                -webkit-box-shadow: 0 0 0 30px #333333 inset !important;
                transition: background-color 5000s ease-in-out 0s;
            }

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
            <AuthSignUpModal
                isSignUpModalOpen={isSignUpModalOpen}
                setSignUpModalOpen={setSignUpModalOpen}
            />
            <ForgetPasswordModal
                isForgetPasswordOpen={isForgetPasswordOpen}
                setIsForgetPasswordOpen={setIsForgetPasswordOpen}
            />
            <Modal
                className="custom-modal"
                title=""
                open={isSignInModalOpen}
                onOk={handleClose}
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
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item style={{ display: 'flex', justifyContent: 'left', margin: '0px' }}>
                        <h1
                            style={{ fontSize: 20, color: '#dfdfdf' }}
                        >
                            Đăng nhập
                        </h1>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Email</span>}
                        name="username"
                        rules={[{ required: true, message: 'Email đăng nhập không được để trống!' }]}
                    >
                        <Input size='large' placeholder="Nhập email của bạn." />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Mật khẩu</span>}
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                        style={{ marginBottom: '5px' }}
                    >
                        <Input.Password size='large' placeholder="Nhập mật khẩu của bạn." />
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginTop: '5px', marginRight: '-15px' }}>
                        <Button
                            type='link'
                            style={{ fontSize: 14, fontStyle: 'italic', textDecoration: 'underline' }}
                            onClick={() => {
                                setIsForgetPasswordOpen(true)
                                setSignInModalOpen(false)
                            }}
                        >
                            Quên mật khẩu?
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '5px' }}>
                        <Button type="primary" htmlType="submit" block
                            style={{
                                height: '40px', // hoặc bất kỳ độ cao nào bạn muốn
                                fontWeight: 'bold', // làm chữ đậm
                                fontSize: 17,
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <Divider style={{ color: '#dfdfdf', borderColor: '#dfdfdf', fontSize: '14px', margin: '0px' }}>
                        Hoặc
                    </Divider>

                    <Form.Item style={{ marginTop: '5px', marginBottom: '0px' }}>
                        <Button
                            block ghost type='primary'
                            style={{
                                height: '40px', // hoặc bất kỳ độ cao nào bạn muốn
                                fontWeight: 'bold', // làm chữ đậm
                                fontSize: 17,
                            }}
                            onClick={() => setSignInModalOpen(false)}
                        >
                            Dùng thử miễn phí
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'center', alignItems: 'middle', marginBottom: '0px' }}>
                        <p style={{ fontSize: 13, color: '#dfdfdf' }}>
                            Bạn chưa có tài khoản?&nbsp;
                            <Button
                                type='link'
                                onClick={() => {
                                    setSignInModalOpen(false)
                                    setSignUpModalOpen(true)
                                }}
                                style={{ fontSize: 14, background: 'transparent', border: 0, padding: 0, fontStyle: 'italic' }}
                            >
                                Đăng ký ngay
                            </Button>
                        </p>
                    </Form.Item>
                </Form>
            </Modal >
        </>
    )
}

export default AuthSignInModal