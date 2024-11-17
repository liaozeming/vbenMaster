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
        name: 'monitor1',
        path: 'monitor1',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('实时监控'),
          icon :"ant-design:monitor-outlined"
        },
      },
      {
        name: 'monitor2',
        path: 'monitor2',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('在线调试'),
          icon:"codicon:debug-console"
        },
      },
      {
        name: 'monitor3',
        path: 'monitor3',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('日志服务'),
          icon:"pajamas:log" 
        },
      },
      {
        name: 'monitor4',
        path: 'monitor4',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('任务管理'),
          icon:"fluent-mdl2:task-list"
        },
      },
      {
        name: 'monitor5',
        path: 'monitor5',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('事件响应'),
          icon:"clarity:event-solid"
        },
      }
    ],
  },
];

export default routes;
