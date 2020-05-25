import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Input, Select } from 'antd';
import { BasicListItemDataType,ListItemDataType } from '../data';
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
  onSubmit: (values: BasicListItemDataType) => void;
  dispatch: Dispatch<any>;
  loading: boolean;
  mail_id: number;
  onCancel: () => void;
  pageNumber: number;
}


const OperationModal: FC<OperationModalProps> = (props) => {
  
  const { dispatch,visible, mail_id,onCancel,pageNumber } = props;
 
  const handleSubmit = () => {
    console.log(mail_id)
    dispatch({
      type:'email/delete',
      payload:{
        mail_id,
        pageNumber
      }
    })
    onCancel()
  };


  const modalFooter =  { okText: '确定', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    return (
      <p style={{textAlign:'center',fontSize:'16px'}}>
              确定删除该邮件？
          </p> 
    );
  };

  return (
    <Modal
      title={'删除邮件'}
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
    loading,
  }: {
    email: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    loading: loading.models.email,
  }),
)(OperationModal);