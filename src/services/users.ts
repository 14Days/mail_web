import request from '@/utils/request';


//获取用户列表
export async function fetchUsers(limit,page) {
    return request('/api/user', {
        method: 'get',
        params:{
            limit,
            page,
        }
    });

}

//注册用户register
export async function register(username,password) {
    return request('/api/register', {
        method: 'post',
        data: {
            username,
            password,
        },
    });

}

//获取用户详细信息
export async function getUserInfo(userID) {
    return request('/api/user/'+userID, {
        method: 'get',
    });

}

//查询用户
export async function queryUser(username) {
    return request('/api/user', {
        method: 'get',
        params:{
          username,
        }
    });

}


//修改用户信息
export async function changeUserInfo(userID,nickname,sex,password,user_type) {
    return request('/api/user/'+userID, {
        method: 'put',
        data:{
            nickname,
            sex,
            password,
            user_type,
        }
    });

}

//修改用户信息
export async function deleteUser(userID) {
    return request('/api/user/'+userID, {
        method: 'delete',
    });

}
