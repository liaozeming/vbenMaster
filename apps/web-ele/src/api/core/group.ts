import { requestClient } from '#/api/request';

export async function addGroupApi(params :any) {
  return requestClient.post<any>('/group/save',params);
}  


export async function getGroupsApi(params :any) {
  return requestClient.get<any>('/group/list',{params});
}  

export async function deleteGroupApi(params :any) {
  return requestClient.delete<any>('/group/delete',{params});
}


export async function getGroupApi(params :any) {
  return requestClient.get<any>('/group/info',{params});
}  

export async function addToGroupApi(params :any) {
  return requestClient.post<any>('/group/groupEquipments',params);
}  

