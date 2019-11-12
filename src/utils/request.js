// 通用的请求axios

// 引入库
import axios from "axios"
import qs from "qs"

// 按需引入组件
import { Message } from "element-ui"

// 引入本地存储工具函数
import local from "@/utils/local";


// 设置默认请求的接口地址
axios.defaults.baseURL = "http://127.0.0.1:5000"

// 请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么，例如加入token 统一做了处理如果以后要改也非常容易。

    // 所有的axios请求 在发送请求之前带上token
    let token = local.get("token")

    config.headers.Authorization = "Bearer " + token

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(function (response) {
    // 响应拦截器的作用是在接收到响应后进行一些操作，例如在服务器返回登录状态失效，需要重新登录的时候，跳转到登录页。

    let { code, msg } = response.data;

    if (code === 0) {
        Message({
            type: "success",
            message: msg
        })
    } else if (code === 1) {
        Message.error(msg)
    }
    return response;
}, error => {
    Message.error("网络请求发送错误，请稍后自再试")
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 导出两种方法
export default {
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, { params })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    post(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params))
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}



