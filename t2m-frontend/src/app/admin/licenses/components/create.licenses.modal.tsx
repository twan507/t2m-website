'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Modal, Input, notification, Form, Select, Button, Upload } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';
const { Option } = Select;

interface IProps {
    getData: any
    isCreateModalOpen: boolean
    setIsCreateModalOpen: (v: boolean) => void
}

const CreatLicenseModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const [form] = Form.useForm()

    const { getData, isCreateModalOpen, setIsCreateModalOpen } = props

    const handleClose = () => {
        form.resetFields()
        setIsCreateModalOpen(false)
        setMaxDiscount(0)
        setFinalPrice(0)
        setDiscountPercent(0)
        handleDiscountPrice(0)
        setUploadCheck(false)
    }

    let tempInitial: string[] = []
    const [validSponsorsCode, setValidSponsorsCode] = useState(tempInitial)
    const [validEmailList, setValidEmailList] = useState(tempInitial)
    const [validProduct, setValidProduct] = useState(tempInitial)
    const [maxDiscount, setMaxDiscount] = useState(0)
    const [finalPrice, setFinalPrice] = useState(0)
    const [discountPercent, setDiscountPercent] = useState(0)

    const handleDiscountPrice = (discountPercent: number) => {
        setDiscountPercent(discountPercent)
        setFinalPrice(finalPrice - (finalPrice * discountPercent / 100))
    }

    const getSponsorsCodeList = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discountcodes/sponsorcode`,
            method: "GET",
        })
        setValidSponsorsCode(res.data)
    }

    const getProductList = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/active-list`,
            method: "GET",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
        })
        setValidProduct(res.data)
    }

    const getMaxDiscount = async (code: string) => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discountcodes/find-by-code`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: { code: code }
        })
        try { setMaxDiscount(res.data.maxDiscount) } catch (error) { }
    }

    const getFinalPrice = async (name: string) => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/find-by-product`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: { name: name }
        })
        try { setFinalPrice(res.data.price - (res.data.price * discountPercent / 100)) } catch (error) { }
    }

    const getEmailList = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/email-list`,
            method: "GET",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
        })
        setValidEmailList(res.data)
    }

    useEffect(() => {
        getSponsorsCodeList()
        getEmailList()
        getProductList()
    }, [authState])

    // Hàm kiểm tra mã giới hiệu
    const validateSponsorsCode = (_: RuleObject, value: any) => {
        if (!value || validSponsorsCode.includes(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Mã giới thiệu không tồn tại!'));
    };

    //Hàm kiểm tra email xem có tồn tại không
    const validateEmailExist = async (_: RuleObject, value: any) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        // Kiểm tra định dạng email
        if (value && !emailRegex.test(value)) {
            throw new Error('Email không đúng định dạng.');
        }

        // Kiểm tra email có tồn tại trong danh sách cho phép không
        if (value && !validEmailList.includes(value)) {
            throw new Error('Người dùng không tồn tại!');
        }

        // Nếu email hợp lệ và tồn tại trong danh sách, trả về Promise.resolve
        return Promise.resolve();
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


    const onFinish = async (values: any) => {
        const { userEmail, product, discountCode, discountPercent, finalPrice } = values
        const data = { userEmail, product, discountCode, discountPercent, finalPrice }

        if (uploadCheck === false) {
            return notification.error({
                message: "Có lỗi xảy ra",
                description: "Chưa tải lên hình ảnh xác thực"
            })
        }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/licenses`,
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

    const validateProductName = async (_: RuleObject, value: string) => {
        const productRegex = /^[A-Z0-9]{1,10}$/;
        if (value && !productRegex.test(value.split('@')[0])) {
            throw new Error('Tên sản phẩm không đúng định dạng. Tối đa 10 kí tự bao gồm chữ hoa hoặc số.');
        }

        if (value && !validProduct.includes(value)) {
            throw new Error('Sản phẩm không tồn tại!');
        }

        // Nếu email hợp lệ và tồn tại trong danh sách, trả về Promise.resolve
        return Promise.resolve();
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const [loading, setLoading] = useState(false);

    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {
        return (
            <Modal
                title="Tạo mới License"
                open={isCreateModalOpen}
                onOk={() => {
                    setLoading(true)
                    form.submit()
                }}
                onCancel={handleClose}
                maskClosable={false}
                confirmLoading={loading}
                okButtonProps={{ loading: loading }}
            >
                <Form
                    name="basic"
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                    initialValues={{
                        discountPercent: 0,
                        finalPrice: 0,
                    }}
                >
                    {/* Dummy fields */}
                    <div style={{ display: 'none' }}>
                        <Input name="username" type="text" autoComplete="username" />
                        <Input name="password" type="password" autoComplete="current-password" />
                    </div>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Email người dùng"
                        name="userEmail"
                        rules={[
                            { required: true, message: 'Email người dùng không được để trống!' },
                            { validator: validateEmailExist }
                        ]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Tên sản phẩm"
                        name="product"
                        rules={[
                            { required: true, message: 'Tên sản phẩm không được để trống!' },
                            { validator: validateProductName }
                        ]}
                    >
                        <Input onChange={(e) => getFinalPrice(e.target.value)} placeholder="Nhập tên sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Mã giảm giá"
                        name="discountCode"
                        rules={[
                            { validator: validateSponsorsCode }
                        ]}
                    >
                        <Input onChange={(e) => getMaxDiscount(e.target.value)} placeholder="Nhập mã giảm giá (Nếu có)" />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Tỉ lệ giảm giá"
                        name="discountPercent"
                        rules={[{ required: true, message: 'Access Level không được để trống!' }]}
                    >
                        <Select value={discountPercent} onChange={handleDiscountPrice}>
                            <Option value={0}>0%</Option>
                            {maxDiscount >= 5 && <Option value={5}>5%</Option>}
                            {maxDiscount >= 10 && <Option value={10}>10%</Option>}
                            {maxDiscount >= 15 && <Option value={15}>15%</Option>}
                            {maxDiscount >= 20 && <Option value={20}>20%</Option>}
                            {maxDiscount >= 25 && <Option value={25}>25%</Option>}
                            {maxDiscount >= 30 && <Option value={30}>30%</Option>}
                            {maxDiscount >= 35 && <Option value={35}>35%</Option>}
                            {maxDiscount >= 40 && <Option value={40}>40%</Option>}
                            {maxDiscount >= 45 && <Option value={45}>45%</Option>}
                            {maxDiscount >= 50 && <Option value={50}>50%</Option>}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Giá sau giảm"
                        name="finalPrice"
                        rules={[{ required: true, message: 'Giá sản phẩm không được để trống!' }]}
                    >
                        <Select
                        >
                            <Option value={finalPrice}>{finalPrice}</Option>
                        </Select>
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
            </Modal >
        )
    }
}

export default CreatLicenseModal