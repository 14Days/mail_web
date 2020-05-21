import request from '@/utils/request';



export async function login(username, password) {
  return request('/api/login', {
    method: 'post',
    data: {
      username,
      password,
    },
  });
}

