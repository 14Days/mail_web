import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Link, useIntl, ConnectProps, connect } from 'umi';
import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ConnectState } from '@/models/connect';
import image from './img/img3.svg'
import mailbox from './img/mailbox.svg'
import avatar from './img/avatar.svg'
import styles from './UserLayout.less'; 
import { PageHeader, Button,Tooltip,Card } from 'antd';


export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return ( 
       
      <div className={styles.container}>
      <PageHeader
        title="邮 件 管 理 系 统"
        className="site-page-header"
        extra={[
          <Tooltip title="使用文档"  >
            <a
              target="_blank"
              href="/home"
              rel="noopener noreferrer"
              className={styles.action}
            >
            <QuestionCircleOutlined style={{marginRight:"25px"}}/>
          </a>
          </Tooltip>
        ]}
        avatar={{ src:mailbox }}
      >
        </PageHeader>
        <div className={styles.desc}></div>
        <div className={styles.content}>
          <div className={styles.row}>
            <div className={styles.column}>
              <img alt="" src={image} className={styles.img}></img>
            </div>
            
            <div className={styles.column}>
              <Card hoverable={true} bordered={true} style={{marginLeft:"20px",marginRight:"20px"}}>
                  <div className={styles.top}>
                    <img alt="avatar" className={styles.avatar} src={avatar} />
                    <div className={styles.header}>
                      <span className={styles.title}>管 理 员 登 陆</span>
                    </div>

                  <div className={styles.desc}></div>
                  </div>
                  {children}               
              </Card>
            </div>
          </div>
        </div>
        {/* <DefaultFooter /> */}
      </div>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
