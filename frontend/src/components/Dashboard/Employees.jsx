import React, { useEffect } from 'react';
import { Button, Divider, Flex, Form, Modal, notification, Space, Table, Tag, Input } from 'antd';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../../services/employeeService';
import { useNavigate, useSearchParams } from 'react-router';
import { setParamsToUrl } from '../../services/normalService';

const Employees = () => {
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [openForm, setOpenForm] = React.useState(false);
  const [currentEmployee, setCurrentEmployee] = React.useState();
  const [form] = Form.useForm();
  const role = localStorage.getItem('role');

  const columns = [
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      key: 'verified',
      render: (text) => <Tag color={text ? 'green' : 'volcano'}>{text ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => {
            setCurrentEmployee(record);
            setOpenForm(true);
          }}>Update</a>
          <a style={{ color: 'red' }} onClick={() => { handleDeleteEmployee(record.id); }}>Delete</a>
          {/* <a onClick={() => { setSearchParams({ tab: 'chat', chatId: record.chatId }); }}>Chat</a> */}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentEmployee) {
      form.setFieldsValue(currentEmployee);
    }
  }, [currentEmployee]);

  const fetchData = async () => {
    try {
      if (role === 'employee') return;
      setLoading(true);
      const res = await getEmployees();
      setData(res.data);
      setLoading(false);
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate('/auth');
      }
    }
  };
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = currentEmployee ? await updateEmployee(currentEmployee.id, { ...values }) : await addEmployee({ ...values });
      fetchData();
      api.success({ message: 'Success', description: res.message, duration: 3 });
      setOpenForm(false);
    } catch (error) {
      api.error({ message: 'Error', description: error.response?.data?.message, duration: 3 });
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployee(id);
      fetchData();
    } catch (error) {
      api.error({ message: 'Error', description: error.response?.data?.message, duration: 3 });
    }
  };
  return (
    <>
      {contextHolder}
      <Flex justify="flex-end" align="center">
        <Button
          type="primary"
          onClick={() => {
            setCurrentEmployee(null);
            form.resetFields();
            setOpenForm(true);
          }}
        >Add Employee</Button>
      </Flex>
      <Divider />
      <Table columns={columns} dataSource={data} key="id" rowKey="id" loading={loading} />
      <Modal
        title={currentEmployee ? 'Update Employee' : 'Add Employee'}
        open={openForm}
        footer={null}
        onCancel={() => {
          form.resetFields();
          setOpenForm(false);
        }}
        forceRender
      >
        <Form
          form={form}
          name="employee_form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
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
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input type='email' disabled={currentEmployee} />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Employees;