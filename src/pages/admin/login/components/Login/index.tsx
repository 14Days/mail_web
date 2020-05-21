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
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className={styles.login} >
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