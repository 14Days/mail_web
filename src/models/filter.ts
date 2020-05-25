import { history, Reducer, Effect } from 'umi';
import { ListItemDataType } from './data.d';
import { showNotification } from '@/utils/common';
import {ipFilter,getIP,deleteIP} from '@/services/filter'


export interface StateType {
  list: ListItemDataType[];
}

export interface EmailModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    pullback: Effect;
    delete:Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: EmailModelType = {
  namespace: 'filter',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try{
        const response = yield call(getIP)
        let msg=response.msg;
        if(msg!='success'&&msg)
            showNotification('warning', msg);        
        yield put({
          type: 'queryList',
          payload: Array.isArray(response.data.res) ? response.data.res : [],
        });
      }catch(e){        
        showNotification('success', '服务器错误')
        history.replace('/admin/login');
      }
    },
    // 拉黑ip
    *pullback({ payload }, { call, put }) {
        try{          
          const response =yield call(ipFilter,payload)
          console.log(response)
          let msg=response.msg;
          if(msg=='success')
            showNotification('success', response.data)
          if(msg!='success'&&msg)
            showNotification('error', "IP地址不合法");
          const res = yield call(getIP)
          msg=res.msg;
          if(msg!='success'&&msg)
            showNotification('warning', msg);        
          yield put({
          type: 'queryList',
          payload: Array.isArray(res.data.res) ? res.data.res : [],
          });
        }catch(e){     
          showNotification('success', '没有权限')
          history.replace('/admin/login');
        }
      },
      *delete({ payload }, { call, put }) {
        try{
          const response = yield call(deleteIP,payload);
          console.log(payload)
          let msg=response.msg;
          if(msg=='success')
            showNotification('success', response.data)
          if(msg!='success'&&msg)
            showNotification('warning', msg);
          const res = yield call(getIP)
            
          yield put({
            type: 'queryList',
            payload: Array.isArray(res.data.res) ? res.data.res : [],
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
          list: action.payload,
        };
      },
    },
};

export default Model;
