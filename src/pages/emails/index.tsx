import React, { FC, useEffect } from 'react';
import { Button, Card, Col, Form, List, Row, Select, Tag } from 'antd';
import { LoadingOutlined, StarOutlined, LikeOutlined, MessageOutlined,MailOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import ArticleListContent from './components/ArticleListContent';
import { StateType } from './model';
import { ListItemDataType } from './data.d';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import mail from '@/assets/img/mail.svg'
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;

const pageSize = 5;

interface ArticlesProps {
  dispatch: Dispatch<any>;
  listAndsearchAndarticles: StateType;
  loading: boolean;
}
const Articles: FC<ArticlesProps> = ({ dispatch, listAndsearchAndarticles: { list }, loading }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch({
      type: 'listAndsearchAndarticles/fetch',
      payload: {
        count: 5,
      },
    });
  }, []);
  const setOwner = () => {
    form.setFieldsValue({
      owner: ['wzj'],
    });
  };

  const fetchMore = () => {
    dispatch({
      type: 'listAndsearchAndarticles/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  const owners = [
    {
      id: 'wzj',
      name: '我自己',
    },
    {
      id: 'wjh',
      name: '吴家豪',
    },
    {
      id: 'zxx',
      name: '周星星',
    },
    {
      id: 'zly',
      name: '赵丽颖',
    },
    {
      id: 'ym',
      name: '姚明',
    },
  ];

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

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
    },
  };

  const loadMore = list.length > 0 && (
    <div style={{ textAlign: 'center', marginTop: 16 }}>
      <Button onClick={fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        {loading ? (
          <span>
            <LoadingOutlined /> 加载中...
          </span>
        ) : (
          '加载更多'
        )}
      </Button>
    </div>
  );

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
          loading={list.length === 0 ? loading : false}
          rowKey="id"
          itemLayout="vertical"
          loadMore={loadMore}
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText key="star" type="star-o" text={item.star} />,
                <IconText key="like" type="like-o" text={item.like} />,
                <IconText key="message" type="message" text={item.message} />,
              ]}
              extra={<div className={styles.listItemExtra} />}
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
                // description={
                //   <span>
                //     <Tag>已读</Tag>
                //     {/* <Tag>设计语言</Tag>
                //     <Tag>蚂蚁金服</Tag> */}
                //   </span>
                // }
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
    listAndsearchAndarticles,
    loading,
  }: {
    listAndsearchAndarticles: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    listAndsearchAndarticles,
    loading: loading.models.listAndsearchAndarticles,
  }),
)(Articles);
