import React, { FC, useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Input, List, Avatar } from 'antd';
import { findDOMNode } from 'react-dom';
import { connect, Dispatch } from 'umi';
import OperationModal from './components/OperationModal';
import { BasicListItemDataType } from './data.d';
import admin from '@/assets/img/admin.png';
import user from '@/assets/img/user.png';
import styles from './style.less';
const { Search } = Input;

export interface StateType {
  list: BasicListItemDataType[];
  count: number;
}
interface BasicListProps {
  userList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
  count: number;
}

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({
  data: { nickname, user_type },
}: {
  data: BasicListItemDataType;
}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>昵称</span>
      <p>{nickname}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>权限</span>
      <p>{user_type == '2' ? '普通用户' : '拉黑'}</p>
    </div>
  </div>
);

export const BasicList: FC<BasicListProps> = props => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    userList: { list, count },
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<string | undefined>(undefined);
  useEffect(() => {
    //获取用户列表
    dispatch({
      type: 'userList/fetch',
    });
  }, [1]);
  const paginationProps = {
    showSizeChanger: false,
    showQuickJumper: true,
    pageSize: 5,
    total: count,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: string) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    // dispatch({
    //   type: 'listAndbasicList/submit',
    //   payload: { id },
    // });
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <Search
        className={styles.extraContentSearch}
        placeholder="请输入用户邮箱"
        onSearch={() => ({})}
      />
    </div>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();
    setDone(false);
    setVisible(false);
    dispatch({
      type: 'userList/fetch',
    });
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: BasicListItemDataType) => {
    const id = current ? current : '';
    setAddBtnblur();
    setDone(true); 
    if(current){      
      dispatch({
        type: 'userList/submit',
        payload: { id, ...values },
      });
    }
    else{      
      dispatch({
        type: 'userList/appendFetch',
        payload: {...values },
      });
    }
  };

  const getUserInfo = (values: string) => {
    dispatch({
      type: 'userList/fetchUserInfo',
      payload: values,
    });
  };

  return (
    <div>
      <div className={styles.standardList}>
        {/* 用户列表 */}
        <Card
          className={styles.listCard}
          bordered={false}
          title={<a className={styles.cardTitle}>用户管理</a>}
          style={{
            marginTop: 34,
            marginLeft: 24,
            marginRight: 24,
          }}
          bodyStyle={{
            padding: '0 32px 40px 32px',
          }}
          extra={extraContent}
        >
          <Button
            type="dashed"
            style={{
              width: '100%',
              marginBottom: 8,
            }}
            onClick={showModal}
            ref={addBtn}
          >
            <PlusOutlined />
            添加
          </Button>

          {/* <TableBordered /> */}
          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            renderItem={item => (
              <List.Item
                actions={[
                  <a
                    key="edit"
                    onClick={e => {
                      e.preventDefault();
                      getUserInfo(item.id);
                      showEditModal(item.id);
                    }}
                  >
                    编辑
                  </a>,
                  <a
                    key="delete" // onClick={(e) => {
                    //   e.preventDefault();
                    //   showEditModal(item);
                    // }}
                  >
                    删除
                  </a>,
                ]}
              >
                <List.Item.Meta
                  className={styles.meta}
                  avatar={<Avatar src={item.user_type=='2'?admin:user} shape="square" size="large" />}
                  title={<a className={styles.title}>{item.username}</a>}
                />                
                <ListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* 编辑/添加模态框 */}
      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default connect(
  ({
    userList,
    loading,
  }: {
    userList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userList,
    loading: loading.models.users,
  })
)(BasicList);
