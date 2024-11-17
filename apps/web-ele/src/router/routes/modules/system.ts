import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'hugeicons:system-update-02', 
      title: $t('系统设置'),
      order: 2,
    },
    name: 'System',
    path: '/system',
    children: [
      {
        name: 'system1',
        path: 'system',
        component: () => import('#/views/myComponents/equipment.vue'),
        meta: {
          title: $t('用户信息'),
          icon:"mdi:user-box"
        },
      }
    ],
  },
];

export default routes;
