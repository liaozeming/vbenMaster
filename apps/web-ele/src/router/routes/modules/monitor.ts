import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'pepicons-print:monitor-loop', 
      title: $t('监控运维'),
      order: 2,
    },
    name: 'monitor',
    path: '/monitor',
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('#/views/monitor/dashboard.vue'),
        meta: {
          title: $t('实时监控'),
          icon :"ant-design:monitor-outlined"
        },
      },
      {
        name: 'online',
        path: 'online',
        component: () => import('#/views/monitor/index.vue'),
        meta: {
          title: $t('在线调试'),
          icon:"codicon:debug-console"
        },
      },
      {
        name: 'log',
        path: 'log',
        component: () => import('#/views/log/index.vue'),
        meta: {
          title: $t('日志服务'),
          icon:"pajamas:log" 
        },
      },
      {
        name: 'task',
        path: 'task',
        component: () => import('#/views/task/index.vue'),
        meta: {
          title: $t('任务管理'),
          icon:"fluent-mdl2:task-list"
        },
      },
      {
        name: 'taskDetail',
        path: 'taskDetail/:id',
        component: () => import('#/views/task/detail.vue'),
            meta: {
                title: $t('任务详情'),
                    hideInMenu : true
            },
      },
      {
        name: 'event',
        path: 'event',
        component: () => import('#/views/event/index.vue'),
        meta: {
          title: $t('事件响应'),
          icon:"clarity:event-solid"
        },
      }
    ],
  },
];

export default routes;
