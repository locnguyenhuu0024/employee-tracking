import React from 'react';
import { Button, Flex, Form, Input, notification } from 'antd';
import moment from 'moment';
import { updateEmployee } from '../../services/employeeService';
import { updateOwner } from '../../services/ownerService';

const ProfileForm = ({ user }) => {
  const role = React.useMemo(() => localStorage.getItem('role'), []);
  const [api, contextHolder] = notification.useNotification();
  const onFinish = async values => {
    try {
      if (role === 'owner') {
        const updatedOwner = await updateOwner(user.id, values);
        api.success({ message: 'Success', description: 'Update your information successfully', duration: 1 });
        localStorage.setItem('user', JSON.stringify(updatedOwner.data));
        form.setFieldsValue(updatedOwner.data);
      } else {
        const updatedEmployee = await updateEmployee(user.id, values);
        api.success({ message: 'Success', description: 'Update your information successfully', duration: 1 });
        localStorage.setItem('user', JSON.stringify(updatedEmployee.data));
        form.setFieldsValue(updatedEmployee.data);
      }
    } catch (error) {
      console.log('Failed:', error);
      api.error({ message: 'Error', description: error.response.data.message, duration: 1 });
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const [form] = Form.useForm();
  React.useEffect(() => {
    if (user) {
      user.createdAt = moment(user.createdAt).format('YYYY-MM-DD');
      form.setFieldsValue(user);
    }
  }, [user]);

  return (
    <>
      {contextHolder}
      <Form
        name="profile"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="First Name"
          name="firstName"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
        >
          <Input disabled={user?.email ? true : false} />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
        >
          <Input disabled={user?.phone ? true : false} />
        </Form.Item>

        <Form.Item
          label="Created At"
          name="createdAt"
        >
          <Input disabled />
        </Form.Item>

        <Flex justify="end" align='center'>
          <Form.Item label={null} style={{ marginRight: 20 }}>
            <Button type="text" danger onClick={() => { }}>Delete Account</Button>
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </>
  )
}

export default ProfileForm;