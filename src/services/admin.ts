import request from '@/utils/request';


//修改密码
export async function changePassword(userID,password,user_type,nickname,sex) {
    return request('/api/user/'+userID, {
        method: 'put',
        data:{
            password,
            user_type,
            nickname,
            sex,
        }
    });

}