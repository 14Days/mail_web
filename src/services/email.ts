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
export async function getEmails(limit,page) {
    return request('/api/mail/receive', {
        method: 'get',
    });

}

//获取邮件详情
export async function getEmailInfo(mailID) {
    return request('/api/mail/receive/'+mailID, {
        method: 'get',
    });

}

//删除邮件
export async function deleteEmail(mailID) {
    return request('/api/mail/receive/'+mailID, {
        method: 'delete',
    });

}



