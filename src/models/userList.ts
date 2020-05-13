import { Effect, Reducer } from 'umi';
import { addFakeList, queryFakeList, removeFakeList, updateFakeList } from './service';
import { fetchUsers } from '@/services/users'
import { BasicListItemDataType } from './data';

export interface StateType {
  list: BasicListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userList',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchUsers);
      console.log(response)
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data.res) ? response.data.res : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
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
