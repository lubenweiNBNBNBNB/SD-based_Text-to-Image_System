import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue"; // 确保路径正确
import Login from "@/components/Login.vue"; // 导入登录组件
import AppInterface from "@/components/AppInterface.vue"; // 导入应用界面组件
import UserProfile from "@/components/UserProfile.vue"; // 导入用户信息组件
import UserImages from "@/components/UserImages.vue"; // 导入用户历史图片组件
import Signup from "@/components/signup.vue";
import BackendManagement from "@/components/BackComponents/BackendManagement.vue";
const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login }, // 添加登录路由
  { path: "/app", component: AppInterface, meta: { requiresAuth: true } }, // 需要身份验证的路由
  { path: "/user", component: UserProfile, meta: { requiresAuth: true } }, // 个人信息页面的路由
  {
    path: "/user-images",
    component: UserImages,
    meta: { requiresAuth: true },
    name: "UserImages",
  }, // 用户历史图片页面的路由
  { path: "/signup", component: Signup }, // 注册页面的路由
  {
    path: "/backend",
    component: BackendManagement,
    meta: { hideHeader: true },
    children: [
      // 首页
      {
        path: "/dashboard",
        name: "Dashboard",
        component: BackendManagement,
        // component: () => import("../views/index/Dashboard.vue"),
        meta: { title: "首页" },
      },
      // 基础数据--->专业信息、小组信息
      {
        path: "/basic",
        name: "Basic",
        // component: Layout,
        meta: { title: "基础数据" },
        children: [
          {
            path: "/basic/introduce",
            name: "Introduce",
            //component: () => import("../views/basic/Faculty.vue"),
            meta: { title: "专业信息" },
          },
          {
            path: "/basic/major",
            name: "Major",
            //component: () => import("../views/basic/Major.vue"),
            meta: { title: "小组信息" },
          },
        ],
      },
      // 用户管理
      {
        path: "/User",
        name: "User",
        // component: Layout,
        meta: { title: "用户管理", hideHeader: true },
        children: [
          {
            path: "/User/info",
            name: "UserInfo",
            component: () => import("../components/BackComponents/info.vue"),
            meta: { title: "用户信息" },
          },
          {
            path: "/User/history",
            name: "UserHistory",
            // component: () => import("../views/student/Exam.vue"),
            meta: { title: "历史记录" },
          },
          {
            path: "/User/image",
            name: "UserImage",
            //component: () => import("../views/student/Image.vue"),
            meta: { title: "用户照片" },
          },
        ],
      },
      // 管理员管理
      {
        path: "/administrators",
        name: "Administrators",
        // component: Layout,
        meta: { title: "管理员" },
        children: [
          {
            path: "/administrators/account",
            name: "AdminAccount",
            // component: () => import("../views/user/Account.vue"),
            meta: { title: "登录账号" },
          },
          {
            path: "/administrators/roles",
            name: "AdminRoles",
            //component: () => import("../views/user/Roles.vue"),
            meta: { title: "角色信息" },
          },
          {
            path: "/administrators/menu",
            name: "AdminMenu",
            // component: () => import("../views/user/Menu.vue"),
            meta: { title: "菜单管理" },
          },
          {
            path: "/administrators/permission",
            name: "UserPermission",
            // component: () => import("../views/user/Permission.vue"),
            meta: { title: "权限管理" },
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 添加导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // 假设使用 localStorage 存储登录状态
  console.log("导航守卫触发", {
    to: to.path,
    isAuthenticated,
    requiresAuth: to.meta.requiresAuth,
  }); // 打印调试信息
  if (to.meta.requiresAuth && isAuthenticated !== "true") {
    console.log("导航守卫触发", "未登录，重定向到登录页面");
    next("/login"); // 如果未登录，重定向到登录页面
  } else {
    next(); // 允许访问
  }
});

// 添加刷新功能（登录后，按钮变化），仅针对某些页面或路径
router.afterEach((to, from) => {
  // 如果是特定路由（如 '/app'）需要刷新页面，可以加条件判断
  if (to.path !== "/login" && from.path === "/login") {
    window.location.reload();
  }
});

export default router;
