import React, { useEffect } from 'react';
import { Layout, List, Avatar, Typography, Form, Input, Button, Flex } from 'antd';
import moment from 'moment';
import socket from '../../services/socketService';
import { getMessages } from '../../services/chatService';
import { useSearchParams } from 'react-router';
import { getEmployees } from '../../services/employeeService';

const { Sider, Content } = Layout;
const { Text } = Typography;

const contentStyle = {
  textAlign: 'center',
  height: '90%',
  width: '100%',
  backgroundColor: '#fff',
  padding: 16,
};
const subContentStyle = {
  width: '100%',
  backgroundColor: '#fff',
  padding: 16,
  borderTop: '1px solid #ccc',
};
const siderStyle = {
  height: '100%',
  backgroundColor: '#fff',
  borderRight: '1px solid #ccc',
  padding: 16,
};
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  height: 700,
  width: '100%',
  border: '1px solid #ccc',
};

const Chat = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const to = searchParams.get('to');
  const [listChat, setListChat] = React.useState([]);
  const [form] = Form.useForm();
  const [currentChat, setCurrentChat] = React.useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');

  const [messages, setMessages] = React.useState([]);

  const scrollToItem = (itemId) => {
    const element = document.getElementById(itemId);

    if (element) {
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchListChats();
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on(user.id, (data) => {
      console.log("Received message", data);
      if (role === 'owner') {
        if (data.to === to) {
          messages.push(data);
          setMessages([...messages]);
        }
      } else {
        if (data.from === to) {
          messages.push(data);
          setMessages([...messages]);
        }
      }
    });
  }, [user.id, messages]);

  useEffect(() => {
    if (currentChat) {
      fetchMessages();
      setSearchParams({ tab: 'chat', to: currentChat?.to });
    }
  }, [currentChat]);

  const fetchMessages = async () => {
    try {
      const response = await getMessages(currentChat?.chatId ?? '');
      const sortedMessages = response?.data?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(sortedMessages ?? []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const lastItem = messages[messages.length - 1];
    scrollToItem(lastItem?.id);
  }, [messages]);

  const fetchListChats = async () => {
    try {
      if (role === 'owner') {
        const response = await getEmployees();
        const chats = response?.data.map(item => ({
          to: item.id,
          from: user.id,
          title: `${item.firstName} ${item.lastName}`,
          chatId: item.chatId
        }));
        setListChat(chats);
        setCurrentChat(chats[0]);
      } else {
        const chats = [{ to: user.ownerId, from: user.id, title: 'Owner', chatId: `${user.ownerId}-${user.id}` }];
        setListChat(chats);
        setCurrentChat(chats[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onFinish = (values) => {
    const newMessage = {
      id: `message-${messages.length + 1}`,
      content: values.message,
      from: currentChat?.from,
      to: currentChat?.to,
      createdAt: new Date().toISOString(),
      chatId: currentChat?.chatId,
    }
    messages.push(newMessage);
    setMessages([...messages]);
    form.resetFields();

    socket.emit('message', newMessage);
    socket.emit(currentChat?.to, newMessage);
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <Layout style={layoutStyle}>
      <Layout>
        <Sider width="30%" style={siderStyle}>
          <List
            itemLayout="horizontal"
            dataSource={listChat}
            renderItem={(item, index) => (
              <List.Item key={index}
                style={{ cursor: 'pointer', backgroundColor: currentChat?.to === item.to ? '#f0f0f0' : '' }}
                onClick={() => { setCurrentChat(item) }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={`${item.title}`}
                  description={
                    <Text
                      style={{ width: 200 }}
                      ellipsis={{}}
                    >
                      {item.lastMessage}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Sider>
        <Layout>
          <Content style={subContentStyle}>
            <Text>Chat with {currentChat?.firstName} {currentChat?.lastName}</Text>
          </Content>
          <Content style={contentStyle}>
            <List
              itemLayout="vertical"
              style={{ height: '100%', overflowY: 'auto' }}
              dataSource={messages}
              split={false}
              renderItem={(item, index) => (
                <List.Item
                  key={item?.id}
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: item.from === user.id ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    id={item?.id}
                    key={item?.id}
                    style={{
                      maxWidth: '80%',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '8px',
                      backgroundColor: item.from === user.id ? '#1890ff' : '#f5f5f5',
                    }}
                  >
                    <Text style={{ color: item.from === user.id ? '#fff' : '#000' }}>
                      {item.content}
                    </Text>
                    <Text
                      style={{
                        textAlign: item.from === user.id ? 'right' : 'left',
                        fontSize: '8px',
                        color: item.from === user.id ? '#fff' : '#000'
                      }}
                    >{moment(item.createdAt).format('HH:mm:ss')}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Content>
          <Content style={subContentStyle}>
            <Form
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="inline"
              style={{ width: '100%' }}
              autoComplete="off"
              initialValues={{ message: '' }}
              autoFocus
            >
              <Form.Item name="message" style={{ width: '75%' }} >
                <Input />
              </Form.Item>
              <Form.Item style={{ width: '10%' }}>
                <Button type="primary" htmlType="submit">Send</Button>
              </Form.Item>
            </Form>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Chat;