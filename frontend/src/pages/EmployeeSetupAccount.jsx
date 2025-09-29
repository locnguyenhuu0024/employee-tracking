import React from 'react';
import { Card, Flex } from 'antd';
import EmployeeSetupAccountForm from '../components/Auth/EmployeeSetupAccountForm';

const boxStyle = {
  width: '100%',
  height: '100vh',
};
const EmployeeSetupAccount = () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');

  return (
    <Flex style={boxStyle} justify={"center"} align={"center"}>
      <Card title={`Welcome ${name}, setup your account`} style={{ width: 600 }}>
        <EmployeeSetupAccountForm />
      </Card>
    </Flex>
  );
};
export default EmployeeSetupAccount;