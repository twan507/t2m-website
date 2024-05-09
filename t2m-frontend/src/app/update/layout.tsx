'use client'
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
  UserOutlined,
  FundViewOutlined,
  SearchOutlined,
  LineChartOutlined,
  BarChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, notification } from 'antd';
import { useRouter } from 'next/navigation';
import AuthSignInModal from '@/components/auth/signin.modal';
import AuthSignUpModal from '@/components/auth/signup.modal';
import UserInfoModal from '@/components/auth/userinfo.modal';
import FooterComponent from '@/components/footer/footer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { signOut } from '@/utlis/signOut';
import { resetAuthState } from '@/redux/authSlice';
import { sessionLimit } from '@/utlis/sessionLimit';

const { Header, Footer, Content } = Layout;

function getAvatarName(name: string) {
  const words = name?.split(' ').filter(Boolean);
  if (words) {
    if (words.length === 0) return '';

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    const firstInitial = words[0][0];
    const lastInitial = words[words.length - 1][0];
    return (firstInitial + lastInitial).toUpperCase();
  }
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getUserName(name: string) {
  const words = name?.split(' ').filter(Boolean).map(capitalizeFirstLetter);

  if (words) {
    if (words.length === 0) return '';
    if (words.length === 1) return words[0];
    if (words.length > 4) {
      // Bỏ từ thứ hai và lấy 3 từ còn lại
      return `${words[0]} ${words[2]} ${words[3]}`;
    }
    // Trường hợp còn lại, trả về tên đầy đủ
    return words.join(' ');
  }

}

const Homelayout = ({ children }: React.PropsWithChildren) => {

  const [isAutoReloadEnabled, setIsAutoReloadEnabled] = useState(true); // State to track switch
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(() => {
        if (isAutoReloadEnabled) {
          window.location.reload();
        }
      }, 120000);  // 60000 ms = 1 minute
    };

    // Immediately reset timeout to start the timeout process
    resetTimeout();

    // Setup event listeners to reset the timeout on user activity
    const handleUserActivity = () => resetTimeout();
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    // Cleanup on component unmount
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [isAutoReloadEnabled]);

  const handleAutoReloadChange = (checked: boolean) => {
    setIsAutoReloadEnabled(checked);
  };

  //@ts-ignore
  const [path, setPath] = useState(children.props.childProp.segment === "__PAGE__" ? "tong-quan-thi-truong" : children.props.childProp.segment)

  const { Sider } = Layout;

  const router = useRouter()

  const [collapsed, setCollapsed] = useState(true);

  const [limitState, setLimitState] = useState(false);
  const authInfo = useAppSelector((state) => state.auth)
  useEffect(() => {
    (async () => {
      const limitState = await sessionLimit(authInfo?.user?.email, authInfo?.access_token);
      if (!limitState) { dispatch(resetAuthState()) }
      setLimitState(limitState);
    })()
  }, [authInfo?.user?.email, authInfo?.access_token]);
  const authState = !!authInfo?.user?._id && limitState

  const dispatch = useAppDispatch();

  const showLogout = authState ? true : false

  const [isSignInModalOpen, setSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false)
  const [isUserInfoModal, setUserInfoModalOpen] = useState(false)
  const [mobileLayout, setmMobileLayout] = useState(false);

  const toggleMobileLayout = () => {
    const currentWidth = window.innerWidth;
    if (currentWidth > 800) {
      setmMobileLayout(false)
    } else {
      setmMobileLayout(true)
    }
  };

  useEffect(() => {
    window.addEventListener('resize', toggleMobileLayout);
    toggleMobileLayout();

    return () => {
      window.removeEventListener('resize', toggleMobileLayout);
    };
  }, [path]);

  const handleSelect = ({ key }: { key: string }) => {
    if (key === path) {
      window.location.reload()
    } else if (key === 'tong-quan-thi-truong') {
      router.push('/update/tong-quan-thi-truong')
      setPath(key)
    } else {
      if (authState) {
        router.push(`/update/${key}`)
        setPath(key)
      } else {
        setSignInModalOpen(true)
        notification.warning({
          message: "Không có quyền truy cập",
          description: "Bạn cần đăng nhập để xem nội dung này"
        })
      }
    }
  }

  const sider_menu = [
    {
      label: (
        <Link href="/update/tong-quan-thi-truong" onClick={(e) => { e.preventDefault() }}>
          Tổng quan thị trường
        </Link>
      ),
      key: 'tong-quan-thi-truong',
      icon: <AppstoreOutlined style={{ fontSize: '20px', marginLeft: '-1px' }} />
    },
    {
      label: (
        <Link href="/update/dong-tien-thi-truong" onClick={(e) => { e.preventDefault() }} >
          Dòng tiền thị trường
        </Link>
      ),
      key: 'dong-tien-thi-truong',
      icon: <FundViewOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <Link href="/update/tra-cuu-nhom-co-phieu" onClick={(e) => { e.preventDefault() }} >
          Tra cứu nhóm cổ phiếu
        </Link>
      ),
      key: 'tra-cuu-nhom-co-phieu',
      icon: <BarChartOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <Link href="/update/tra-cuu-co-phieu" onClick={(e) => { e.preventDefault() }} >
          Tra cứu cổ phiếu
        </Link>
      ),
      key: 'tra-cuu-co-phieu',
      icon: <LineChartOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <Link href="/update/bo-loc-co-phieu" onClick={(e) => { e.preventDefault() }} >
          Bộ lọc cổ phiếu
        </Link>
      ),
      key: 'bo-loc-co-phieu',
      icon: <SearchOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    }
  ]

  const [checkAuth, setCheckAuth] = useState(true);

  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <>
        <AuthSignInModal
          isSignInModalOpen={isSignInModalOpen}
          setSignInModalOpen={setSignInModalOpen}
        />
        <AuthSignUpModal
          isSignUpModalOpen={isSignUpModalOpen}
          setSignUpModalOpen={setSignUpModalOpen}
        />
        <UserInfoModal
          isUserInfoModal={isUserInfoModal}
          setUserInfoModalOpen={setUserInfoModalOpen}
        />
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed}
            collapsedWidth={mobileLayout ? '0px' : '55px'}
            width='215px'
            style={{
              background: '#000000',
              borderRight: '2px solid #303030',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'sticky',
              top: 0,
              zIndex: 101
            }}>
            <Button
              type="text"
              onClick={() => {
                authState ? setUserInfoModalOpen(true) : setSignInModalOpen(true)
              }}
              block={true}
              style={{
                marginTop: '10px',
                height: "50px",
                color: '#dfdfdf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'middle'
              }}
            >
              <Avatar
                icon={authState ? null : <UserOutlined />}
                style={{ backgroundColor: authState ? '#7265e6' : '#404040', marginLeft: '-8px', marginRight: '10px', marginBottom: '5px', minWidth: '36px', height: '36px', paddingTop: '2px' }}
              >
                {authState ? getAvatarName(authInfo.user.name) : ''}
              </Avatar>
              {!collapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginTop: authState ? '-4px' : '3px', marginLeft: authState ? '0px' : '12px' }}>
                  <div style={{ fontSize: 15, marginTop: -5 }}>{collapsed ? '' : (authState ? getUserName(authInfo.user.name) : 'Đăng nhập')}</div>
                  {authState && (
                    <div style={{ display: 'flex', marginTop: -3 }} >
                      <div style={{
                        fontSize: 12, marginTop: 4, padding: '0px 5px 0px 5px',
                        background:
                          authInfo.user.role === "T2M ADMIN" ? '#98217c' : (
                            !authInfo.user.licenseInfo?.accessLevel ? '#404040' : (
                              authInfo.user.licenseInfo?.accessLevel === 1 ? '#1E7607' : (
                                authInfo.user.licenseInfo?.accessLevel === 2 ? '#1777ff' : (
                                  authInfo.user.licenseInfo?.accessLevel === 3 ? '#642198' : '#98217c'
                                )))),
                        borderRadius: 5, width: 'fit-content'
                      }}
                      >
                        {collapsed ? null : authInfo.user.role === "T2M ADMIN" ? "ADMIN" : authInfo.user.licenseInfo?.product ?? 'FREE'}
                      </div>
                      {(authInfo.user.licenseInfo?.daysLeft && authInfo.user.licenseInfo?.daysLeft < 370) && (
                        //@ts-ignore
                        <div style={{ fontSize: 12, marginTop: 4, marginLeft: '5px', padding: '0px 5px 0px 5px', background: '#A20D0D', borderRadius: 5, width: 'fit-content' }}>
                          {collapsed ? null : `${authInfo.user.licenseInfo?.daysLeft} days`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Button>
            <Button
              type="text"
              icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              block={true}
              style={{
                fontSize: '16px',
                height: "50px",
                color: '#dfdfdf',
              }}
            />
            <Menu
              style={{ background: '#000000' }}
              theme="dark"
              mode="inline"
              selectedKeys={[path]}
              onClick={handleSelect}
              items={sider_menu}
            />
            <div style={{
              marginTop: `calc(100vh - 150px - ${5 * 55}px`
            }}
            >
              {showLogout && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                  <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={async () => {
                      dispatch(resetAuthState())
                      signOut(authInfo.access_token)
                    }}
                    style={{
                      fontSize: '14px',
                      height: "50px",
                      color: '#dfdfdf',
                      marginLeft: collapsed ? '11px' : '40px',
                    }}
                  >
                    {collapsed ? '' : 'Đăng xuất'}
                  </Button>
                  <Button
                    icon={<ReloadOutlined style={{}} />}
                    onClick={() => { isAutoReloadEnabled ? handleAutoReloadChange(false) : handleAutoReloadChange(true) }}
                    style={{
                      fontSize: '14px',
                      height: "30px",
                      color: '#dfdfdf',
                      marginLeft: collapsed ? '11px' : '40px',
                      border: '0px',
                      background: isAutoReloadEnabled ? '#1677ff' : '#fb4c4d'
                    }}
                  >
                    {collapsed ? '' : 'Auto reload'}
                  </Button>
                </div>
              )}
            </div>
          </Sider>
          <Layout style={{ background: '#000000' }}>
            <Header style={{
              margin: '0px', padding: '0px', height: '60px',
              position: 'sticky', background: '#000000', borderBottom: '2px solid #303030',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              top: 0,
              zIndex: 101
            }}>
              <Menu
                style={{
                  background: '#000000',
                  height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: mobileLayout ? '100%' : '1300px'
                  // borderBottom: '2px solid #303030',
                }}
                theme='dark'
                mode="horizontal"
                selectedKeys={[]}
                items={[
                  // Kiểm tra điều kiện mobileLayout ngay ở đầu để quyết định phần tử hiển thị
                  ...(mobileLayout ? [
                    {
                      label: <Button ghost
                        icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '20px', padding: '0px', margin: '0px' }} /> : <MenuFoldOutlined style={{ fontSize: '20px', padding: '0px', margin: '0px' }} />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ border: '0px', padding: '0px', margin: '0px' }}
                      />,
                      key: 'home-mobile', // Sử dụng một key khác biệt cho mobile layout
                    },
                    {
                      label: collapsed ? <Link onClick={() => { window.location.href = "/" }} href='/' /> : null,
                      key: 'home',
                      icon: collapsed ? <img src="/photo/text-logo.png" alt="Home Icon" style={{ width: '120px', height: '65px', paddingTop: '40px', marginBottom: '16px' }} /> : null
                    }
                  ] : [
                    {
                      label: <Link onClick={() => { window.location.href = "/" }} href='/' />,
                      key: 'home',
                      icon: <img src="/photo/header-logo.png" alt="Home Icon" style={{ width: '160px', height: 'auto', paddingTop: '25px', marginLeft: '10px' }} />
                    }]),
                  ...(!authState ? [
                    {
                      label: mobileLayout && !collapsed ? null :
                        <Button ghost type='primary' onClick={() => setSignInModalOpen(true)}
                          icon={mobileLayout ? <UserOutlined /> : null}
                          style={{
                            width: mobileLayout ? '40px' : '120px',
                            marginLeft: mobileLayout ? 'calc(100vw - 360px)' : '790px',
                            fontWeight: 'bold',
                            fontFamily: 'Helvetica Neue, sans-serif'
                          }}>
                          {mobileLayout ? "" : "Đăng nhập"}
                        </Button>,
                      key: 'signin',
                    },
                    {
                      label: mobileLayout && !collapsed ? null :
                        <Button type='primary' onClick={() => setSignUpModalOpen(true)}
                          icon={mobileLayout ? <UsergroupAddOutlined /> : null}
                          style={{
                            width: mobileLayout ? '40px' : '120px',
                            marginLeft: '-20px',
                            fontWeight: 'bold',
                            fontFamily: 'Helvetica Neue, sans-serif'
                          }}>
                          {mobileLayout ? "" : "Đăng ký"}
                        </Button>,
                      key: 'signup',
                    }
                  ] : []),
                ]}
              />
            </Header>
            <Content>
              {children}
            </Content>
            <FooterComponent />
          </Layout>
        </Layout >
      </>
    )
  }
}

export default Homelayout;