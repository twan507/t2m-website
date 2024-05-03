import React from 'react';
import { Row, Col, Card } from 'antd';

const TermsAndConditions = () => (
    <Row
        justify="center"
        align="top"
        style={{
            backgroundColor: 'black',
            margin: 0,
            padding: 0
        }}
    >
        <Col
            xs={22} sm={20} md={16} lg={12} xl={10}
            style={{
                maxWidth: '100%', // Ensures the Col does not exceed the width of its content
            }}
        >
            <Card
                style={{
                    backgroundColor: '#191919',
                    color: '#dfdfdf',
                    borderRadius: '10px',
                    border: 'none',
                    marginTop: '30px',
                    marginBottom: '30px'
                }}
                bodyStyle={{
                    padding: '20px',
                }}
            >
                <h1 style={{ textAlign: 'center', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0px' }}>
                    ĐIỀU KHOẢN SỬ DỤNG
                </h1>
                <h2 style={{ textAlign: 'center', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px' }}>
                    (Terms and Conditions)
                </h2>
                <h3 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '18px' }}>
                    Quy định sử dụng
                </h3>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    “Website” là trang web <a href="/">www.t2m.vn</a>, bao gồm cả các trang liên kết đối với các sản phẩm và dịch vụ của T2M Invest.                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Tất cả các thông tin, sản phẩm, dịch vụ trên Website bao gồm nhưng không giới hạn mọi hình thức thiết kế, nội dung, âm thanh và hình ảnh đều thuộc quyền sở hữu của T2M Invest, trừ trường hợp do chính T2M Invest công bố khác đi, và được bảo vệ bởi luật bản quyền Việt Nam.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    T2M Invest nghiêm cấm mọi hình thức sử dụng không được phép đối với Website, bao gồm việc lạm dụng, ăn cắp bản quyền, sử dụng sai ý nghĩa của bất cứ sản phẩm nào đưa trên Website và các quy định về tính bảo mật mà không có sự đồng ý bằng văn bản của T2M Invest.
                </p>
                <h3 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '18px' }}>
                    Miễn trừ trách nhiệm
                </h3>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Các thông tin trên Website được cung cấp với mức độ tin cậy cao nhất nhưng chỉ dành cho mục đích tham khảo thông tin. T2M Invest không chịu trách nhiệm đảm bảo cho sự hoàn thiện, tính cập nhật hoặc tính chính xác hoặc độ sẵn sàng liên tục của thông tin cũng như các thiệt hại, mất mát do việc sử dụng Website gây ra.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Khách hàng cần nhận thức rõ ràng rằng đầu tư chứng khoán đi kèm với rủi ro và có thể dẫn đến mất mát vốn đầu tư. T2M Invest không chịu trách nhiệm cho những mất mát có thể xảy ra từ các quyết định đầu tư của khách hàng.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Các sản phẩm phân tích từ T2M Invset không nên được hiểu là khuyến nghị đầu tư cụ thể nào. Khách hàng nên tìm kiếm sự tư vấn từ các chuyên gia tài chính độc lập trước khi thực hiện bất kỳ quyết định đầu tư nào.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Website này chỉ phục vụ mục đích cung cấp thông tin, không liên quan đến các mục tiêu đầu tư cá nhân, khuyến nghị đầu tư, không nhằm mục đích định hướng hay khuyến nghị bất cứ quyết định đầu tư nào của khách hàng.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    T2M Invest không chịu trách nhiệm đối với những thay đổi không lường trước được trong điều kiện thị trường, chính trị, kinh tế hoặc các yếu tố khác có thể ảnh hưởng việc sử dụng hiệu quả của những thông được cung cấp trên Website.
                </p>
            </Card>
        </Col>
    </Row>
);

export default TermsAndConditions;
