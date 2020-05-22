import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Input, Select } from 'antd';
import { BasicListItemDataType } from '../data';
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

const NoticeModal: FC<OperationModalProps> = (props) => {
  
  const [form] = Form.useForm();
  const { visible, onCancel, onSubmit } = props;
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
    if (onSubmit) {
      onSubmit(values as BasicListItemDataType);
    }
  };

  const modalFooter =  { okText: '确定', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="subject"
          label="标题"
          rules={[{ required: true,message: '请输入标题' }]}
        >
          
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input.TextArea placeholder="请输入" />
          
        </Form.Item>
        
      </Form>
    );
  };

  return (
    <Modal
      title={'通知消息'}
      className={styles.standardListForm}
      width={640}
      bodyStyle={ { padding: '28px 0 0' }}
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
)(NoticeModal);