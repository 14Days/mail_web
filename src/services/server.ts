import request from '@/utils/request';


//获取服务端参数
export async function getServeInfo() {
    return request('/api/server', {
        method: 'get',
    });

}

//设置POP3端口号
export async function changePop3(pop_port) {
    return request('/api/server', {
        method: 'put',
        data:{
            pop_port
        }
    });

}
//设置SMTP端口号
export async function changeSmtp(smtp_port) {
    return request('/api/server', {
        method: 'put',
        data:{
            smtp_port
        }
    });

}

//POP3服务启停
export async function changePop3State(pop_state) {
    return request('/api/server', {
        method: 'put',
        data:{
            pop_state
        }
    });

}
//SMTP服务启停
export async function changeSmtpState(smtp_state) {
    return request('/api/server', {
        method: 'put',
        data:{
            smtp_state
        }
    });

}