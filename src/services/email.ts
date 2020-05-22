import request from '@/utils/request';


//获取用户列表
export async function sendEmails(content,subject) {
    return request('/api/mail/send', {
        method: 'post',
        data:{
            content,
            subject,
        }
    });

}