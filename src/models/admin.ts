import { Effect, history } from 'umi';

import { changePassword } from '@/services/admin';
import { showNotification } from '@/utils/common';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'admin';
  state: UserModelState;
  effects: {
    changepassword: Effect;
  };
}

const UserModel: UserModelType = {
  namespace: 'admin',

  state: {
    currentUser: {},
  },

  effects: {
    *changepassword({payload}, { call, put }) {
        try{
            const response = yield call(changePassword,payload.user_id,payload.password,payload.user_type,payload.nickname,payload.sex=='男'?1:2);
            console.log(response)
            let msg=response.msg;
            if(msg!='success'&&msg)
                showNotification('warning', msg);
            if(msg=='success'){
                showNotification('success','密码修改成功')
                history.replace('/admin/login');
                localStorage.setItem('token', '')      
                sessionStorage.setItem('username','')
                sessionStorage.setItem('password','')
                sessionStorage.setItem('user_id','')
                sessionStorage.setItem('nickname','')
                sessionStorage.setItem('sex','')
            }
                
        }catch(e){
            history.replace('/admin/login');
        }   
           
    },
  },

 
};

export default UserModel;
