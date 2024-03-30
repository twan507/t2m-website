'use client'
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from 'react';
import CountUp from 'react-countup';
import { Col, DatePicker, Row, Space, Statistic } from 'antd';
import moment, { Moment } from 'moment';


export default function AdminDashboard() {

  const authInfo = useAppSelector((state) => state.auth)
  const authState = !!authInfo?.user?._id

  const router = useRouter()

  useEffect(() => {
    if (!authState || authInfo.user.role !== "T2M ADMIN") {
      router.push("/admin");
    }
  }, [authState, router]);

  const formatter: any = (value: number) => <CountUp end={value} separator="," />;

  const data = [
    { id: 1, name: 'Item 1', date: '2024-03-29T03:27:13.372+00:00' },
    { id: 2, name: 'Item 2', date: '2024-03-30T03:27:13.372+00:00' },
  ];

  const [filteredData, setFilteredData] = useState(data);

  const handleDateChange = (dates: any) => {
    if (dates) {
      const [start, end] = dates;
      // Chuyển đổi ngày bắt đầu và kết thúc sang đầu và cuối ngày theo UTC
      const startDate = new Date(start.toISOString());
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(end.toISOString());
      endDate.setUTCHours(23, 59, 59, 999);

      const filtered = data.filter(item => {
        const itemDate = new Date(item.date);
        // So sánh ngày (đã chuyển đổi sang UTC)
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredData(filtered);
    } else {
      // Nếu không có ngày nào được chọn, hiển thị tất cả dữ liệu
      setFilteredData(data);
    }
  };


  const [checkAuth, setCheckAuth] = useState(true);
  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Active Users" value={112893} formatter={formatter} />
          </Col>
          <Col span={12}>
            <Statistic title="Account Balance (CNY)" value={112893} precision={2} formatter={formatter} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Space direction="vertical" size={12}>
            <DatePicker.RangePicker onChange={handleDateChange} />
            <ul>
              {filteredData.map(item => (
                <li key={item.id}>{item.name} - {moment(item.date).format('YYYY-MM-DD HH:mm:ss')}</li>
              ))}
            </ul>
          </Space>
        </Row>
      </>
    )
  }
}
