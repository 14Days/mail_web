import { history, Reducer, Effect } from 'umi';
import { sendEmails, getEmails,getEmailInfo,deleteEmail } from '@/services/email'
import { ListItemDataType } from './data.d';
import { showNotification } from '@/utils/common';


export interface StateType {
  list: ListItemDataType[];
  count:number;
}

export interface EmailModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    sendemails: Effect;
    delete:Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: EmailModelType = {
  namespace: 'email',

  state: {
    list: [],
    count: 0,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try{
        const response = yield call(getEmails,payload.limit,payload.page)
        console.log(response);
        
        let mails=response.data.res;
        let i=0,len=mails.length;
        let msg=response.msg;
        if(msg!='success'&&msg)
            showNotification('warning', msg);
        for(;i<len;i++){
          const res=yield call(getEmailInfo,mails[i].mail_id)          
          mails[i]["content"]=res.data.content
          mails[i]["from_addr"]=res.data.from_addr
          mails[i]["to_addr"]=res.data.to_addr.length>1?'所有用户':res.data.to_addr
          mails[i]["title"]=res.data.subject
        }     
        yield put({
          type: 'queryList',
          payload: {
            list:Array.isArray(response.data.res) ? response.data.res : [],
            count:response.data.count,
          }

        });
      }catch(e){        
        showNotification('warning','没有权限' );
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
        }catch(e){     
          showNotification('warning','没有权限' );
          history.replace('/admin/login');
        }
      },
      *delete({ payload }, { call, put }) {
        try{
          console.log(payload)
          const response = yield call(deleteEmail,payload.mail_id);
          console.log(response)
          let msg=response.msg;
          if(msg=='success')
            showNotification('success', response.data)
          if(msg!='success'&&msg)
            showNotification('warning', msg);
          const res = yield call(getEmails,4,payload.pageNumber)
          let mails=res.data.res;
          let i=0,len=mails.length;
          msg=res.msg;
          if(msg!='success'&&msg)
              showNotification('warning', msg);
            for(;i<len;i++){
              const res=yield call(getEmailInfo,mails[i].mail_id)          
              mails[i]["content"]=res.data.content
              mails[i]["from_addr"]=res.data.from_addr
              mails[i]["to_addr"]=res.data.to_addr.length>1?'所有用户':res.data.to_addr   
              mails[i]["title"]=res.data.subject         
          }     
          yield put({
            type: 'queryList',
            payload: {
              list:Array.isArray(res.data.res) ? res.data.res : [],
              count:res.data.count,
            }
          });
        }catch(e){  
          showNotification('warning','没有权限' );
          history.replace('/admin/login');
        }
      }
    },
    reducers: {
      queryList(state, action) {
        return {
          ...state,
          list: action.payload.list,
          count: action.payload.count,
        };
      },
    },
};

export default Model;
