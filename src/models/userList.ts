import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { changeUserInfo,fetchUsers,getUserInfo,deleteUser,register,queryUser } from '@/services/users'
import { BasicListItemDataType } from './data';
import { showNotification } from '@/utils/common';

export interface StateType {
  list: BasicListItemDataType[];
  count: number;
  info:  Partial<BasicListItemDataType> | undefined;
  msg: string
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
    fetchUserInfo: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
    infoList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userList',

  state: {
    list: [],
    count:0,
    info: undefined,
    msg: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try{
        const response = yield call(fetchUsers);
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);
        yield put({
          type: 'queryList',
          payload: {
            userList:Array.isArray(response.data.res) ? response.data.res : [],
            count:response.data.count,
          }
        });
      }catch(e){
        showNotification('error', '没有权限或登陆已过期');        
        history.replace('/admin/login');
      }
    },
    *fetchUserInfo({ payload }, { call, put }) {
      try{
        const response = yield call(getUserInfo, payload);
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);
        const temp={
          nickname:response.data.nickname,
          username:response.data.username,
          sex:response.data.sex==1?'男':'女',
          user_type:response.data.user_type==2?'普通用户':'拉黑'
        }
        yield put({
          type: 'infoList',
          payload: temp
        });
      }
      catch(e){
        showNotification('error', '没有权限或登陆已过期');        
        history.replace('/admin/login');
      }
    },

    *query({ payload }, { call, put }) {
      try{
        const response = yield call(queryUser, payload);
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);
        yield put({
          type: 'queryList',
          payload: {
            userList:Array.isArray(response.data.res) ? response.data.res : [],
            count:response.data.count,
          }
        });
      }
      catch(e){
        showNotification('error', '没有权限或登陆已过期');        
        history.replace('/admin/login');
      }
    },

    *delete({ payload }, { call, put }) {
      let msg
      try{
        const response = yield call(deleteUser, payload);
        console.log
        msg=response.msg
        if (response.msg === 'success') showNotification('success', '删除用户成功');
        else if(msg) showNotification('success', msg);
        const res = yield call(fetchUsers);
        yield put({
          type: 'queryList',
          payload: {
            userList:Array.isArray(res.data.res) ? res.data.res : [],
            count:res.data.count,
          }
        });
      }catch(e){
        showNotification('error', '创建失败，用户已不存在或服务器错误');
      }
      
    },
    *appendFetch({ payload }, { call, put }) {      
      let msg;
      try{
        console.log(payload)
        const response = yield call(register, payload.username,payload.password);
        console.log(response)
        msg=response.msg
        if (response.msg === 'success') showNotification('success', '创建用户成功');
        else if(msg) showNotification('success', msg);
        const res = yield call(fetchUsers);
        yield put({
          type: 'queryList',
          payload: {
            userList:Array.isArray(res.data.res) ? res.data.res : [],
            count:res.data.count,
          }
        });
      }catch(e){
        showNotification('error', msg);
      }
      
    },
    *submit({ payload }, { call, put }) {
      let msg;
      try{
        const response = yield call(changeUserInfo, payload.id,payload.nickname,payload.sex=='男'?1:2,payload.password,payload.user_type=='普通用户'?2:3);
        console.log(response)
        msg=response.msg;
        if (response.msg === 'success') showNotification('success', '用户信息修改成功');
        else if(msg) showNotification('success', msg);
        const res = yield call(fetchUsers);
        yield put({
          type: 'queryList',
          payload: {
            userList:Array.isArray(res.data.res) ? res.data.res : [],
            count:res.data.count,
          }
        });
      }catch(e){
        showNotification('error', msg);
      }

      
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        list: payload.userList,
        count: payload.count,
      };
    },
    infoList(state, { payload }) {
      return {
        ...state,
        info: payload
      };
    },
    changeState(state,{payload}){
      return{
        ...state,
        msg:payload
      }
    },
    appendList(state = { list: [] }, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

export default Model;
