import { Avatar, Button, Flex, Space } from 'antd';
import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

const Task = ({task, setHoldedTask}) => {
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef(null);
  const [disabled, setDisabled] = useState(true);

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <Draggable
      disabled={disabled}
      bounds={bounds}
      nodeRef={draggleRef}
      onStart={(event, uiData) => onStart(event, uiData)}
    >
      <Space
        direction="vertical"
        ref={draggleRef}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', background: '#fff', width: '100%' }}
        onMouseOver={() => {
          if (disabled) {
            setDisabled(false);
          }
        }}
        onMouseOut={() => {
          setDisabled(true);
        }}
        onFocus={() => { }}
        onBlur={() => { }}
      >
        <Flex
          align="center"
          justify="space-between"
        >
          <p style={{ fontWeight: 'bold' }}>{task.title}</p>
          <Button type="text">Edit</Button>
        </Flex>
        <p>{task.content}</p>
        <Flex
          align="center"
          justify="space-between"
        >
          <div></div>
          <Avatar size={32} />
        </Flex>
      </Space>
    </Draggable>
  );
};

export default Task;
