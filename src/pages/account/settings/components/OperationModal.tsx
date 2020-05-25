import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Input, Select } from 'antd';
import styles from '../style.less';
import { connect, Dispatch } from 'umi';

export interface StateType {
  count: number;
}
interface OperationModalProps {
  done: boolean;
  visible: boolean; 
  dispatch: Dispatch<any>;
  loading: boolean;
  onCancel: () => void;
}

const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperationModal: FC<OperationModalProps> = (props) => {
  
  const [form] = Form.useForm();
  const {dispatch, done, visible,  onCancel} = props;
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }    
  }, [props.visible]);


  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    console.log(values);
    console.log(sessionStorage.getItem("user_type"));
    
    dispatch({
      type:'admin/changepassword',
      payload:{
        user_id: sessionStorage.getItem("user_id"),
        password: values.newpassword,
        user_type: sessionStorage.getItem("user_type"),
        nickname: sessionStorage.getItem("nickname"),
        sex: sessionStorage.getItem("sex")
      }
    })
    
    onCancel()
  };

  const modalFooter = { okText: '确定', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="oldpassword"
          label="原密码"
          hasFeedback
          rules={[{
            required: true,
            message: '密码不能为空',
          },
            ({ getFieldValue }) => ({
            validator(rule, value) {
              if (value==sessionStorage.getItem("password") || !value) {
                return Promise.resolve();
              }
              return Promise.reject('与原密码不同');              
              
            },
          }) ]}
        >
          
          <Input.Password />
        </Form.Item>
        
        <Form.Item
          name="newpassword"
          label="新密码"
          hasFeedback
          // 判断密码是否符合要求
          rules={[{
            required: true,
            message: '密码不能为空',
          },
            ({ getFieldValue }) => ({
            validator(rule, value) {
              let l_flag=false,d_flag=false;
              for (var i in value) {
                  var asc = value.charCodeAt(i);
                  if ((asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122)) {
                      l_flag=true;
                  }
                  if((asc>=48 && asc <=57)){
                    d_flag=true;
                  }
              }  
              if(value==sessionStorage.getItem("password"))
                return Promise.reject('与原密码相同');
              if ((l_flag && d_flag &&value.length>=6)|| !value ) {
                return Promise.resolve();
              }
              return Promise.reject('密码至少六位且包含字母和数字');
                           
              
            },
          }) ]}
        >
          <Input.Password  />
         
        </Form.Item>
        <Form.Item
          name="confirmpassword"
          label="确认密码"
          hasFeedback
          // 判断密码是否符合要求
          rules={[{
            required: true,
            message: '密码不能为空',
          },
            ({ getFieldValue }) => ({
            validator(rule, value) {
              

            if ( getFieldValue('newpassword') === value|| !value ) {
              return Promise.resolve();
            }
            return Promise.reject('两次密码不同');
                              
              
            },
          }) ]}
        >
          <Input.Password/>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={"修改密码"}
      width={640}
      bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default connect(
  ({
    loading,
  }: {
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    loading: loading.models.admin,
  }),
)(OperationModal);