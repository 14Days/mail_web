import { Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import styles from './index.less';
import user from '@/assets/img/user.png';

interface ArticleListContentProps {
  data: {
    content: React.ReactNode;
    updatedAt: number;
    avatar: string;
    from_user: string;
    send_time: string;
    from_addr: string;
    to_addr: string;
  };
}

const ArticleListContent: React.FC<ArticleListContentProps> = ({
  data: { content, from_addr, to_addr, send_time },
}) => (
  <div className={styles.listContent}>
    <div className={styles.description}>{content}</div>
    <div className={styles.extra}>
      <Avatar src={user} size="small" />
      <a>{from_addr}</a> 发送给 <a >{to_addr}</a>
      <em>{send_time}</em>
    </div>
  </div>
);

export default ArticleListContent;
