import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:twotone-developer-board', 
      title: $t('设备管理'),
      order: 1,
    },
    name: 'Equipment',
    path: '/equipment',
    children: [
      {
        name: 'productManage',
        path: 'productManage',
        component: () => import('#/views/equipmentManage/productManage.vue'),
        meta: {
          title: $t('产品管理'),
          icon : "fluent-mdl2:product-list" 
        },
      },
      {
        name: 'test1223',
        path: 'test1223',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('设备管理'),
          icon : "ant-design:product-filled"
        },
      },
      {
        name: 'test1224',
        path: 'test1224',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('分组管理'),
          icon:"clarity:node-group-line" 
        },
      },
      {
        name: 'test1225',
        path: 'test1225',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('设备模拟器'),
          icon : "memory:device"
        },
      },
    ],
  },
];

export default routes;
