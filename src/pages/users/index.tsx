import React, { FC, useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Radio,
} from 'antd';

import { findDOMNode } from 'react-dom';
import { connect, Dispatch } from 'umi';
import OperationModal from './components/OperationModal';
import { BasicListItemDataType } from './data.d';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

export interface StateType {
  list: BasicListItemDataType[];
}

interface BasicListProps {
  userList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
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
  data: { nickname, user_type, id },
}: {
  data: BasicListItemDataType;
}) => (
    <div className={styles.listContent}>

      <div className={styles.listContentItem}>
        <span>编号</span>
        <p>{id}</p>
      </div>
      <div className={styles.listContentItem}>
        <span >昵称</span>
        <p>{nickname}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>用户权限</span>
        <p>{user_type}</p>
      </div>
    </div>
  );

export const BasicList: FC<BasicListProps> = (props) => {

  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    userList: { list },
  } = props;

  console.log(props)
  const [done, setDone] = useState<boolean>(false);
  const [page, addPage] = useState(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<BasicListItemDataType> | undefined>(undefined);

  useEffect(() => {
    //获取用户列表  
    dispatch({
      type: 'userList/fetch',

    });
  }, [1]);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: 50,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: BasicListItemDataType) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    // dispatch({
    //   type: 'listAndbasicList/submit',
    //   payload: { id },
    // });
  };

  const editAndDelete = (key: string, currentItem: BasicListItemDataType) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除用户',
        content: '确定删除该用户吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <Search className={styles.extraContentSearch} placeholder="请输入用户邮箱" onSearch={() => ({})} />
    </div>
  );

  const MoreBtn: React.FC<{
    item: BasicListItemDataType;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
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
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: BasicListItemDataType) => {
    const id = current ? current.id : '';

    setAddBtnblur();

    setDone(true);
    // dispatch({
    //   type: 'listAndbasicList/submit',
    //   payload: { id, ...values },
    // });
  };

  return (
    <div>
      {/* <PageHeaderWrapper> */}
      <div className={styles.standardList}>
        <Card
          className={styles.listCard}
          bordered={false}
          title={<a className={styles.cardTitle}>用户管理</a>}
          style={{ marginTop: 34, marginLeft: 24, marginRight: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
          extra={extraContent}
        >
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            onClick={showModal}
            ref={addBtn}
          >
            <PlusOutlined />
              添加
            </Button>

          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a
                    key="edit"
                    onClick={(e) => {
                      e.preventDefault();
                      showEditModal(item);
                    }}
                  >
                    编辑
                    </a>,
                  <MoreBtn key="more" item={item} />,
                ]}
              >
                <List.Item.Meta className={styles.meta}
                  // avatar={<Avatar src={item.logo} shape="square" size="large" />}
                  title={<a className={styles.title}>{item.username}</a>}
                // description={<a className={styles.title}>15236205392@163.com"</a>}
                />
                <ListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </div>
      {/* </PageHeaderWrapper> */}

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
      models: { [key: string]: boolean };
    };
  }) => ({
    userList,
    loading: loading.models.users,
  }),
)(BasicList);
