import { requestClient } from '#/api/request';

//在线设备开启关闭
export async function monitorOnlieApi(params :any) {
  return requestClient.get<any>('/monitor/isOnline',{params});
}  


/**
 * 获取属性
 */
export async function getAttributeApi(params :any) {
  return requestClient.get<any>('/monitor/attribute',{params});
}



/**
 * 属性设置
 */
export async function setAttributeApi(params :any) {
  return requestClient.post<any>('/monitor/attributeSet',params);
}


/**
 * 服务调用
 */
export async function servicePushApi(params :any) {
  return requestClient.post<any>('/monitor/service',params);
}
