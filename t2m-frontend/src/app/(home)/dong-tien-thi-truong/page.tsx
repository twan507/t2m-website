'use client'
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page2 = () => {

  const authInfo = useAppSelector((state) => state.auth)
  const authState = !!authInfo?.user?._id

  const router = useRouter()

  useEffect(() => {
    if (!authState) {
      router.push("/");
    }
  }, [authState, router]);

  const [showOverlay, setShowOverlay] = useState(true);

  const [iframeHeight, setIframeHeight] = useState(3060);
  const iframeWidth = 1300

  const updateIframeSize = () => {

    const currentWidth = window.innerWidth;
    let newHeight = iframeHeight;

    if (currentWidth < iframeWidth) {
      const widthDecrease = iframeWidth - currentWidth;
      newHeight -= widthDecrease * (iframeHeight / iframeWidth  - 0.1);
    }

    setIframeHeight(newHeight);
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 3000);

    window.addEventListener('resize', updateIframeSize);
    updateIframeSize(); // Gọi ngay khi component mount để đảm bảo kích thước iframe được điều chỉnh ngay lập tức

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIframeSize);
    };
  }, []);

  const [checkAuth, setCheckAuth] = useState(true);

  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {

    return (

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Nếu showOverlay là true, hiển thị overlay */}
        {showOverlay && (
          <div style={{
            position: 'fixed', // Sử dụng fixed để overlay che toàn bộ nội dung
            top: 0,
            left: 0,
            zIndex: 100, // Đảm bảo overlay nằm trên cùng
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'black',
            height: '100vh'
          }}>
            <img src="/photo/gif_loading.gif" alt="Loading" width='100%' />
          </div>
        )}
        <div style={{
          position: 'relative',
          width: `${iframeWidth}px`
        }}>
          <iframe
            className="iframe-style"
            style={{
              width: '100%', // Thiết lập chiều rộng của container phù hợp với iframe
              height: `${iframeHeight}px`, // Thiết lập chiều cao của container để chứa đủ iframe và overlay
              border: '0px',
            }}
            src="https://app.powerbi.com/view?r=eyJrIjoiODY4Y2NmNzUtNTI3Zi00ZWM3LThjZTItOGFmZTk2NzRiNWE4IiwidCI6IjUxZmUxNTRlLThlNTYtNGM2NC05ZDM5LTU2NTc0ZDk3MmU1YyIsImMiOjEwfQ%3D%3D"
            title="PowerBI Dashboard">
          </iframe>

          {/* Overlay nằm ở dưới cùng của container, che phần dưới của iframe */}
          <div style={{
            position: 'absolute',
            bottom: '0px',
            width: '100%',
            height: '70px', // Thiết lập chiều cao cho overlay
            backgroundColor: 'rgba(0, 0, 0)', // Thiết lập màu nền và độ mờ cho overlay
            zIndex: 2, // Đảm bảo overlay nằm trên cùng
          }}>
          </div>
        </div>
      </div >
    );
  }
}

export default Page2;
