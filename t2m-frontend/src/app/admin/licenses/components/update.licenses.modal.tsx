'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, Button, InputNumber } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useEffect, useState } from 'react';
const { Option } = Select;

interface IProps {
    getData: any
    isUpdateModalOpen: boolean
    setIsUpdateModalOpen: (v: boolean) => void
    updateLicenseRecord: any
}

const UpdateLicenseModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const { getData, isUpdateModalOpen, setIsUpdateModalOpen, updateLicenseRecord } = props

    let tempInitial: string[] = []
    const [validSponsorsCode, setValidSponsorsCode] = useState(tempInitial)
    const [validProduct, setValidProduct] = useState(tempInitial)
    const [maxDiscount, setMaxDiscount] = useState(0)
    const [finalPrice, setFinalPrice] = useState(0)
    const [discountPercent, setDiscountPercent] = useState(0)

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

    const handleDiscountPrice = (discountPercent: number) => {
        setDiscountPercent(discountPercent)
        setFinalPrice(finalPrice - (finalPrice * discountPercent / 100))
    }

    const onFinish = async (values: any) => {

        const { product, discountCode, discountPercent, monthAdjust, priceAdjust } = values
        const data = { product, discountCode, discountPercent, monthAdjust, priceAdjust }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/licenses/${updateLicenseRecord._id}`,
            method: "PUT",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            body: data
        })

        if (res.data) {
            await getData()
            notification.success({
                message: "Cập nhật sản phẩm thành công"
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

    useEffect(() => {
        if (updateLicenseRecord) {
            form.setFieldsValue({
                product: updateLicenseRecord.product,
                discountCode: updateLicenseRecord.discountCode,
                discountPercent: updateLicenseRecord.discountPercent,
                monthAdjust: 0,
                priceAdjust: updateLicenseRecord.finalPrice,
            })
        }
    }, [isUpdateModalOpen])

    const handleClose = () => {
        form.resetFields()
        setIsUpdateModalOpen(false)
    }

    const validateProductNameExist = async (_: RuleObject, value: string) => {
        const productRegex = /^[A-Z0-9]{1,10}$/;
        if (value && !productRegex.test(value.split('@')[0])) {
            throw new Error('Tên sản phẩm không đúng định dạng, tối đa 10 kí tự bao gồm chữ hoa hoặc số.');
        }

        if (value && !validProduct.includes(value)) {
            throw new Error('Tên sản phẩm không tồn tại!');
        }

        // Nếu email hợp lệ và tồn tại trong danh sách, trả về Promise.resolve
        return Promise.resolve();
    };

    const getSponsorsCodeList = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discountcodes/sponsorcode`,
            method: "GET",
        })
        setValidSponsorsCode(res.data)
    }

    // Hàm kiểm tra mã giới hiệu
    const validateSponsorsCode = (_: RuleObject, value: any) => {
        if (!value || validSponsorsCode.includes(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Mã giới thiệu không tồn tại!'));
    };

    useEffect(() => {
        getSponsorsCodeList()
        getProductList()
    }, [authState])

    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {

        return (
            <>
                <style>
                    {`
                    .ant-input-number-handler-wrap {
                    opacity: 1 !important;
                    visibility: visible !important;
                  }
                `}
                </style>
                <Modal
                    title="Chỉnh sửa thông tin License"
                    open={isUpdateModalOpen}
                    onOk={() => form.submit()}
                    onCancel={handleClose}
                    maskClosable={false}
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

                        <Form.Item
                            style={{ marginBottom: "5px" }}
                            label="Tên sản phẩm"
                            name="product"
                            rules={[
                                { required: true, message: 'Tên sản phẩm không được để trống!' },
                                { validator: validateProductNameExist }
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
                            label="Điều chỉnh số tháng"
                            name="monthAdjust"
                            rules={[{ required: true, type: 'number', min: -99, max: 99 }]}
                        >
                            <InputNumber placeholder="Nhập chính xác giá sau chiết khấu" />
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: "5px" }}
                            label="Giá sau giảm"
                            name="priceAdjust"
                            rules={[{ required: true, message: 'Giá sản phẩm không được để trống!' }]}
                        >
                            <Input placeholder="Nhập chính xác giá sau chiết khấu" />
                        </Form.Item>
                    </Form>
                </Modal >
            </>
        )
    }
}
export default UpdateLicenseModal