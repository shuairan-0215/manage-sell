/* 店铺管理接口 */ 

import req from '@/utils/request'

// 获取店铺列表
export const getshop = () => req.get('/shop/shopinfo')

// 修改店铺
export const shopedit = params => req.post('/shop/shopedit', params)