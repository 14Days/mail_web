import { FormattedMessage, formatMessage } from 'umi';
import React, { useState } from 'react';
import OperationModal from './OperationModal'

import { List } from 'antd';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: (
    <span className="strong">
      <FormattedMessage id="accountandsettings.security.strong" defaultMessage="Strong" />
    </span>
  ),
  medium: (
    <span className="medium">
      <FormattedMessage id="accountandsettings.security.medium" defaultMessage="Medium" />
    </span>
  ),
  weak: (
    <span className="weak">
      <FormattedMessage id="accountandsettings.security.weak" defaultMessage="Weak" />
      Weak
    </span>
  ),
};

const pwd=sessionStorage.getItem("password");

function SecurityView() {
  
  const [visible, setVisible] = useState<boolean>(false);
  const getData = () => [
    {
      title: formatMessage({ id: 'accountandsettings.security.password' }, {}),
      description: (
        <>
          {formatMessage({ id: 'accountandsettings.security.password-description' })}：
          {pwd.length>10? passwordStrength.strong:passwordStrength.medium}
        </>
      ),
      actions: [
        <a key="Modify" onClick={()=>{setVisible(true)}}>
          <FormattedMessage id="accountandsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountandsettings.security.phone' }, {}),
      description: `${formatMessage(
        { id: 'accountandsettings.security.phone-description' },
        {},
      )}：138****8293`,
      actions: [
        <a key="Modify">
          <FormattedMessage id="accountandsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountandsettings.security.question' }, {}),
      description: formatMessage({ id: 'accountandsettings.security.question-description' }, {}),
      actions: [
        <a key="Set">
          <FormattedMessage id="accountandsettings.security.set" defaultMessage="Set" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountandsettings.security.email' }, {}),
      description: `${formatMessage(
        { id: 'accountandsettings.security.email-description' },
        {},
      )}：ant***sign.com`,
      actions: [
        <a key="Modify">
          <FormattedMessage id="accountandsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountandsettings.security.mfa' }, {}),
      description: formatMessage({ id: 'accountandsettings.security.mfa-description' }, {}),
      actions: [
        <a key="bind">
          <FormattedMessage id="accountandsettings.security.bind" defaultMessage="Bind" />
        </a>,
      ],
    },
  ];

  
    const data = getData();
    return (
      <>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={item.actions} >
              <List.Item.Meta 
              title={
              <a style={{fontSize:"16px",color:"#2F4F4F"}}>
                {item.title}
              </a> } 
              description={item.description} />
            </List.Item>
          )}
        />
      <OperationModal visible={visible} onCancel={()=>{setVisible(false)}}/>
      </>
    );
  
}

export default SecurityView;
