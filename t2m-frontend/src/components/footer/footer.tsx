import React from 'react';
import './footer.css';

const FooterComponent = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">

                <div className="footer-section-left">
                    <a href="index.html">
                        <img src="photo/slogo.png" alt="T2M Logo" className="footer-logo" />
                    </a>
                    <div className="footer-links">

                    </div>
                </div>

                <div className="footer-section-right" id="fs1">
                    <p className="footer-title">Sản phẩm</p>
                    <ul>
                        <li><a href="https://t.me/+U3k02NxS8ygwMGE1">Phân tích dòng tiền</a></li>
                        <li><a href="https://t.me/+U3k02NxS8ygwMGE1">Phân tích nhóm ngành</a></li>
                        <li><a href="https://t.me/+U3k02NxS8ygwMGE1">Bộ lọc chuyên sâu</a></li>
                        <li><a href="https://t.me/+U3k02NxS8ygwMGE1">Danh mục đầu tư T2M</a></li>
                    </ul>
                </div>

                <div className="footer-section-right" id="fs2">
                    <p className="footer-title">T2M Learning</p>
                    <ul>
                        <li><a href="https://t.me/+U3k02NxS8ygwMGE1">Hướng dẫn sử dụng</a></li>
                        <li><a href="https://t.me/+U3k02NxS8ygwMGE1">Kiến thức đầu tư</a></li>
                        <li><a href="https://t.me/+U3k02NxS8ygwMGE1">Phân tích kĩ thuật</a></li>
                        <li><a href="https://t.me/+U3k02NxS8ygwMGE1">Đầu tư chuyên nghiệp</a></li>
                    </ul>
                </div>

                <div className="footer-section-right" id="fs3">
                    <p className="footer-title">Tham gia cùng T2M Invest</p>
                    <div className="social-qr">
                        <div>
                            <a href="https://www.facebook.com/t2m.invest"><img src="photo/fb_qr.png" alt="T2M Logo" /></a>
                            <a className="qr-description" id="qr_1" href="https://www.facebook.com/t2m.invest">Facebook</a>
                            <br />
                            <a className="qr-description" id="qr_2" href="https://www.facebook.com/t2m.invest">Fanpage T2M Invest</a>
                        </div>
                        <div>
                            <a href="https://t.me/+U3k02NxS8ygwMGE1"><img src="photo/tele_qr.png" alt="T2M Logo" /></a>
                            <a className="qr-description" id="qr_3" href="https://www.facebook.com/t2m.invest">Telegram</a>
                            <br />
                            <a className="qr-description" id="qr_4" href="https://www.facebook.com/t2m.invest">Hội viên T2M Invest</a>
                        </div>
                        <div>
                            <a href="https://zalo.me/g/fggvuq311"><img src="photo/zalo_qr.png" alt="T2M Logo" /></a>
                            <a className="qr-description" id="qr_5" href="https://zalo.me/g/fggvuq311">Zalo</a>
                            <br />
                            <a className="qr-description" id="qr_6" href="https://zalo.me/g/fggvuq311">(+84) 368 075 410</a>
                        </div>
                    </div>

                </div>

            </div>
            <div className="footer-bottom">
                <p>© 2023 T2M Invest | <a href="/terms">Điều khoản sử dụng</a></p>
            </div>
        </footer>
    );
}

export default FooterComponent;
