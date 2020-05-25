import { Avatar } from 'antd';
import React,{useState,useRef} from 'react';
import moment from 'moment';
import styles from './index.less';
import user from '@/assets/img/user.png';

import OperationModal from './components/OperationModal';

interface ArticleListContentProps {
  data: {
    content: React.ReactNode;
    updatedAt: number;
    avatar: string;
    from_user: string;
    send_time: string;
    from_addr: string;
    to_addr: string;
    mail_id:number;
  };
  pageNumber:number;
}
const ArticleListContent: React.FC<ArticleListContentProps> = ({
  data: { content, from_addr, to_addr, send_time,mail_id} ,pageNumber 
}) => {  
  const [visible, setVisible] = useState<boolean>(false);
  
  return (
    <div className={styles.listContent}>
      <div className={styles.description}>{content}</div>
      <div className={styles.extra}>
        <Avatar src={user} size="small" />
        <a>{from_addr}</a> 发送给 <a >{to_addr}</a>
        <em>{send_time}</em>
        <a style={{marginLeft:"20px"}} onClick={()=>{setVisible(true)}}>删除</a>
      </div>
      <OperationModal
          mail_id={mail_id}
          visible={visible}
          pageNumber={pageNumber}
          onCancel={()=>{setVisible(false)}}
        />
    </div>
  )
};

export default ArticleListContent;
