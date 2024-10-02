import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ion:grid-outline',
      title: $t('page.home.title'),
    },
    name: 'TestRoute',
    path: '/testRoute',
    redirect: '/testRoute/test1',
    children: [
      {
        name: 'test1',
        path: '/test1',
        component: () => import('#/views/myComponents/test1.vue'),
        meta: {
          title: $t('test1'),
        },
      },
      {
        name: 'test2',
        path: '/test2',
        component: () => import('#/views/myComponents/test2.vue'),
        meta: {
          title: $t('test2'),
        },
      },
      {
        name: 'test3',
        path: '/test3',
        component: () => import('#/views/myComponents/test3.vue'),
        meta: {
          title: $t('test3'),
        },
      },
      {
        name: 'tableTest',
        path: '/tableTest',
        component: () => import('#/views/tableTest/basicTable.vue'),
        meta: {
          title: $t('tableTest'),
        },
      },
      {
        name: 'addPage',
        path: '/addPage',
        component: () => import('#/views/tableTest/addPage.vue'),
        meta: {
          title: $t('addPage'),
          hideInMenu : true,
        },
      },
      {
        name: 'userAvatar',
        path: '/userAvatar',
        component: () => import('#/views/tableTest/UserAvatar.vue'),
        meta: {
          title: $t('userAvatar'),
        },
      },
    ],
  },
];

export default routes;
