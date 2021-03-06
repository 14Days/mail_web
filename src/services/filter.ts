import request from '@/utils/request';


//拉黑ip
export async function ipFilter(address) {
    return request('/api/filter', {
        method: 'post',
        data:{
            address
        }
    });

}
//获取拉黑ip
export async function getIP() {
    return request('/api/filter', {
        method: 'get',
    });

}
//取消拉黑ip
export async function deleteIP(id) {
    return request('/api/filter', {
        method: 'delete',
        data:{
            id
        }
    });

}