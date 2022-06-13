import request from '../utils/request'

// 登录
export const loginUser = (data) => request.post('/acl/index/login', data)

// 退出
export const logoutUser = () => request.post('/acl/index/logout')
