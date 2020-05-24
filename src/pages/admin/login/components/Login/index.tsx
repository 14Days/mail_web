import { Form, Button, Checkbox, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import React from 'react';
import styles from './index.less';
import { connect } from 'umi';

export interface StateType {
  username?: string;
  password?: string;
}

const Login = (props) => {
  const onFinish = values => {
    const { dispatch } = props;
    dispatch({
      type: 'login/userlogin',
      payload: {
        ...values,
      },
    });

    console.log('Received values of form: ', values);
  };

  return (
    //  
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="adminname"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />}  placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="adminpwd"
        rules={[{ required: true, message: 'Please input your Password!' }]}
        style={{marginTop:"20px"}} 
      >
        <Input size="large"
          prefix={<LockOutlined className="site-form-item-icon" style={{marginTop:"10px"}} />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" style={{marginTop:"10px"}}  className={styles.login} >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};


export default connect(
  ({
    login,
    loading,
  }: {
    login: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    login,
    submitting: loading.effects['login/userlogin'],
  }),
)(Login);