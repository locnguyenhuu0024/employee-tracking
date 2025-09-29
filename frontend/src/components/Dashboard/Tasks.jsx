import React, { useEffect, useMemo } from 'react';
import { Button, Divider, Flex, Form, Modal, notification, Space, Table, Tag, Input, Select, DatePicker } from 'antd';
import { getTasks, addTask, updateTask, deleteTask } from '../../services/taskService';
import { useNavigate } from 'react-router';
import { getEmployees } from '../../services/employeeService';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import { RetweetOutlined } from '@ant-design/icons';

const statusTags = {
  ready: 'gray',
  processing: 'blue',
  failed: 'red',
  done: 'green',
  pending: 'orange',
}

const statusOptions = [
  { value: 'ready', label: 'Ready' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
]

const Tasks = () => {
  let navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [employeeOption, setEmployeeOption] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [openForm, setOpenForm] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState();
  const [form] = Form.useForm();
  const role = useMemo(() => localStorage.getItem("role"), []);
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      render: (employee) => <Tag color="blue">{employee?.firstName} {employee?.lastName}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color={statusTags[text]}>{text.toUpperCase()}</Tag>,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => moment(text).utcOffset(420 + 60 * 7).local().format('DD-MM-YYYY HH:mm'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => moment(text).utcOffset(420 + 60 * 7).local().format('DD-MM-YYYY HH:mm'),
    },
    {
      title: 'Action',
      key: 'action_owner',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => {
            setCurrentTask(record);
            setOpenForm(true);
          }}>Update</a>
          <a style={{ color: 'green' }} onClick={() => { handleDoneTask(record.id); }}>Done</a>
          {role === 'owner' && <a style={{ color: 'red' }} onClick={() => { handleDeleteTask(record.id); }}>Delete</a>}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (currentTask) {
      currentTask.startDate = dayjs(currentTask.startDate);
      currentTask.endDate = dayjs(currentTask.endDate);
      form.setFieldsValue(currentTask);
    }
  }, [currentTask]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      const tasks = res.data.map(task => ({ ...task, employeeId: task.employee?.id }));
      setData(tasks);
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/auth');
      }
    }
  };
  const fetchEmployees = async () => {
    try {
      if (role === 'employee') return;
      console.log(role);
      const res = await getEmployees();
      const verifiedEmployees = res.data?.filter(emp => emp.verified);
      const employeeOptions = verifiedEmployees.map(emp => ({ value: emp.id, label: `${emp.firstName} ${emp.lastName}` }));
      setEmployees(verifiedEmployees);
      setEmployeeOption(employeeOptions);
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/auth');
      }
    }
  };
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const employee = employees.find(emp => emp.id === values.employeeId);

      const data = { ...values };
      data.employee = employee;

      const res = currentTask ? await updateTask(currentTask.id, { ...data }) : await addTask({ ...data });
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

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      fetchData();
    } catch (error) {
      api.error({ message: 'Error', description: error.response?.data?.message, duration: 3 });
    }
  };
  const handleDoneTask = async (id) => {
    try {
      await updateTask(id, { status: 'done' });
      fetchData();
      api.success({ message: 'Success', description: 'Done task successfully', duration: 3 });
    } catch (error) {
      api.error({ message: 'Error', description: error.response?.data?.message, duration: 3 });
    }
  };
  return (
    <>
      {contextHolder}
      <Flex justify="flex-end" align="center">
        <Button type="default" icon={<RetweetOutlined />} onClick={() => { fetchData(); }}>Reload</Button>
        <Button
          style={{ visibility: role === 'employee' ? 'hidden' : 'visible' }}
          type="primary"
          onClick={() => {
            setCurrentTask(null);
            form.resetFields();
            setOpenForm(true);
          }}
        >Add Task</Button>
      </Flex>
      <Divider />
      <Table columns={columns.filter(col => col.hidden !== true)} dataSource={data} key="id" rowKey="id" loading={loading} />
      <Modal
        title={currentTask ? 'Update Task' : 'Add Task'}
        open={openForm}
        footer={null}
        onCancel={() => {
          setOpenForm(false);
        }}
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
          initialValues={{ status: 'ready' }}
        >
          <Form.Item
            label="Title"
            name="title"
          >
            <Input disabled={role === 'employee'} />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
          >
            <Input disabled={role === 'employee'} />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
          >
            <Select>
              {statusOptions.map(status => <Select.Option key={status.value} value={status.value}>{status.label}</Select.Option>)}
            </Select>
          </Form.Item>
          {role === 'owner' && <Form.Item
            label="Employee"
            name="employeeId"
          >
            <Select options={employeeOption} />
          </Form.Item>}
          <Form.Item
            label="Start Date"
            name="startDate"
          >
            <DatePicker showTime disabled={role === 'employee'} />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
          >
            <DatePicker showTime disabled={role === 'employee'} />
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

export default Tasks;