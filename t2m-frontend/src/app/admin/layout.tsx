'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
  UserOutlined,
  FileDoneOutlined,
  ProductOutlined,
  FallOutlined,
  FundViewOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, notification } from 'antd';
import { useRouter } from 'next/navigation';
import AuthSignInModal from '@/components/auth/signin.modal';
import AuthSignUpModal from '@/components/auth/signup.modal';
import UserInfoModal from '@/components/auth/userinfo.modal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { signOut } from '@/utlis/signOut';
import { resetAuthState } from '@/redux/authSlice';

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

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  const { Sider } = Layout;

  //@ts-ignore
  const [path, setPath] = useState(children.props.childProp.segment === "__PAGE__" ? "dashboard" : children.props.childProp.segment)

  const [collapsed, setCollapsed] = useState(true);

  const router = useRouter()

  const authInfo = useAppSelector((state) => state.auth)
  const authState = !!authInfo?.user?._id
  const dispatch = useAppDispatch();

  const showLogout = authState ? true : false

  const [isSignInModalOpen, setSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false)
  const [isUserInfoModal, setUserInfoModalOpen] = useState(false)

  const handleSelect = ({ key }: { key: string }) => {
    if (key === path) {
      window.location.reload()
    } else {
      if (authState) {
        router.push(`/admin/${key}`)
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
        <Link href="/admin/dashboard" onClick={(e) => { e.preventDefault() }}>
          Dashboard
        </Link>
      ),
      key: 'dashboard',
      icon: <FundViewOutlined style={{ fontSize: '20px', marginLeft: '-1px' }} />
    },
    {
      label: (
        <Link href="/admin/users" onClick={(e) => { e.preventDefault() }}>
          Users
        </Link>
      ),
      key: 'users',
      icon: <UserOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <Link href="/admin/products" onClick={(e) => { e.preventDefault() }}>
          Products
        </Link>
      ),
      key: 'products',
      icon: <ProductOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <Link href="/admin/discountcodes" onClick={(e) => { e.preventDefault() }}>
          Discount Codes
        </Link>
      ),
      key: 'discountcodes',
      icon: <FallOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />
    },
    {
      label: (
        <Link href="/admin/licenses" onClick={(e) => { e.preventDefault() }}>
          Licenses
        </Link>
      ),
      key: 'licenses',
      icon: <FileDoneOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <Link href="/admin/orders" onClick={(e) => { e.preventDefault() }}>
          Orders
        </Link>
      ),
      key: 'orders',
      icon: <ShoppingCartOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />
    },
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
          <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth='55px' width='200px'
            style={{
              background: '#0a0a0a',
              borderRight: '2px solid #303030',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'sticky',
              top: 0,
              zIndex: 100
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
                  <div style={{ fontSize: 14, marginTop: -5 }}>{collapsed ? '' : (authState ? getUserName(authInfo.user.name) : 'Đăng nhập')}</div>
                  {authState && (
                    <div style={{ display: 'flex', marginTop: -3 }} >
                      <div style={{
                        fontSize: 12, marginTop: 2, padding: '0px 5px 0px 5px',
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
                      {authInfo.user.licenseInfo?.daysLeft && (
                        //@ts-ignore
                        <div style={{ fontSize: 12, marginTop: 2, marginLeft: '5px', padding: '0px 5px 0px 5px', background: '#A20D0D', borderRadius: 5, width: 'fit-content' }}>{collapsed ? null : `${authInfo.user.licenseInfo?.daysLeft} days`}</div>
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
              style={{ background: '#0a0a0a' }}
              theme="dark"
              mode="inline"
              selectedKeys={[path]}
              onClick={handleSelect}
              items={sider_menu}
            />
            <div>
              {showLogout && (
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    window.location.href = '/admin';
                    signOut(authInfo.access_token)
                    dispatch(resetAuthState())
                  }}
                  style={{
                    fontSize: '14px',
                    height: "50px",
                    color: '#dfdfdf',
                    marginLeft: collapsed ? '8px' : '13px',
                    marginTop: `calc(100vh - 110px - ${6 * 55}px`
                  }}
                >
                  {collapsed ? '' : 'Đăng xuất'}
                </Button>
              )}
            </div>
          </Sider>
          <Layout style={{ background: '#0a0a0a' }}>
            <Header style={{
              margin: '0px', padding: '0px', height: '60px',
              position: 'sticky', background: '#000000', borderBottom: '2px solid #303030',
              top: 0,
              zIndex: 101
            }}>
              <Menu
                style={{
                  background: '#0a0a0a',
                  height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                  borderBottom: '2px solid #303030',
                  position: 'sticky',
                  top: 0,
                  zIndex: 100
                }}
                theme='dark'
                mode="horizontal"
                selectedKeys={[]}
                items={[
                  {
                    label: <Link href='/' />,
                    key: 'home',
                    icon: <img src="/photo/header-logo.png" alt="Home Icon" style={{ width: '150px', height: 'auto', paddingTop: '25px', marginLeft: '10px' }} />
                  },
                  ...(!authState ? [
                    {
                      label: <Button ghost type='primary' onClick={() => setSignInModalOpen(true)}
                        style={{ width: '120px', marginLeft: collapsed ? 'calc(100vw - 570px)' : 'calc(100vw - 710px)', fontWeight: 'bold', fontFamily: 'Helvetica Neue, sans-serif' }}
                      >
                        Đăng nhập
                      </Button>,
                      key: 'signin',
                    },
                    {
                      label: <Button type='primary' onClick={() => setSignUpModalOpen(true)}
                        style={{ width: '120px', marginLeft: '-20px', fontWeight: 'bold', fontFamily: 'Helvetica Neue, sans-serif' }}
                      >
                        Đăng ký
                      </Button>,
                      key: 'signup',
                    }
                  ] : []),
                ]}
              />
            </Header>
            <Content
              style={{
                margin: '24px 24px 24px 24px',
                padding: '24px',
                backgroundColor: 'white',
                borderRadius: 10,
                minHeight: 'calc(100vh - 110px)'
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout >
      </>
    )
  }
}
export default AdminLayout;