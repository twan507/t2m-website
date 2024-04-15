'use client'
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from 'react';
import CountUp from 'react-countup';
import { Card, Col, DatePicker, Progress, ProgressProps, Row, Space, Statistic } from 'antd';
import moment, { Moment } from 'moment';
import { sendRequest } from "@/utlis/api";
import * as dfd from "danfojs";
import RevenueChart from "./components/revenue.chart";
import UsersChart from "./components/users.chart";
import OrdersChart from "./components/orders.chart";



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

  const formatterVND: any = (value: number) => {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'symbol'
    }).format(value);
    return formattedValue;
  };

  const [listUsers, setListUsers] = useState([])
  const [listOrders, setListOrders] = useState([])

  const getUsers = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/all`,
      method: "GET",
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
    })
    try { setListUsers(res.data) } catch (error) { }
  }

  const getOrders = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/all`,
      method: "GET",
      headers: { 'Authorization': `Bearer ${authInfo.access_token}` }
    })
    try { setListOrders(res.data) } catch (error) { }
  }

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    getUsers()
    getOrders()
  }, [authState])

  useEffect(() => {
    setFilteredUsers(listUsers)
    setFilteredOrders(listOrders)
  }, [listUsers, listOrders])


  const handleDateChange = (dates: any) => {
    if (dates) {
      const [start, end] = dates;
      // Chuyển đổi ngày bắt đầu và kết thúc sang đầu và cuối ngày theo UTC
      const startDate = new Date(start.toISOString());
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(end.toISOString());
      endDate.setUTCHours(23, 59, 59, 999);

      const filteredUsers = listUsers.filter((item: any) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startDate && itemDate <= endDate;
      });

      const filteredOrders = listOrders.filter((item: any) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startDate && itemDate <= endDate;
      });

      setFilteredUsers(filteredUsers);
      setFilteredOrders(filteredOrders);
    } else {
      setFilteredUsers(listUsers);
      setFilteredOrders(listOrders);
    }
  };

  const [revenue, setRevenue] = useState(0);
  const [paidUsers, setPaidUsers] = useState(0);
  useEffect(() => {
    const totalRevenue = filteredOrders?.reduce((sum, item: any) => {
      return sum + item.price;
    }, 0);
    setRevenue(totalRevenue)

    const totalPaidUsers = filteredOrders?.filter((item: any) => item.type === "Tạo mới").length;
    setPaidUsers(totalPaidUsers)

  }, [filteredOrders])

  const conicColors: ProgressProps['strokeColor'] = {
    '0%': '#faa',
    '50%': '#ffe58f',
    '100%': '#1E7607',
  };

  const [checkAuth, setCheckAuth] = useState(true);
  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <>
        <Row>
          <Col span={19}>
            <h1>Thống kê hiệu quả hoạt động</h1>
          </Col>
          <Col span={5}>
            <Card hoverable style={{ width: "100%" }}>
              <DatePicker.RangePicker onChange={handleDateChange} style={{ width: "100%" }} />
            </Card>
          </Col>
        </Row >
        <Row gutter={20} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <Row gutter={20} style={{ marginBottom: '20px' }}>
              <Col span={12}>
                <Card title="Tổng số Users" hoverable style={{}}>
                  <Statistic value={filteredUsers?.length} formatter={formatter} />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Số Users trả tiền" hoverable style={{}}>
                  <Statistic value={paidUsers} formatter={formatter} />
                </Card>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Card title="Tỉ lệ User trả tiền" hoverable style={{ height: '153px' }}>
                  <Progress percent={Math.round(paidUsers * 100 / filteredUsers?.length)} strokeColor={conicColors} />
                </Card>
              </Col>
            </Row>
            <Row>
              <Card title="Tăng trưởng Users" hoverable style={{ width: "100%" }}>
                <UsersChart width="100%" height="210px" data={filteredUsers} />
              </Card>
            </Row>
          </Col>
          <Col span={12}>
            <Row style={{ marginBottom: '20px' }}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                    <span style={{ marginRight: '10px' }}>Tổng số đơn hàng</span>
                    <Statistic
                      value={filteredOrders?.length}
                      formatter={formatter}
                    />
                  </div>
                }
                hoverable
                style={{ width: "100%" }}
              >
                <OrdersChart width="100%" height="210px" data={filteredOrders} />
              </Card>
            </Row>
            <Row>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                    <span style={{ marginRight: '10px' }}>Doanh số bán hàng</span>
                    <Statistic
                      value={revenue}
                      formatter={formatterVND}
                    />
                  </div>
                }
                hoverable
                style={{ width: "100%" }}
              >
                <RevenueChart width="100%" height="210px" data={filteredOrders} />
              </Card>
            </Row>
          </Col >
        </Row >
      </>
    )
  }
}
