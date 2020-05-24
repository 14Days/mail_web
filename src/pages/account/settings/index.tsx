import React, { Component } from 'react';

import { FormattedMessage, Dispatch, connect } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { Menu,Modal,Button, Input,Card } from 'antd';
import BaseView from './components/base';
import {StopOutlined} from '@ant-design/icons';
import BindingView from './components/binding';
import { CurrentUser } from './data.d';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';
const { Item } = Menu;

interface SettingsProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
}

type SettingsStateKeys = 'base' | 'security' | 'binding' | 'notification';
interface SettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: SettingsStateKeys;
  visible: boolean;
}

class Settings extends Component<SettingsProps, SettingsState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: SettingsProps) {
    super(props);
    const menuMap = {
      // base: (
      //   <FormattedMessage id="accountandsettings.menuMap.basic" defaultMessage="Basic Settings" />
      // ),
      security: (
        <FormattedMessage
          id="accountandsettings.menuMap.security"
          defaultMessage="Security Settings"
        />
      ),
      binding: (
        <FormattedMessage
          id="accountandsettings.menuMap.binding"
          defaultMessage="Account Binding"
        />
      ),
      notification: (
        <FormattedMessage
          id="accountandsettings.menuMap.notification"
          defaultMessage="New Message Notification"
        />
      ),
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'security',
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountAndsettings/fetchCurrent',
    });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    console.log(menuMap[selectKey]);
    
    return menuMap[selectKey];
  };

  selectKey = (key: SettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;
    switch (selectKey) {
      // case 'base':
      //   return <BaseView />;
      case 'security':
        return <SecurityView />;
      case 'binding':
        return <BindingView />;
      case 'notification':
        return <NotificationView />;
      default:
        break;
    }

    return null;
  };

  render() {
    const {dispatch} = this.props;
    const { currentUser } = this.props;
    if (!currentUser.userid) {
      return '';
    }
    const { mode, selectKey } = this.state;
    return (
      <>
      <GridContent>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              style={{fontWeight:550, fontSize:"16px",color:"#2F4F4F"}}
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key as SettingsStateKeys)}
            >
              {this.getMenu()}
            </Menu>
          </div>
         <div className={styles.right}>
          <Card              
              title={<a className={styles.cardTitle}>{this.getRightTitle()}</a>}
              extra={selectKey=='binding'?<Button type="primary" 
              icon={<StopOutlined/>}
              style={{marginLeft:"20px"}}
              onClick={()=>{this.setState({
                visible: true
              })}}>拉黑 IP</Button>:''}
            >            
              {this.renderChildren()}
            </Card>
         </div>
            
          
        </div>
        
      </GridContent>
      <Modal
        title={"拉黑 IP"}
        visible={this.state.visible }
        onCancel={()=>{this.setState({
          visible:false
        })}}
        onOk={()=>{
          dispatch({
            type:"filter/pullback",
            payload:document.getElementById("ip").value
          })
          this.setState({
            visible:false
          })
        }}
      >
        <div style={{marginLeft:"20px",marginRight:"20px"}}>
          <Input id="ip" prefix={"IP地址："} placeholder="请输入IP地址" size="large"></Input>
        </div>
      </Modal>
    </>
    );
  }
}

export default connect(
  ({ accountAndsettings }: { accountAndsettings: { currentUser: CurrentUser } }) => ({
    currentUser: accountAndsettings.currentUser,
  }),
)(Settings);
