'use client'
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from 'react';
import CountUp from 'react-countup';
import { Col, DatePicker, Row, Space, Statistic } from 'antd';
import moment, { Moment } from 'moment';
import { sendRequest } from "@/utlis/api";
import * as dfd from "danfojs";
import LineChart from "./components/revenue";



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

  console.log(listOrders)

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

      const filteredOrders = listUsers.filter((item: any) => {
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
  useEffect(() => {
    const total = filteredOrders.reduce((sum, item: any) => {
      return sum + item.price;
    }, 0);

    setRevenue(total)
  }, [filteredOrders])

  const [checkAuth, setCheckAuth] = useState(true);
  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <>
        <Row gutter={16}>
          <DatePicker.RangePicker onChange={handleDateChange} />
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Số Users" value={filteredUsers.length} formatter={formatter} />
          </Col>
          <Col span={8}>
            <Statistic title="Số đơn hàng" value={filteredOrders.length} formatter={formatter} />
          </Col>
          <Col span={8}>
            <Statistic title="Doanh thu" value={revenue} formatter={formatter} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <ul>
              {filteredUsers.map(item => (
                //@ts-ignore
                <li key={item._id}>{item.name} - {moment(item.createdAt).format('YYYY-MM-DD')}</li>
              ))}
            </ul>
          </Col>
          <Col span={12}>
            <ul>
              {filteredOrders.map(item => (
                //@ts-ignore
                <li key={item._id}>{item.name} - {moment(item.createdAt).format('YYYY-MM-DD')}</li>
              ))}
            </ul>
            <LineChart data={filteredOrders} />
          </Col>
        </Row>
      </>
    )
  }
}
