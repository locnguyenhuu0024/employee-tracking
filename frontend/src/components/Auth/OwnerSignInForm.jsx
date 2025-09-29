import React, { useState } from 'react';
import { Button, Form, Input, Space, notification, Modal } from 'antd';
import { ownerSendCode, ownerVerifyCode } from '../../services/authService';
import { useNavigate } from 'react-router';


const OwnerSignInForm = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [code, setCode] = useState(null);
  const [phone, setPhone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const onFinish = async values => {
    try {
      const phoneNumber = values?.phone?.toString().startsWith('0') ? `+84${values.phone.slice(1)}` : `+84${values.phone}`;
      setLoading(true);
      const res = await ownerSendCode({ phone: phoneNumber });
      setLoading(false);
      setPhone(phoneNumber);
      api.success({ message: 'Success', description: res.message, duration: 1 });
      showModal();
    } catch (error) {
      setLoading(false);
      api.error({ message: 'Error', description: error.response.data.message, duration: 1 });
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onFinishVerifyCode = async () => {
    try {
      setLoading(true);
      const res = await ownerVerifyCode({ phone, code: parseInt(code) });
      setLoading(false);
      localStorage.setItem('accessToken', res.data?.accessToken);
      localStorage.setItem('role', 'owner');
      localStorage.setItem('user', JSON.stringify(res.data));
      api.success({ message: 'Success', description: res.message, duration: 1 });
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      api.error({ message: 'Error', description: error.response.data.message, duration: 1 });
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        name="owner_sign_in"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Phone number"
          name="phone"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Space.Compact>
            <Input style={{ width: '20%' }} defaultValue="+84" disabled />
            <Input style={{ width: '80%' }} type="tel" />
          </Space.Compact>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Verify Code"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        footer={null}
      >
        <Form
          name="owner_verify_code"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinishVerifyCode}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label={null}
            name="code"
            rules={[{ required: true, message: 'Please input your code!' }]}
          >
            <Input.OTP size='large' length={6} onChange={setCode} value={code} />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
};
export default OwnerSignInForm;