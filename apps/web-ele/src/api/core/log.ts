import { requestClient } from '#/api/request';

export async function pageLogApi(params :any) {
  return requestClient.post<any>('/log/page',params);
}  
