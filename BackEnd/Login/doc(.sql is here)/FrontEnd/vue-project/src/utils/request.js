import axios from "axios";

import.meta.env.VITE_APP_BASE_API

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development'
  ? '/api'
  : '/',
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data;
    if (code === 200) {
      return response.data;
    }
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response;
    }
    if (code !== 200 && msg) {
      //ElMessage.error(msg || "系统出错");
    }
    return Promise.reject(new Error(msg || "Error"));
  },
  (error) => {
    if (error.response.data) {
      const { code, msg } = error.response.data;
      // token 过期,重新登录
      if (code === "A0230") {
        // ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning",
        // }).then(() => {
        //   const userStore = useUserStoreHook();
        //   userStore.resetToken().then(() => {
        //     location.reload();
        //   });
        // });
      } else {
        // ElMessage.error(msg || "系统出错");
      }
    }
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;