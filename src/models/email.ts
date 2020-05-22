import { history, Reducer, Effect } from 'umi';
import { sendEmails } from '@/services/email'

import { showNotification } from '@/utils/common';


export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface EmailModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: EmailModelType = {
  namespace: 'email',

  state: {
    status: undefined,
    type: undefined,
  },

  effects: {
    // 群发邮件
    *sendemails({ payload }, { call, put }) {
        try{
          const {subject,content}=payload
          const response = yield call(sendEmails,content,subject);
          console.log(response)
          let msg=response.msg;
          if(msg=='success')
            showNotification('success', response.data)
          if(msg!='success'&&msg)
            showNotification('warning', msg);
        //   yield put({
        //     type: 'queryList',
        //     payload: {
        //       userList:Array.isArray(response.data.res) ? response.data.res : [],
        //       count:response.data.count,
        //     }
        //   });
        }catch(e){
          showNotification('error', '没有权限或登陆已过期');        
        //   history.replace('/admin/login');
        }
      },
    }

//   reducers: {
    
//   },
};

export default Model;
