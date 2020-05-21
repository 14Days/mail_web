import { Effect, Reducer } from 'umi';
import { changeUserInfo,fetchUsers,getUserInfo,deleteUser,register } from '@/services/users'
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
      const response = yield call(fetchUsers);  
      yield put({
        type: 'queryList',
        payload: {
          userList:Array.isArray(response.data.res) ? response.data.res : [],
          count:response.data.count,
        }
      });
    },
    *fetchUserInfo({ payload }, { call, put }) {
      const response = yield call(getUserInfo, payload);
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
    },
    *delete({ payload }, { call, put }) {
      // const response = yield call(deleteUser, payload);
    },
    *appendFetch({ payload }, { call, put }) {
      try{
        console.log(payload)
        const response = yield call(register, payload.username,payload.password);
        console.log(response)
        if (response.status === 'ok') showNotification('success', '创建用户成功');
      }catch(e){
        showNotification('error', '创建失败，用户名已存在或服务器错误');
      }
      
      // yield put({
      //   type: 'appendList',
      //   payload: {
      //     userList:Array.isArray(response) ? response : [],
      //     count:response.data.count,
      //   }
      // });
    },
    *submit({ payload }, { call, put }) {
      // let callback;
      // if (payload.id) {
      //   callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      // } else {
      //   callback = addFakeList;
      // }
      const response = yield call(changeUserInfo, payload.id,payload.nickname,payload.sex=='男'?1:2,payload.password,payload.user_type=='普通用户'?2:3); 
      console.log(response);      
      yield put({
        type: 'changeState',
        payload: response.msg,
      });
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
