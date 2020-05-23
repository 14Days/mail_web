import React, { FC, useEffect } from 'react';
import { Button, Card, Col, Form, List, Row, Select, Tag } from 'antd';
import { LoadingOutlined, StarOutlined, LikeOutlined, MessageOutlined,MailOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import ArticleListContent from './components/ArticleListContent';
import { Collapse } from 'antd';
const { Panel } = Collapse;
import { ListItemDataType } from './data.d';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import mail from '@/assets/img/mail.svg'
import styles from './style.less';

export interface StateType {
  list: ListItemDataType[];
}

const { Option } = Select;
const FormItem = Form.Item;

const pageSize = 5;

interface ArticlesProps {
  dispatch: Dispatch<any>;
  email: StateType;
  loading: boolean;
}
const Articles: FC<ArticlesProps> = ({ dispatch, email: { list }, loading }) => {
  console.log(list);
  
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch({
      type: 'email/fetch',
      payload: '2'
    });
  }, []);

  const fetchMore = () => {
    dispatch({
      type: 'listAndsearchAndarticles/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };


  const IconText: React.FC<{
    type: string;
    text: React.ReactNode;
  }> = ({ type, text }) => {
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      case 'like-o':
        return (
          <span>
            <LikeOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      case 'message':
        return (
          <span>
            <MessageOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      default:
        return null;
    }
  };


  // const loadMore = list.length > 0 && (
  //   <div style={{ textAlign: 'center', marginTop: 16 }}>
  //     <Button onClick={fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
  //       {loading ? (
  //         <span>
  //           <LoadingOutlined /> 加载中...
  //         </span>
  //       ) : (
  //         '加载更多'
  //       )}
  //     </Button>
  //   </div>
  // );

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
          // loadMore={loadMore}
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              key={item.mail_id}
              // actions={[
              //   <IconText key="star" type="star-o" text={item.star} />,
              //   <IconText key="like" type="like-o" text={item.like} />,
              //   <IconText key="message" type="message" text={item.message} />,
              // ]}
              // extra={<div className={styles.listItemExtra} />}
              style={{marginBottom:"15px"}}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={item.href}>
                    <MailOutlined style={{marginRight:"10px"}} />
                      {item.title}
                  <span style={{marginLeft:"15px"}}>
                    <Tag>已读</Tag>
                  </span>
                  </a>
                }
              />
              <ArticleListContent data={item} />
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
