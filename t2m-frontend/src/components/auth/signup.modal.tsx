'use client'
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Typography, Select, notification } from 'antd';
import { sendRequest } from '@/utlis/api';
import { RuleObject } from 'antd/es/form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


interface IProps {
    isSignUpModalOpen: boolean
    setSignUpModalOpen: (v: boolean) => void
}

type FieldType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    affiliateCode?: string;
    sponsorCode?: string;
};

const AuthSignUpModal = (props: IProps) => {

    const router = useRouter()
    const [form] = Form.useForm()

    const { isSignUpModalOpen, setSignUpModalOpen } = props

    let tempInitial: string[] = []
    const [validSponsorsCode, setValidSponsorsCode] = useState(tempInitial)

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

    const handleClose = () => {
        form.resetFields()
        setSignUpModalOpen(false)
    }

    const getSponsorsCodeList = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discountcodes/sponsorcode`,
            method: "GET",
        })
        setValidSponsorsCode(res.data)
    }

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

    //Hàm kiểm tra mật khẩu
    const validatePassword = async (_: RuleObject, value: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (value && !passwordRegex.test(value)) {
            throw new Error('Mật khẩu tối thiểu 6 kí tự, bao gồm chữ in hoa và chữ số.');
        }
    };


    //Hàm kiểm tra confirm password
    const validatePasswordsMatch = async (_: RuleObject, value: string) => {
        if (form.getFieldValue('password') !== value) {
            throw new Error('Mật khẩu xác nhận chưa trùng khớp');
        }
    };


    const onFinish = async (values: any) => {
        const { name, email, password, confirmPassword, phoneNumber, sponsorCode } = values
        const data = { name, email, password, confirmPassword, phoneNumber, sponsorCode }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
            method: "POST",
            body: data
        })

        if (res.data) {
            notification.success({
                message: "Đăng kí thành công"
            })
            handleClose()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    const prefixSelector = (
        <Form.Item name="prefix" noStyle >
            <Select style={{ width: 95 }} open={false} >
                <Select.Option value=""><img src="/photo/flag.png" alt="flag" style={{ height: '20px', marginBottom: '-5px' }} />
                    <span style={{ color: "#dfdfdf" }}>&nbsp;+84</span>
                </Select.Option>
            </Select>
        </Form.Item>
    );

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

          .custom-modal .ant-input-group .ant-input-group-addon {
            background-color: #333333;
            color: #dfdfdf;
            border-color: #333333;
          }

          .custom-modal .ant-select-item-option-active {
            background-color: #333333 !important;
            } 

        `}
            </style>
            <Modal
                className="custom-modal"
                title=""
                open={isSignUpModalOpen}
                onOk={handleClose}
                onCancel={handleClose}
                footer={null}
                closeIcon={null}
            >
                <Form
                    form={form}
                    layout='vertical'
                    style={{
                        width: '100%',
                        padding: '10px 30px 10px 30px',
                        boxSizing: 'border-box', // Đảm bảo padding và border không làm tăng kích thước tổng thể của Form
                        backgroundColor: '#191919',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px 0 black' /* Đổ bóng với độ sâu 2px và màu đen có độ trong suốt 10% */

                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={{ prefix: "" }}
                >
                    <Form.Item style={{ display: 'flex', justifyContent: 'left', margin: '0px' }}>
                        <h1
                            style={{ fontSize: 20, color: '#dfdfdf' }}
                        >
                            Đăng ký
                        </h1>
                    </Form.Item>

                    {/* Dummy fields */}
                    <div style={{ display: 'none' }}>
                        <Input name="username" type="text" autoComplete="email" />
                        <Input name="pass" type="password" autoComplete="current-password" />
                    </div>

                    <Form.Item
                        style={{ marginBottom: "20px" }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Tên hiển thị</span>}
                        name="name"
                        rules={[{ required: true, message: 'Tên hiển thị không được để trống!' }]}
                    >
                        <Input placeholder="Họ và Tên của bạn" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        style={{ marginBottom: "20px" }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Email</span>}
                        name="email"
                        rules={[
                            { required: true, message: 'Email không được để trống!' },
                            { validator: validateEmail }
                        ]}
                    >
                        <Input placeholder="Email sử dụng để đăng nhập hệ thống" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        style={{ marginBottom: '20px' }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}> Số điện thoại</span>}
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Số điện thoại không được để trống!' },
                            { validator: validatePhoneNumber }
                        ]}
                    >
                        <Input addonBefore={prefixSelector} placeholder="Ví dụ: 0912005777" style={{ background: 'white', borderRadius: '7px' }} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        style={{ marginBottom: "20px" }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Mật khẩu</span>}
                        name="password"
                        rules={[
                            { required: true, message: 'Mật khẩu không được để trống!' },
                            { validator: validatePassword }
                        ]}
                    >
                        <Input.Password placeholder="Tối thiểu 6 kí tự, bao gồm cả ký tự in hoa và chữ số." />
                    </Form.Item>

                    <Form.Item<FieldType>
                        style={{ marginBottom: '20px' }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}> Xác nhận mật khẩu</span>}
                        name="confirmPassword"
                        rules={[

                            { validator: validatePasswordsMatch }
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận lại mật khẩu" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        style={{ marginBottom: '0px' }}
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}> Mã giới thiệu</span>}
                        name="sponsorCode"
                        rules={[{ validator: validateSponsorsCode }]}
                    >
                        <Input placeholder="Nhập mã được giới thiệu (Nếu có)" />
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'center', alignItems: 'middle', marginBottom: '0px', marginTop: '10px' }}>
                        <p style={{ fontSize: 13, color: '#dfdfdf', fontStyle: 'italic' }}>
                            Với việc bấm đăng ký, bạn đã đọc và đồng ý với &nbsp;
                            <Link
                                href='/terms'
                                onClick={() => { 
                                    setSignUpModalOpen(false)
                                }}
                                style={{ fontSize: 14, background: 'transparent', border: 0, padding: 0, fontStyle: 'italic' }}
                            >
                                Điều khoản sử dụng.
                            </Link>
                        </p>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '5px' }}>
                        <Button type="primary" htmlType="submit" block loading={loadings[0]} onClick={() => enterLoading(0)}
                            style={{
                                height: '40px', // hoặc bất kỳ độ cao nào bạn muốn
                                fontWeight: 'bold', // làm chữ đậm
                                fontSize: 17,
                                marginTop: '10px',
                                marginBottom: '10px'
                            }}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
}

export default AuthSignUpModal