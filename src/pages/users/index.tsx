import React, { FC, useRef, useState, useEffect } from 'react';
import { PlusOutlined,BellOutlined } from '@ant-design/icons';
import { Button, Card, Input, List, Avatar,Modal } from 'antd';
import { findDOMNode } from 'react-dom';
import { connect, Dispatch } from 'umi';
import OperationModal from './components/OperationModal';
import NoticeModal from './components/NoticeModal';
import { BasicListItemDataType } from './data.d';
import blackhouse from '@/assets/img/blackhouse.png';
import user from '@/assets/img/user.png';
import styles from './style.less';
import User from '@/assets/img/user.svg'
const { Search } = Input;

export interface StateType {
  list: BasicListItemDataType[];
  count: number;
  currentPage: number;
  queryName: string;
}
interface BasicListProps {
  userList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
  count: number;
  page:number;
}

const ListContent = ({
  data: { nickname, user_type  },
}: {
  data: BasicListItemDataType;
}) => {
  let userType;
  if(user_type=='1')
    userType='管理员';
  else if(user_type=='2')
    userType='普通用户';
  else
    userType='小黑屋';
  return(
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>昵称</span>
        <p>{nickname}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>权限</span>
        <p>{userType}</p>
      </div>
    </div>
  );
}

export const BasicList: FC<BasicListProps> = props => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    userList: { list, count, currentPage, queryName },
  } = props;
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<string | undefined>(undefined);
  const [userid, setUserid] = useState<string | undefined>(undefined);
  const [NoticeModalVisible,setModalVisible] = useState<boolean>(false);
  const [pageNumber, setPage] = useState<number>(currentPage)
  console.log("currentPage:",currentPage);
  
  useEffect(() => {
    //获取用户列表
    dispatch({
      type: 'userList/fetch',
      payload: {
        page:0,
        limit:5
      }
    });
  }, [1]);
  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: string) => {
    setVisible(true);
    setCurrent(item);
  };

 
  const extraContent = (
    <div className={styles.extraContent}>      
      <Search
        className={styles.extraContentSearch}
        placeholder="请输入用户邮箱"
        onSearch={(value) => { 
            dispatch({
              type:'userList/query',
              payload:{
                value,
                pageNumber,
              }
            })
        }}
        onChangeCapture={
          (e)=>{
            dispatch({
              type:'userList/query',
              payload:{
                value:e.target.value,
                pageNumber,
              }
            })
          }
        }
      />
      <Button icon={<BellOutlined /> } 
          style={{marginRight:"10px"}} type="primary"
          onClick={()=>{setModalVisible(true)}}
      >
            发送通知
      </Button>
    </div>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
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
        payload: {pageNumber, id, ...values },
      });
    }
    else{  
      dispatch({
        type: 'userList/appendFetch',
        payload: {
          ...values ,
          pageNumber:pageNumber
        },
      });
      
    }    
    setVisible(false);
  };
  const handleNotice = (values: BasicListItemDataType) => {
    setAddBtnblur();   
    console.log(values);
    
      dispatch({
        type: 'email/sendemails',
        payload: {...values },
      });
      setModalVisible(false);
    }    


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
          className={styles.cardTitle}
          bordered={false}
          title={<a className={styles.cardTitle}><img src={User} style={{marginRight:"10px"}}></img>用户管理</a>}
          style={{
            marginTop: 24,
          }}          
          bodyStyle={{ padding: '0px 32px 32px 32px' }}
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
            pagination={{
               onChange : (page)=>{
                setPage(page-1)                
                queryName?dispatch({
                  type: 'userList/query',
                  payload: {
                    value:queryName,
                    pageNumber:page-1
                  }
                }): dispatch({
                  type: 'userList/fetch',
                  payload: {
                    page:page-1,
                    limit:5
                  }
                });            
              },
              pageSize:5,
              total:count,             
            }}
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
                    key="delete" 
                    onClick={e=> {
                      handleModalVisible(true);
                      setUserid(item.id)
                    }}
                  >
                    删除
                  </a>,
                ]}
              >
                <List.Item.Meta
                  className={styles.meta}
                  avatar={<Avatar src={item.user_type=='3'?blackhouse:user} shape="square"  />}
                  title={<a className={styles.title}>{item.username}@wghtstudio.cn</a>}
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
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
      <Modal
        destroyOnClose
        title={'删除用户'}
        visible={createModalVisible}
        onOk={(value) => {  
          console.log("pageNumber:",pageNumber);
                            
          dispatch({
            type:'userList/delete',
            payload:{
              userid,
              pageNumber:count-pageNumber*5==1?pageNumber-1:pageNumber,
            }
          });
          handleModalVisible(false)
        }}
        onCancel={() => handleModalVisible(false)}
        >
          <p style={{textAlign:'center',fontSize:'16px'}}>
              确定删除该用户？
          </p>        
      </Modal>
      <NoticeModal
        visible={NoticeModalVisible}
        onCancel={()=>{setModalVisible(false)}}
        onSubmit={handleNotice}
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
