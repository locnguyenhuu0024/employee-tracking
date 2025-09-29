import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { employeeSignIn } from '../../services/authService';
import { useNavigate } from 'react-router';

const EmployeeSignInForm = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const onFinish = async values => {
    try {
      const response = await employeeSignIn(values);
      api.success({ message: 'Success', description: response.message, duration: 1 });

      localStorage.setItem('accessToken', response.data?.accessToken);
      localStorage.setItem('role', response.data?.role);
      localStorage.setItem('user', JSON.stringify(response.data));

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.log('Failed:', error);
      api.error({ message: 'Error', description: error.response.data.message, duration: 1 });
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {contextHolder}
      <Form
        name="employee_sign_in"
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

        <p style={{ fontStyle: 'italic' }}>If you don't have an account, please contact your admin!</p>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default EmployeeSignInForm;