import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Flex, Spin } from 'antd';

const App = () => {
  let navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/auth');
    } else {
      navigate('/dashboard');
    }
  }, [accessToken, navigate]);

  const boxStyle = {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    border: '1px solid #40a9ff',
  };

  return (
    <Flex style={boxStyle} justify={"center"} align={"center"}>
      <Spin tip="Loading" size="large">
        <div className="content">Loading...</div>
      </Spin>
    </Flex>
  );
};

export default App;