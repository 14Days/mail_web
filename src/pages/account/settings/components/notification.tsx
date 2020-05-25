import { List, Switch, Modal, Input, InputNumber } from 'antd';
import React, { Component } from 'react';

import { formatMessage } from 'umi';
import { connect } from 'dva';
import { node } from 'prop-types';


type Unpacked<T> = T extends (infer U)[] ? U : T;

@connect(({ server }) => ({
  server,
}))
class NotificationView extends Component {
  constructor(props) {
    super(props);
    this.state={
      visible:false,
      current:0,
    }
  }
  componentWillMount(){
    const {dispatch} = this.props
    dispatch({
      type:"server/fetch"
    })
  }
  
  getData = () => {
    const {dispatch} = this.props
    const {server}=this.props;
    const {pop_port,pop_state,smtp_port,smtp_state} = server;
    const pop3Action = (
      <Switch
        checkedChildren={formatMessage({ id: 'accountandsettings.settings.open' })}
        unCheckedChildren={formatMessage({ id: 'accountandsettings.settings.close' })}
        defaultChecked={pop_state?true:false}
        onChange={
          (value)=>{
            console.log(value);  
            dispatch({
              type:'server/changePop3State',
              payload:value
            })          
          }
        } 
      />
    );
    const smtpAction = (
      <Switch
        checkedChildren={formatMessage({ id: 'accountandsettings.settings.open' })}
        unCheckedChildren={formatMessage({ id: 'accountandsettings.settings.close' })}
        defaultChecked={smtp_state?true:false}
        onChange={
          (value)=>{
            console.log(value);  
            dispatch({
              type:'server/changeSmtpState',
              payload:value
            })          
          }
        } 
      />
    );
    return [
      {
        id:1,
        title: "POP3服务",
        description: `端口号：${pop_port}`,
        actions: [pop3Action],
      },
      {
        id:2,
        title: "SMTP服务",
        description: `端口号：${smtp_port}`,
        actions: [smtpAction],
      },
    ];
  };

  render() {    
    const {dispatch} = this.props
    const data = this.getData();
    const {visible,current} = this.state;
    function checkNumber(str){
      var i=0;
      if(!str)
        return false;
      for(;i<str.length;i++){
        if(isNaN(str[i]))            //判断是否不是数字
          return false;          
      }
      var re = /(\d+)/g;
      while(re.exec(str))
      {
          var int = parseInt(RegExp.$1);
          if(int <0 || int> 65535)
          return false;
      }
      return true;
    }
    return (
      <>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={item.actions} >
              <List.Item.Meta 
                title={<a style={{fontSize:"16px",color:"#2F4F4F",marginLeft:"10px"}}>{item.title}</a>} 
                description={
                  <div style={{marginTop:"10px",marginLeft:"13px"}}>
                    {item.description} 
                    <a style={{marginLeft:"20px"}}  onClick={(e)=>{
                      this.setState({
                        visible:true,
                        current:item.id
                      })}}>
                      修改
                    </a>             
                  </div>}
                
              />
            </List.Item>
          )}
         />
         <Modal
          title={"修改端口号"}
          visible={visible}
          destroyOnClose
          onCancel={()=>{this.setState({
            visible:false
          })}}
          onOk={()=>{   
            var value =document.getElementById("port")?.getAttribute("value") 
            
            if(checkNumber(value)){
              document.getElementById("msg")?.setAttribute("style","display:none");
              current==1?dispatch({
                type:"server/changePop3",
                payload:Number(value)
              }):dispatch({
                type:"server/changeSmtp",
                payload:Number(value)
              })
              this.setState({
                visible:false
              })
            }
            else{
              document.getElementById("msg")?.setAttribute("style","display:true;color:red;margin-left:130px"); 
            }
            
          }}
        >
          <div>
            <label style={{marginRight:"10px",color:"black",marginLeft:"40px"}}>{current==1?'POP3':'SMTP'}端口号:</label>
            <Input 
              id="port"
              style={{width:'50%'}} 
              placeholder="请输入你想要设置的端口号"
              onBlur={(e)=>{              
                if(!checkNumber(e.target.value)){
                   document.getElementById("msg")?.setAttribute("style","display:true;color:red;margin-left:130px");                
                 }
                else{
                  document.getElementById("msg")?.setAttribute("style","display:none");
                }                
              }}
              onChange={(e)=>{                              
                if(!checkNumber(e.target.value)){
                   document.getElementById("msg")?.setAttribute("style","display:true;color:red;margin-left:130px");                
                 }
                else{
                  document.getElementById("msg")?.setAttribute("style","display:none");
                }                
              }}
              
            />
            <p id="msg" style={{display:"none"}}>*请输入0-65535内的数字</p>
          </div>
        </Modal>
      </>
      
      
    );
  }
}

export default NotificationView;
