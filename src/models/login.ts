import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import {getUserInfo} from '@/services/users'
import { message } from 'antd';
import { login } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';


export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  token?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
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

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
    token: undefined,
    type: undefined,
  },

  effects: {
    *userlogin({ payload }, { call, put }) {
      const { adminname, adminpwd } = payload;
      const response = yield call(login, adminname, adminpwd);      
      if (response.msg === 'success') {
        message.success('登录成功！');
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: response.msg,
            token: response.data.token,
            type: response.data.user_type,
          }
        });
        localStorage.setItem('token', response.data.token)
        sessionStorage.setItem('username',adminname)
        sessionStorage.setItem('password',adminpwd)
        const personalData = yield call(getUserInfo, 1);
        console.log(personalData);
        sessionStorage.setItem('nickname',personalData.data.nickname)
        sessionStorage.setItem('sex',personalData.data.sex=='1'?'男':'女')
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };

        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/users');
      }
      else {
        message.warning(response.msg)
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      localStorage.setItem('token', '')      
      sessionStorage.setItem('username','')
      sessionStorage.setItem('password','')
      if (window.location.pathname !== '/admin/login' && !redirect) {
        history.replace({
          pathname: '/admin/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        token: payload.token,
        type: payload.type,
      };
    },
  },
};

export default Model;
