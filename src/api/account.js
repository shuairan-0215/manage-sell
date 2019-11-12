// 账号管理接口

// 引入
import req from "@/utils/request.js"

// 添加账号
export const addAccount = params => req.post("/account/accountadd", params)

// 获取账号列表
export const getAccountlist = params => req.get("/account/accountlist", params)

// 获取账号列表
export const delAccount = params => req.get("/account/accountdel", params)

// 获取账号列表
export const delAccountAll = params => req.get("/account/accountdelall", params)

// 编辑账号
export const editAccount = params => req.post("/account/accountedit", params)

// 登录账号
export const checkLogin = params => req.post("/account/checklogin", params)

// 检查旧密码是否正确
export const checkoldpwd = params => req.get("/account/checkoldpwd", params)

// 修改密码
export const passwordedit = params => req.post("/account/passwordedit", params)

// 获取个人中心账号列表
export const accountinfo = params => req.get("/account/accountinfo", params)

// 修改头像
export const avatareditImg = params => req.get("/account/avataredit", params)
