import React, { FC, useEffect, useState } from 'react';
import { Card, List, Modal } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import ArticleListContent from './components/ArticleListContent';
import { ListItemDataType } from './data.d';
import mail from '@/assets/img/mail.svg'
import styles from './style.less';

export interface StateType {
  list: ListItemDataType[];
}


interface ArticlesProps {
  dispatch: Dispatch<any>;
  email: StateType;
  loading: boolean;
}
const Articles: FC<ArticlesProps> = ({ dispatch, email: { list,count }, loading }) => {
  
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);  
  const [pageNumber, setPage] = useState<number>(0)
  const [mailId,setMailId] = useState<number>(0)
  useEffect(() => {
    dispatch({
      type: 'email/fetch',
      payload: {
        limit:4,
        page:pageNumber
      }
    });
  }, [1]);


  return (
    <>      
      <Card
        title={<a className={styles.cardTitle}><img alt="mail" src={mail} style={{marginRight:"10px"}}></img>邮件列表</a>}
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
         <List<ListItemDataType>
          size="large"
          style={{marginRight:"10px",marginLeft:"20px"}}
          loading={list.length === 0 ? loading : false}
          rowKey="id"
          itemLayout="vertical"
          pagination={{
            onChange : (page)=>{
             setPage(page-1)             
             dispatch({
               type: 'email/fetch',
               payload: {
                 page:page-1,
                 limit:4
               }
             });            
           },
           pageSize:4,
           total:count,             
         }}
          // loadMore={loadMore}
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              key={item.mail_id}
              style={{marginBottom:"15px"}}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={item.href}>
                    <MailOutlined style={{marginRight:"10px"}} />
                      {item.title}
                  <span style={{marginLeft:"15px"}}>
                    {/* <Tag color={item.is_read?'blue':'red'}>{item.is_read?'已读':'未读'}</Tag> */}
                  </span>
                  </a>
                }
              />
              <ArticleListContent data={item} pageNumber={count-pageNumber*4==1?pageNumber-1:pageNumber} />
            </List.Item>
          )}
        />
      </Card>
     
    </>
  );
};

export default connect(
  ({
    email,
    loading,
  }: {
    email: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    email,
    loading: loading.models.email,
  }),
)(Articles);
