import { requestClient } from '#/api/request';

//新增自定义topic
export async function addTlsApi(tlsParams :any) {
  return requestClient.post<any>('/tsl/save',tlsParams);
}  


//显示tlsList
export async function getTlsListApi(params :any) {
  return requestClient.get<any>('/tsl/list',{params});
}  

//删除topic
export async function deleteTslcApi(params :any) {
  return requestClient.delete<any>('/tsl/delete',{params});
}


//运行状态 属性
export async function getProperies(params :any) {
  return requestClient.get<any>('/tsl/propery',{params});
}  


//运行数据
export async function getChartData(params :any) {
  return requestClient.post<any>('/tsl/charData',params);
}  

//事件数据
export async function getEventData(params :any) {
  return requestClient.post<any>('/tsl/event',params);
}  

//服务数据
export async function getServiceData(params :any) {
  return requestClient.post<any>('/tsl/service',params);
}  


//获取服务数据
export async function getServices(params :any) {
  return requestClient.get<any>('/tsl/service',{params});
}  
