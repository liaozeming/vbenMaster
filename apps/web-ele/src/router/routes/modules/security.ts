import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'material-symbols:security', 
      title: $t('安全中心'),
      order: 2,
    },
    name: 'Security',
    path: '/security',
    children: [
      {
        name: 'security1',
        path: 'security1',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('数据概览1'),
        },
      }
    ],
  },
];

export default routes;
