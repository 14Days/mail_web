import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Input, Select } from 'antd';
import { BasicListItemDataType } from '../data.d';
import styles from '../style.less';
import { connect, Dispatch } from 'umi';

export interface StateType {
  list: BasicListItemDataType[];
  count: number;
  info: Partial<BasicListItemDataType> | undefined;
  msg: string;
}
interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;  
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => void;
  dispatch: Dispatch<any>;
  loading: boolean;
  userList: StateType;
  onCancel: () => void;
}

const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperationModal: FC<OperationModalProps> = (props) => {
  
  const [form] = Form.useForm();
  const { done, visible, current, onDone, onCancel, onSubmit,userList:{info,msg} } = props;
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }    
  }, [props.visible]);

  useEffect(() => {
    if (info) {
      form.setFieldsValue({
        ...info,
        createdAt: info.createdAt ? moment(info.createdAt) : null,
      });
    }
  }, [props.userList.info]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as BasicListItemDataType);
    }
  };

  const modalFooter = done
    ? { footer: null, onCancel: onDone }
    : { okText: '保存', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="username"
          label="用户邮箱"
          rules={[{ required: true,message: '请输入用户邮箱' }]}
        >
          
          <Input placeholder="请输入" disabled={current?true:false} />
        </Form.Item>
        <Form.Item
          name="nickname"
          label="用户昵称"
          rules={[{ required: true, message: '请输入用户昵称' }]}
        >
          <Input placeholder="请输入" />
          
        </Form.Item>
        <Form.Item
          name="sex"
          label="性别"
          rules={[{ required: true, message: '请输入用户性别' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="男">男</Select.Option>
            <Select.Option value="女">女</Select.Option>
          </Select>

        </Form.Item>
        <Form.Item
          name="password"
          label="用户密码"
          // 判断密码是否符合要求
          rules={[{
            required: current?false:true,
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
              if(current){
                  if ((l_flag && d_flag &&value.length>=6)|| !value ) {
                    return Promise.resolve();
                  }
                  return Promise.reject('密码至少六位且包含字母和数字');
              }
              else{
                if ((l_flag && d_flag &&value.length>=6)|| !value) {
                  return Promise.resolve();
                }
                return Promise.reject('密码至少六位且包含字母和数字');
              }          
              
              
            },
          }) ]}
        >
          <Input.Password placeholder="******"/>
          {/* <DatePicker
            showTime
            placeholder="请选择"
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
          /> */}
        </Form.Item>
        <Form.Item
          name="user_type"
          label="用户权限"
          rules={[{ required: true, message: '请选择用户权限' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="普通用户">普通用户</Select.Option>
            <Select.Option value="拉黑">拉黑</Select.Option>
          </Select>
        </Form.Item>
        {/* <Form.Item
          name="subDescription"
          label="产品描述"
          rules={[{ message: '请输入至少五个字符的产品描述！', min: 5 }]}
        >
          <TextArea rows={4} placeholder="请输入至少五个字符" />
        </Form.Item> */}
      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `用户${current ? '资料' : '添加'}`}
      className={styles.standardListForm}
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
    userList,
    loading,
  }: {
    userList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    userList,
    loading: loading.models.users,
  }),
)(OperationModal);