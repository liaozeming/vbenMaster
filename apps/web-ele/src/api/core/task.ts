import { requestClient } from '#/api/request';

export async function taskLogApi(params :any) {
  return requestClient.post<any>('/task/page',params);
}  


export async function addTaskApi(params :any) {
  return requestClient.post<any>('/task/add',params);
}  


export async function deleteTaskApi(params :any) {
  return requestClient.delete<any>('/task/delete',{params});
}  


export async function updateStateTaskApi(params :any) {
  return requestClient.get<any>('/task/updateState',{params});
}  


export async function getTaskDetail(params :any) {
  return requestClient.get<any>('/task/detail',{params});
}  
