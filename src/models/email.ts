import { history, Reducer, Effect } from 'umi';
import { sendEmails, getEmails,getEmailInfo } from '@/services/email'
import { ListItemDataType } from './data.d';
import { showNotification } from '@/utils/common';


export interface StateType {
  list: ListItemDataType[];
}

export interface EmailModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    sendemails: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: EmailModelType = {
  namespace: 'email',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try{
        const response = yield call(getEmails,payload)
        let mails=response.data.res;
        let i=0,len=mails.length;
        for(;i<len;i++){
          const res=yield call(getEmailInfo,mails[i].mail_id)          
          mails[i]["content"]=res.data.content
          mails[i]["from_addr"]=res.data.from_addr
          mails[i]["to_addr"]=res.data.to_addr.length>1?'所有用户':res.data.to_addr
        }     
        yield put({
          type: 'queryList',
          payload: Array.isArray(response.data.res) ? response.data.res : [],
        });
      }catch(e){        
        history.replace('/admin/login');
      }
    },
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
          // showNotification('error', '没有权限或登陆已过期');        
          history.replace('/admin/login');
        }
      },
    },
    reducers: {
      queryList(state, action) {
        return {
          ...state,
          list: action.payload,
        };
      },
      appendList(state, action) {
        return {
          ...state,
          list: (state as StateType).list.concat(action.payload),
        };
      },
    },
};

export default Model;
