import { history, Reducer, Effect } from 'umi';
import { showNotification } from '@/utils/common';
import { changePop3,getServeInfo,changePop3State,changeSmtpState,changeSmtp } from '@/services/server'

export interface StateType {
  pop_port:string;
  pop_state:boolean;
  smtp_port:string;
  smtp_state:boolean;
}

export interface ServerModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    changePop3: Effect;
    changeSmtp: Effect;
    changePop3State: Effect;
    changeSmtpState: Effect;
  };
  reducers: {
    serverList: Reducer<StateType>;
  };
}

const Model: ServerModelType = {
  namespace: 'server',

  state: {
    pop_port:'',
    pop_state:false,
    smtp_port:'',
    smtp_state:false,
  },

  effects: {
    *changePop3State({ payload }, { call, put }){
      try{
        console.log(payload);        
        const response = yield call(changePop3State,payload)
        console.log(response);
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);   
        else
          showNotification('success', payload?'POP3服务已开启':'POP3服务已暂停');   
        const res = yield call(getServeInfo) 
        yield put({
          type: 'serverList',
          payload: res.data,
        });
      }catch(e){
        showNotification('success', '服务器错误')
        history.replace('/admin/login');
      }
    },
    *changeSmtpState({ payload }, { call, put }){
      try{
        console.log(payload);        
        const response = yield call(changeSmtpState,payload)
        console.log(response);
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);   
        else
          showNotification('success', payload?'SMTP服务已开启':'SMTP服务已暂停');   
        const res = yield call(getServeInfo) 
        yield put({
          type: 'serverList',
          payload: res.data,
        });
      }catch(e){
        showNotification('success', '服务器错误')
        history.replace('/admin/login');
      }
    },
    *changePop3({ payload }, { call, put }){
      try{
        console.log(payload);        
        const response = yield call(changePop3,payload)
        console.log(response);
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);   
        else
          showNotification('success', "设置成功");  
        const res = yield call(getServeInfo) 
        yield put({
          type: 'serverList',
          payload: res.data,
        });
      }catch(e){
        showNotification('success', '服务器错误')
        history.replace('/admin/login');
      }
    },
    *changeSmtp({ payload }, { call, put }){
      try{
        console.log(payload);        
        const response = yield call(changeSmtp,payload)
        console.log(response);
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);   
        else
          showNotification('success', "设置成功");  
        const res = yield call(getServeInfo) 
        yield put({
          type: 'serverList',
          payload: res.data,
        });
      }catch(e){
        showNotification('success', '服务器错误')
        history.replace('/admin/login');
      }
    },

    *fetch({ payload }, { call, put }) {
      try{
        const response = yield call(getServeInfo)
        console.log(response);
        
        let msg=response.msg;
        if(msg!='success'&&msg)
            showNotification('warning', msg);        
        yield put({
          type: 'serverList',
          payload: response.data,
        });
      }catch(e){        
        showNotification('success', '服务器错误')
        history.replace('/admin/login');
      }
    },
     
    },
    reducers: {
      serverList(state, action) {
        return {
          ...state,
          pop_port: action.payload.pop_port,
          pop_state: action.payload.pop_state,
          smtp_port: action.payload.smtp_port,
          smtp_state: action.payload.smtp_state,
        };
      },
    },
};

export default Model;
