'use client'
import React, { useEffect, useState } from 'react';

const Page1 = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  const [iframeHeight, setIframeHeight] = useState(3890);
  const iframeWidth = 1300

  const updateIframeSize = () => {

    const currentWidth = window.innerWidth;
    let newHeight = iframeHeight;

    if (currentWidth < iframeWidth) {
      const widthDecrease = iframeWidth - currentWidth;
      newHeight -= widthDecrease * (iframeHeight / iframeWidth - 0.1);
    }

    setIframeHeight(newHeight);
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 3000);

    window.addEventListener('resize', updateIframeSize);
    updateIframeSize();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIframeSize);
    };
  }, []);

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
          src="https://app.powerbi.com/view?r=eyJrIjoiNGY5ZTBjNjctMmI5OC00MjU2LThkZjYtMGZlMTQzODIzNTRmIiwidCI6IjUxZmUxNTRlLThlNTYtNGM2NC05ZDM5LTU2NTc0ZDk3MmU1YyIsImMiOjEwfQ%3D%3D"
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
};

export default Page1;
