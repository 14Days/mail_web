import request from '@/utils/request';


//获取用户列表
export async function fetchUsers() {    
    return request('/api/user', {
        method: 'get',
    });
    
}

//获取用户列表
export async function getUserInfo(userID) {    
    return request('/api/user/'+userID, {
        method: 'get',        
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