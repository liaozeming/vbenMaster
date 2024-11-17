import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';



  /** 登录接口参数 */
  export interface User {
    createTime : string,
    id : string
    username: string
    nickname: string
  }

  export interface Userpage {
    username : string | null
    pageNum : number
    pageSize: number
  }

  export interface UserpageResult {
    items : User[]
    total : number
  }

export async function userPageList(userpage :Userpage) {
    return requestClient.post<UserpageResult>('/user/page',userpage);
}  

/**
 *新增用户
 */
export async function addUser(user: any) {
  return requestClient.post<User>('/save/user',user);
}  

/**
 * 获取所有用户
 */
export async function getTableListApi() {
  return requestClient.get<User[]>('/table/list');
}


export async function deleteUserApi(user: any) {
  return requestClient.delete<boolean>(`/user/${user.username}`, user);
}



