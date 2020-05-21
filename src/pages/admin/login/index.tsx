import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './style.less';
import LoginFrom from './components/Login';



const Login: React.FC = (props) => {

 
  return (
    <div className={styles.main}>

      <div className={styles.desc}></div>
      <LoginFrom>
        
      </LoginFrom>
    </div>
  );
};

export default connect(
  ({
    loading,
  }: {
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    // userAndlogin,
    // submitting: loading.effects['userAndlogin/login'],
  }),
)(Login);
