import React, { useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { employeeSetup } from '../../services/authService';
import { useNavigate } from 'react-router';


const EmployeeSetupAccountForm = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const expiresAt = params.get('expiresAt');

  useEffect(() => {
    if (expiresAt && new Date().getTime() > parseInt(expiresAt)) {
      api.error({ message: 'Error', description: 'Setup link has expired', duration: 1 });
      setTimeout(() => {
        navigate('/auth');
      }, 1000);
    }
  }, [expiresAt]);

  const onFinish = async (values) => {
    try {
      const account = { username: values.username, password: values.password };
      await employeeSetup(account, token);
      api.success({ message: 'Success', description: 'Setup account successfully', duration: 1 });
      setTimeout(() => {
        navigate('/auth');
      }, 1000);
    } catch (error) {
      api.error({ message: 'Error', description: error.response?.data?.message, duration: 1 });
    }
  };
  const onFinishFailed = errorInfo => {
    api.error({ message: 'Error', description: 'Setup account failed', duration: 1 });
  };

  return (
    <>
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirm_password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please input your confirm password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('The confirm password that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
};
export default EmployeeSetupAccountForm;