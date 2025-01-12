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
        component: () => import('#/views/equipmentManage/projectManage/productManage.vue'),
        meta: {
          title: $t('产品管理'),
          icon : "fluent-mdl2:product-list" 
        },
      },
      {
        name: 'equipmentManage',
        path: 'equipmentManage',
        component: () => import('#/views/equipmentManage/equipment/equipment.vue'),
        meta: {
          title: $t('设备管理'),
          icon : "ant-design:product-filled"
        },
      },
      {
        name: 'equipmentDetail',
        path: 'equipmentDetail/:id',
        component: () => import('#/views/equipmentManage/equipment/equipmentDetail.vue'),
        meta: {
          title: $t('设备详情'),
          hideInMenu : true
        },
      },
      {
        name: 'groupManage',
        path: 'groupManage',
        component: () => import('#/views/equipmentManage/groupManage/index.vue'),
        meta: {
          title: $t('分组管理'),
          icon:"clarity:node-group-line" 
        },
      },
      {
        name: 'groupDetail',
        path: 'groupDetail/:id',
        component: () => import('#/views/equipmentManage/groupManage/groupDetail.vue'),
        meta: {
          title: $t('分组详情'),
          hideInMenu : true
        },
      },
      {
        name: 'simulator',
        path: 'simulator',
        component: () => import('#/views/equipmentManage/simulator/index.vue'),
        meta: {
          title: $t('设备模拟器'),
          icon : "memory:device"
        },
      },
    ],
  },
];

export default routes;
