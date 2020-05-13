import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Input, Select } from 'antd';
import { BasicListItemDataType } from '../data.d';
import styles from '../style.less';

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => void;
  onCancel: () => void;
}

const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const [form] = Form.useForm();
  const { done, visible, current, onDone, onCancel, onSubmit } = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        createdAt: current.createdAt ? moment(current.createdAt) : null,
      });
    }
  }, [props.current]);

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
    if (done) {
      return (
        <Result
          status="success"
          title="操作成功"
          subTitle="一系列的信息描述，很短同样也可以带标点。"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="title"
          label="用户邮箱"
          rules={[{ required: true, message: '请输入用户邮箱' }]}
        >
          <Input placeholder="请输入" />
          
        </Form.Item>
        <Form.Item
          name="username"
          label="用户昵称"
          rules={[{ required: true, message: '请输入用户昵称' }]}
        >
          <Input placeholder="请输入" />

        </Form.Item>
        <Form.Item
          name="pwd"
          label="用户密码"
          rules={[{ required: true, message: '请输入用户密码' }]}
        >
          <Input placeholder="请输入"/>
          {/* <DatePicker
            showTime
            placeholder="请选择"
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
          /> */}
        </Form.Item>
        <Form.Item
          name="type"
          label="用户权限"
          rules={[{ required: true, message: '请选择用户权限' }]}
        >
          <Select placeholder="请选择">
            <Select.Option value="管理员">管理员</Select.Option>
            <Select.Option value="普通用户">普通用户</Select.Option>
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
      title={done ? null : `用户${current ? '编辑' : '添加'}`}
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

export default OperationModal;