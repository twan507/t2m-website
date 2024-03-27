'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { UploadOutlined } from '@ant-design/icons';
import { Modal, Input, notification, Form, Select, Button, InputNumber, Upload } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';
const { Option } = Select;

interface IProps {
    isExtendModalOpen: boolean
    setIsExtendModalOpen: (v: boolean) => void
}

const ExtendLicenseModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const { isExtendModalOpen, setIsExtendModalOpen } = props

    const onFinish = async (values: any) => {
        const { code, maxDiscount } = values
        const data = { code, maxDiscount }

        // const res = await sendRequest<IBackendRes<any>>({
        //     url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discountcodes/${updateDiscountCodeRecord._id}`,
        //     method: "PUT",
        //     headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
        //     body: data
        // })

        // const res_user = await sendRequest<IBackendRes<any>>({
        //     url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/find-by-email`,
        //     method: "POST",
        //     headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
        //     body: { email: updateDiscountCodeRecord.userEmail }
        // })

        // await sendRequest<IBackendRes<any>>({
        //     url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${res_user.data._id}`,
        //     method: "PATCH",
        //     headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
        //     body: { affiliateCode: updateDiscountCodeRecord.isActive ? code : '' }
        // })

        // if (res.data) {
        //     await getData()
        //     notification.success({
        //         message: "Cập nhật thông tin mã giảm giá thành công"
        //     })
        //     handleClose()
        // } else {
        //     notification.error({
        //         message: "Có lỗi xảy ra",
        //         description: res.message
        //     })
        // }
    };

    const [form] = Form.useForm()

    const handleClose = () => {
        form.resetFields()
        setIsExtendModalOpen(false)
    }

    const validateDiscountCode = async (_: RuleObject, value: string) => {
        const DiscountCodeRegex = /^[A-Z0-9]{1,10}$/;
        if (value && !DiscountCodeRegex.test(value.split('@')[0])) {
            throw new Error('Mã không đúng định dạng, tối đa 6 kí tự bao gồm chữ in hoa hoặc số.');
        }
    };

    const [uploadCheck, setUploadCheck] = useState(false)

    const uploadImage = async (options: any) => {
        const { file, onSuccess, onError, onProgress } = options

        if (!form.getFieldValue('userEmail')) {
            onError(new Error('Chưa điền Email người dùng'))
            return notification.error({
                message: "Có lỗi xảy ra",
                description: "Chưa điền Email người dùng"
            })
        }

        // Tạo một đối tượng FormData mới và thêm file
        const formData = new FormData();
        formData.append('fileUpload', file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authInfo.access_token}`,
                    'folder_type': 'licenses',
                    'email': `${form.getFieldValue('userEmail')}`
                },
                body: formData,
            });

            if (response.ok) {
                // Giả sử API trả về JSON với thông tin của file đã được tải lên
                const data = await response.json();
                // Gọi onSuccess với kết quả để thông báo cho component Upload biết
                onSuccess(data, file);
                // Đặt trạng thái thành công cho state upload
                setUploadCheck(true)
            } else {
                // Nếu server trả về status lỗi
                const error = await response.json();
                onError(new Error(error.message));
            }
        } catch (error) {
            // Xử lý lỗi từ fetch hoặc lỗi mạng
            onError(error);
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {

        return (
            <Modal
                title="Gia hạn License"
                open={isExtendModalOpen}
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
                        label="Thời hạn (Tháng)"
                        name="monthExtend"
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
                        label="Số tiền thanh toán"
                        name="price"
                        rules={[
                            { required: true, message: 'Số tiền không hợp lệ', type: 'number', min: 0 },
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            step={100000}
                            placeholder="Nhập số tiền thanh toán gia hạn"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ảnh xác nhận chuyển khoản"
                        name="confirmImage"
                        getValueFromEvent={normFile}
                        valuePropName="fileList"
                        style={{ marginTop: '10px' }}
                    >
                        <Upload customRequest={uploadImage} listType="picture"
                        >
                            {!uploadCheck ? (
                                <Button type="dashed" style={{ height: '35px', width: '470px' }} icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                            ) : null}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
export default ExtendLicenseModal