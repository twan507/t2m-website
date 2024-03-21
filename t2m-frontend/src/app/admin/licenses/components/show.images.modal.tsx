'use client'
import { useAppSelector } from '@/redux/store';
import { sendRequest } from '@/utlis/api';
import { StopOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
    isImageModalOpen: boolean
    setIsImageModalOpen: (v: boolean) => void
    updateLicenseRecord: any
}

const ImageLicenseModal = (props: IProps) => {

    const authInfo = useAppSelector((state) => state.auth)
    const authState = !!authInfo?.user?._id

    const { isImageModalOpen, setIsImageModalOpen, updateLicenseRecord } = props
    const [imageUrl, setImageUrl] = useState('')

    function convertToDDMMYYYY(isoString: string): string {
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}${month}${year}`;
    }

    const handleClose = () => {
        setIsImageModalOpen(false)
        setImageUrl('')
    }

    const getImage = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/files`,
            method: "GET",
            headers: { 'Authorization': `Bearer ${authInfo.access_token}` },
            queryParams: {
                fileName: `${updateLicenseRecord.userEmail}-${convertToDDMMYYYY(updateLicenseRecord.startDate)}`,
                module: 'licenses'
            },
            responseType: 'blob'
        })
        //@ts-ignore
        try { setImageUrl(URL.createObjectURL(res)) } catch (error) { }
    }

    useEffect(() => {
        if (updateLicenseRecord) {
            getImage()
        }
    }, [updateLicenseRecord])

    const [checkAuth, setCheckAuth] = useState(true);

    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {

        return (
            <>
                <Modal
                    open={isImageModalOpen}
                    onCancel={handleClose}
                    closeIcon={null}
                    footer={null}
                >
                    {imageUrl ? (
                        <img src={imageUrl} alt="Loaded from blob" style={{ maxWidth: '100%' }} />
                    ) : (
                        <Button
                            danger
                            icon={<StopOutlined />}
                            style={{ width: '100%' }}
                        >
                            Không tìm thấy hình ảnh
                        </Button>
                    )}
                </Modal >
            </>

        )
    }
}
export default ImageLicenseModal