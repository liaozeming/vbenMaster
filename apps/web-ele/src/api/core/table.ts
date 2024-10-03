import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';



  /** 登录接口参数 */
  export interface User {
    id : string
    username: string
    nickname: string
  }


/**
 *新增用户
 */
export async function addUser(user: User) {
  return requestClient.post<User>('/save/user',user);
}  

/**
 * 获取所以用户
 */
export async function getTableListApi() {
  return requestClient.get<User[]>('/table/list');
}


export async function deleteUserApi(user: User) {
  return requestClient.delete<boolean>(`/user/${user.username}`, user);
}
