import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { changeUserInfo,fetchUsers,getUserInfo,deleteUser,register,queryUser } from '@/services/users'
import { BasicListItemDataType } from './data';
import { showNotification } from '@/utils/common';
import {ipFilter} from '@/services/filter'
export interface StateType {
  list: BasicListItemDataType[];
  count: number;
  info:  Partial<BasicListItemDataType> | undefined;
  msg: string;
  currentPage: number;
  queryName: string;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
    fetchUserInfo: Effect;
    query:Effect;
    delete:Effect;
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
    currentPage: 0,
    queryName: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try{
        const response = yield call(fetchUsers,payload.limit,payload.page);  
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);
        yield put({
          type: 'queryList',
          payload: {
            userList:Array.isArray(response.data.res) ? response.data.res : [],
            count:response.data.count,
            currentPage:payload.page
          }
        });
      }catch(e){     
        showNotification('warning', '没有权限');   
        history.replace('/admin/login');
      }
    },
    *fetchUserInfo({ payload }, { call, put }) {
      try{
        const response = yield call(getUserInfo, payload);
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);
        let userType;
        if(response.data.user_type=='1')
          userType='管理员';
        else if(response.data.user_type=='2')
          userType='普通用户';
        else
          userType='小黑屋';
        const temp={
          nickname:response.data.nickname,
          username:response.data.username,
          sex:response.data.sex==1?'男':'女',
          user_type:userType
        }
        yield put({
          type: 'infoList',
          payload: temp
        });
      }
      catch(e){     
        showNotification('warning', '没有权限');  
        history.replace('/admin/login');
      }
    },

    *query({ payload }, { call, put }) {
      try{
        const response = yield call(queryUser, payload.value,5,payload.pageNumber);
        let msg=response.msg;
        if(msg!='success'&&msg)
          showNotification('warning', msg);
        yield put({
          type: 'queryList',
          payload: {
            userList:Array.isArray(response.data.res) ? response.data.res : [],
            count:response.data.count,
            currentPage:payload.pageNumber,
            queryName:payload.value,
          }
        });
      }
      catch(e){       
        showNotification('warning', '没有权限');  
        history.replace('/admin/login');
      }
    },

    *delete({ payload }, { call, put }) {
      let msg
      try{
        const response = yield call(deleteUser, payload.userid);
        console.log(payload.pageNumber)
        msg=response.msg
        if (response.msg === 'success') showNotification('success', '删除用户成功');
        else if(msg) showNotification('error', msg);
        const res = yield call(fetchUsers,5,payload.pageNumber);
        yield put({
          type: 'queryList',
          payload: {
            userList:Array.isArray(res.data.res) ? res.data.res : [],
            count:res.data.count,
            currentPage:payload.pageNumber
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
        if (response.msg === 'success') 
        {
          showNotification('success', '创建用户成功');
          const res = yield call(fetchUsers,5,payload.pageNumber);
          yield put({
            type: 'queryList',
            payload: {
              userList:Array.isArray(res.data.res) ? res.data.res : [],
              count:res.data.count,
              currentPage:payload.pageNumber              
            }
          });
        }
        else if(msg){
          showNotification('error', msg);
        } 
        
      }catch(e){
        showNotification('warning', '没有权限');  
      }
      
    },
    *submit({ payload }, { call, put }) {
      let msg;
      try{
        let user_type=2;
        if(payload.user_type=='管理员'){
          user_type=1
        }else if(payload.user_type=='普通用户'){
          user_type=2
        }else
          user_type=3
        
        const response = yield call(changeUserInfo, payload.id,payload.nickname,payload.sex=='男'?1:2,payload.password,user_type);
        console.log(response)
        msg=response.msg;
        if (response.msg === 'success') showNotification('success', '用户信息修改成功');
        else if(msg) showNotification('success', msg);
        
        const res = yield call(fetchUsers,5,payload.pageNumber);
        yield put({
          type: 'queryList',
          payload: {
            userList:Array.isArray(res.data.res) ? res.data.res : [],
            count:res.data.count,
            currentPage:payload.pageNumber
          }
        });
      }catch(e){
        showNotification('warning', '没有权限');  
      }

      
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        list: payload.userList,
        count: payload.count,
        currentPage: payload.currentPage,
        queryName: payload.queryName,
      };
    },
    infoList(state, { payload }) {
      return {
        ...state,
        info: payload
      };
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
