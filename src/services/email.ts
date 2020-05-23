import request from '@/utils/request';


//群发邮件
export async function sendEmails(content,subject) {
    return request('/api/mail/send', {
        method: 'post',
        data:{
            content,
            subject,
        }
    });

}


//获取邮件列表
export async function getEmails(limit) {
    return request('/api/mail/receive', {
        method: 'get',
        params:limit
    });

}

//获取邮件详情
export async function getEmailInfo(mailID) {
    return request('/api/mail/receive/'+mailID, {
        method: 'get',
    });

}

