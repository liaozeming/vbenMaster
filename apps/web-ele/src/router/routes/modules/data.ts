import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'bxs:data', 
      title: $t('数据概览'),
      order: 2,
    },
    name: 'Data',
    path: '/data',
    children: [
      {
        name: 'data1',
        path: 'data1',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('数据概览1'),
          icon:"fluent:data-area-24-regular"
        },
      }
    ],
  },
];

export default routes;
