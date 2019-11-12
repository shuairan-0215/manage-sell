/* 订单管理接口 */

import req from '@/utils/request'

// 获取订单列表
export const getOrderList = params => req.get('/order/orderlist', params)

// 订单详情
export const editOrder = params => req.post('/order/orderedit', params)

// 订单统计
export const ordertotal = params => req.get('/order/ordertotal', params)