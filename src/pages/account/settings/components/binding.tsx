import { FormattedMessage, formatMessage } from 'umi';
import { AlipayOutlined, DingdingOutlined, TaobaoOutlined } from '@ant-design/icons';
import { List,Button } from 'antd';
import React, { Component, Fragment,useEffect } from 'react';
import ip from '@/assets/img/ip.svg'
import { connect } from 'dva';

@connect(({ filter }) => ({
  filter,
}))
class BindingView extends Component {
  componentWillMount(){
    const {dispatch} = this.props
    dispatch({
      type:"filter/fetch"
    })
  }
  getData = () => [
    {
      title: formatMessage({ id: 'accountandsettings.binding.taobao' }, {}),
      description: formatMessage({ id: 'accountandsettings.binding.taobao-description' }, {}),
      actions: [
        <a key="Bind">
          <FormattedMessage id="accountandsettings.binding.bind" defaultMessage="5645645" />
        </a>,
      ],
      avatar: <TaobaoOutlined className="taobao" />,
    },
    {
      title: formatMessage({ id: 'accountandsettings.binding.alipay' }, {}),
      description: formatMessage({ id: 'accountandsettings.binding.alipay-description' }, {}),
      actions: [
        <a key="Bind">
          <FormattedMessage id="accountandsettings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <AlipayOutlined className="alipay" />,
    },
    {
      title: formatMessage({ id: 'accountandsettings.binding.dingding' }, {}),
      description: formatMessage({ id: 'accountandsettings.binding.dingding-description' }, {}),
      actions: [
        <a key="Bind">
          <FormattedMessage id="accountandsettings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <DingdingOutlined className="dingding" />,
    },
  ];

  render() {
    const {filter,dispatch}=this.props
    const {list} = filter
    console.log(list);
    
    return (      
        <List 
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item) => (
            <List.Item >
              <List.Item.Meta
                // avatar={item.avatar}
                title={                
                <a style={{fontSize:"16px",color:"#2F4F4F"}}>
                   <img src={ip}></img> {item.address}
                </a>}
                // description={item.description}
              />
              <a>取消封禁</a>
            </List.Item>
          )}
        />
    );
  }
}

export default BindingView;
