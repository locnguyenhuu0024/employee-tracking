import React, { useEffect } from 'react';
import { Card, Flex, Tabs } from 'antd';
import OwnerSignInForm from '../components/Auth/OwnerSignInForm';
import EmployeeSignInForm from '../components/Auth/EmployeeSignInForm';
import { useNavigate } from 'react-router';

const boxStyle = {
  width: '100%',
  height: '100vh',
};
const App = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token]);

  const items = [
    {
      key: 'owner',
      label: 'Owner',
      children: <OwnerSignInForm />,
    },
    {
      key: 'employee',
      label: 'Employee',
      children: <EmployeeSignInForm />,
    }
  ];

  return (
    <Flex style={boxStyle} justify={"center"} align={"center"}>
      <Card title="Sign In" style={{ width: 600 }}>
        <Tabs defaultActiveKey="owner" items={items} />
      </Card>
    </Flex>
  );
};
export default App;