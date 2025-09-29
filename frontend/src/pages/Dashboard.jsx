import React, { useEffect } from 'react';
import { Button, Flex, Layout, Menu, Modal, Space } from 'antd';
import { LogoutOutlined, MessageOutlined, OrderedListOutlined, TeamOutlined } from '@ant-design/icons';
import Employees from '../components/Dashboard/Employees';
import Tasks from '../components/Dashboard/Tasks';
import Chat from '../components/Dashboard/Chat';
import { Link, useNavigate, useSearchParams } from 'react-router';
import ProfileForm from '../components/User/ProfileForm';
const { Header, Sider, Content } = Layout;

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  padding: '20px',
};
const siderStyle = {
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
  height: 'calc(100% - 64px)',
};
const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
};

const App = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const role = React.useMemo(() => localStorage.getItem('role'));
  const user = React.useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const [contentItems, setContentItems] = React.useState([
    { key: 'employees', label: 'Employees', component: <Employees />, hidden: role !== 'owner' },
    { key: 'tasks', label: 'Tasks', component: <Tasks /> },
    { key: 'chat', label: 'Chat', component: <Chat /> },
  ]);
  const navigate = useNavigate();
  const [currentContent, setCurrentContent] = React.useState();
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user]);

  const menuItems = [
    {
      key: 'employees',
      label: 'Employees',
      icon: <TeamOutlined />,
      hidden: role !== 'owner',
    },
    {
      key: 'tasks',
      label: 'Tasks',
      icon: <OrderedListOutlined />
    },
    {
      key: 'chat',
      label: 'Chat',
      icon: <MessageOutlined />
    },
  ];
  
  React.useEffect(() => {
    const items = contentItems.filter(i => !i.hidden);
    setContentItems(items)
  }, [])

  React.useEffect(() => {
    if (role === 'employee') {
      setCurrentContent(contentItems.filter(item => !item.hidden).find(item => item.key === 'tasks'));
    }
  }, [role]);

  React.useEffect(() => {
    if(!tab && role === 'owner') {
      setSearchParams({ tab: 'employees' });
      setCurrentContent(contentItems.find(item => item.key === 'employees'));
      return;
    } else if(!tab && role === 'employee') {
      setSearchParams({ tab: 'tasks' });
      setCurrentContent(contentItems.find(item => item.key === 'tasks'));
      return;
    }
    
    setCurrentContent(contentItems.find(item => item.key === tab));
  }, [tab]);

  const onMenuClick = e => {
    setSearchParams({ tab: e.key });
  };

  const handleSignOut = () => {
    localStorage.clear()
    navigate('/auth');
  };

  return (
    <>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Flex justify="space-between">
            <Link style={{ color: 'white', fontWeight: 'bold' }} to="/">{role?.toString().toUpperCase()}</Link>
            <Space>
              <Button type="text" onClick={() => setIsProfileModalOpen(true)}>{`${user?.firstName} ${user?.lastName}`}</Button>
              <Button style={{ color: 'white' }} type="text" icon={<LogoutOutlined />} onClick={handleSignOut}>Sign Out</Button>
            </Space>
          </Flex>
        </Header>

        <Layout>
          <Sider width="20%" style={siderStyle}>
            <Menu
              onClick={onMenuClick}
              defaultSelectedKeys={[currentContent?.key]}
              defaultOpenKeys={tab ? [tab] : []}
              mode="inline"
              items={menuItems.filter(item => !item.hidden)}
              style={{ height: '100vh' }}
            />
          </Sider>
          <Content style={contentStyle}>{currentContent?.component}</Content>
        </Layout>
      </Layout>
      <Modal title={`Profile of ${user?.firstName} ${user?.lastName}`} open={isProfileModalOpen} onCancel={() => setIsProfileModalOpen(false)} footer={null}>
        <ProfileForm user={user} />
      </Modal>
    </>
  )
};
export default App;