'use client'
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, notification, Avatar } from 'antd';
import { sendRequest } from '@/utlis/api';
import ChangePasswordModal from './changepassword.modal';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';


interface IProps {
    isUserInfoModal: boolean
    setUserInfoModalOpen: (v: boolean) => void
}

const UserInfoModal = (props: IProps) => {

    const [form] = Form.useForm()
    const router = useRouter();
    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const { isUserInfoModal, setUserInfoModalOpen } = props
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
    const [userInfo, setUserInfo] = useState()

    const getUser = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${authInfo?.user?._id}`,
            method: "GET",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
        });
        setUserInfo(res.data)
    }

    useEffect(() => {
        if (authState) { getUser() }
    }, [isUserInfoModal])

    useEffect(() => {
        if (authState && userInfo) {
            form.setFieldsValue({
                //@ts-ignore
                name: userInfo.name,
                //@ts-ignore
                phoneNumber: userInfo.phoneNumber,
                //@ts-ignore
                email: userInfo.email,
            })
        }
    }, [isUserInfoModal, userInfo])

    const handleClose = () => {
        form.resetFields()
        setUserInfoModalOpen(false)
    }

    function getAvatarName(name: string) {
        const words = name?.split(' ').filter(Boolean);
        if (words) {
            if (words.length === 0) return '';

            if (words.length === 1) {
                return words[0][0].toUpperCase();
            }

            const firstInitial = words[0][0];
            const lastInitial = words[words.length - 1][0];
            return (firstInitial + lastInitial).toUpperCase();
        }
    }

    function capitalizeFirstLetter(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    function getUserName(name: string) {
        const words = name?.split(' ').filter(Boolean).map(capitalizeFirstLetter);

        if (words) {
            if (words.length === 0) return '';
            if (words.length === 1) return words[0];
            if (words.length > 4) {
                // Bỏ từ thứ hai và lấy 3 từ còn lại
                return `${words[0]} ${words[2]} ${words[3]}`;
            }
            // Trường hợp còn lại, trả về tên đầy đủ
            return words.join(' ');
        }

    }

    const onFinish = async (values: any) => {
        const { name, phoneNumber } = values
        const data = { name, phoneNumber }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/user-change-info`,
            method: "PUT",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: data
        })

        if (res.data) {
            await getUser()
            notification.success({
                message: `Cập nhật thông tin thành công`
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
        `}
            </style>
            <ChangePasswordModal
                isChangePasswordOpen={isChangePasswordOpen}
                setIsChangePasswordOpen={setIsChangePasswordOpen}
            />
            <Modal
                className="custom-modal"
                title=""
                open={isUserInfoModal}
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
                            Thông tin người dùng
                        </h1>
                    </Form.Item>
                    <div style={{
                        marginTop: '10px',
                        marginBottom: '30px',
                        height: "50px",
                        color: '#dfdfdf',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'middle'
                    }}>
                        <Avatar
                            style={{
                                backgroundColor: authState ? '#7265e6' : '#404040',
                                marginRight: '20px',
                                minWidth: '60px',
                                height: '60px',
                                paddingTop: '2px',
                                fontSize: 20,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {authState ? getAvatarName(authInfo.user.name) : ''}
                        </Avatar>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginTop: authState ? '-4px' : '3px', marginLeft: authState ? '0px' : '12px' }}>
                            <div style={{ fontSize: 20, color: 'white' }}>{authState ? getUserName(authInfo.user.name) : ''}</div>
                            {authState && (
                                <div style={{ display: 'flex', marginTop: -3 }} >
                                    <div style={{
                                        fontSize: 12, marginTop: 5, padding: '0px 5px 0px 5px',
                                        background:
                                            authInfo.user.role === "T2M ADMIN" ? '#98217c' : (
                                                !authInfo.user.licenseInfo?.accessLevel ? '#404040' : (
                                                    authInfo.user.licenseInfo?.accessLevel === 1 ? '#1E7607' : (
                                                        authInfo.user.licenseInfo?.accessLevel === 2 ? '#1777ff' : (
                                                            authInfo.user.licenseInfo?.accessLevel === 3 ? '#642198' : '#98217c'
                                                        )))),
                                        borderRadius: 5, width: 'fit-content'
                                    }}
                                    >
                                        {authInfo.user.role === "T2M ADMIN" ? "ADMIN" : authInfo.user.licenseInfo?.product ?? 'FREE'}
                                    </div>
                                    {(authInfo.user.licenseInfo?.daysLeft && authInfo.user.licenseInfo?.daysLeft < 370) && (
                                        //@ts-ignore
                                        <div style={{ fontSize: 12, marginTop: 5, marginLeft: '5px', padding: '0px 5px 0px 5px', background: '#A20D0D', borderRadius: 5, width: 'fit-content' }}>
                                            {`${authInfo.user.licenseInfo?.daysLeft} days`}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {authInfo?.user?.role === "T2M ADMIN" && (
                            <Button type='primary' style={{ marginLeft: '70px' }}>
                                <a href="/admin" onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/admin/dashboard')
                                }} >
                                    ADMIN PORTAL
                                </a>
                            </Button>
                        )}
                    </div>

                    <Form.Item
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Tên hiển thị</span>}
                        name="name"
                    >
                        <Input style={{ background: '#333333', border: '0px', color: '#dfdfdf' }} size='large' />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Số điện thoại</span>}
                        name="phoneNumber"
                    >
                        <Input style={{ background: '#333333', border: '0px', color: '#dfdfdf' }} size='large' />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Email</span>}
                        name="email"
                    >
                        <Input disabled style={{ background: '#333333', color: '#dfdfdf', border: '0px' }} size='large' />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Mật khẩu</span>}
                        name="password"
                        style={{ marginBottom: '30px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Input disabled style={{ background: '#333333', border: '0px', color: '#dfdfdf', width: '60%' }} size='large' value='•••••••••••' />
                            <Button
                                type='primary'
                                style={{ fontSize: 16, marginRight: '10px' }}
                                onClick={() => {
                                    setIsChangePasswordOpen(true)
                                    setUserInfoModalOpen(false)
                                }}
                            >
                                Đổi mật khẩu
                            </Button>
                        </div>
                    </Form.Item>


                    <Form.Item style={{ marginBottom: '5px' }}>
                        <Button type="primary" htmlType="submit" block
                            style={{
                                height: '40px', // hoặc bất kỳ độ cao nào bạn muốn
                                fontWeight: 'bold', // làm chữ đậm
                                fontSize: 16,
                                marginBottom: '20px'
                            }}
                        >
                            Cập nhật thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </Modal >
        </>
    )
}

export default UserInfoModal