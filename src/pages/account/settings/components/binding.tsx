import { FormattedMessage, formatMessage } from 'umi';
import { AlipayOutlined, DingdingOutlined, TaobaoOutlined } from '@ant-design/icons';
import { List,Modal } from 'antd';
import React, { Component, Fragment,useEffect } from 'react';
import ip from '@/assets/img/ip.svg'
import { connect } from 'dva';

@connect(({ filter }) => ({
  filter,
}))
class BindingView extends Component {
  constructor(props) {
    super(props);
    this.state={
      visible: false,
      ip_id: '',
    }
  }
  
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
    const {visible, ip_id} = this.state    
    return (  
      <>    
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
              <a onClick={()=>{                
                this.setState({
                  visible:true,
                  ip_id:item.ip_id,
                })
              }}>取消封禁</a>
            </List.Item>
          )}
        />
        <Modal
          title={"解除IP封禁"}
          visible={visible }
          onCancel={()=>{this.setState({
            visible:false
          })}}
          onOk={()=>{
            
            dispatch({
              type:"filter/delete",
              payload:ip_id,
            })
            this.setState({
              visible:false
            })
          }}
        >
        <p style={{textAlign:'center',fontSize:'16px',}}>
              确定解除该ip封禁？
          </p> 
        </Modal>
        </>
    );
  }
}

export default BindingView;
