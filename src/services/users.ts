import request from '@/utils/request';
import { getUserURL } from '@/utils/url';


//获取用户列表
export async function fetchUsers() {    
    return request('/api/user', {
        method: 'get',
    });
    
}