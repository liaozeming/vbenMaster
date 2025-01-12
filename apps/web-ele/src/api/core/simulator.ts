import { requestClient } from '#/api/request';

//设备模拟器开启关闭
export async function equipmentSimulatorApi(params :any) {
  return requestClient.post<any>('/simulator/operate',params);
}  

//消息上报
export async function messageSendApi(params :any) {
  return requestClient.post<any>('/simulator/message',params);
}  
//消息订阅
export async function subscribeTopicApi(params :any) {
  return requestClient.post<any>('/simulator/subscribe',params);
}  


//属性设置
export async function attributePushApi(params :any) {
  return requestClient.post<any>('/simulator/attributeSet',params);
}  


//事件推送
export async function eventPushApi(params :any) {
  return requestClient.post<any>('/simulator/eventPush',params);
}  


//下行Topic推送
export async function downTopicApi(params :any) {
  return requestClient.post<any>('/simulator/downTopic',params);
}  


/**
 * 获取属性
 */
export async function getAttributeApi(params :any) {
  return requestClient.get<any>('/simulator/attribute',{params});
}


/**
 * 属性设置
 */
export async function setAttributeApi(params :any) {
  return requestClient.post<any>('/simulator/attribute',params);
}


/**
 * 服务调用
 */
export async function servicePushApi(params :any) {
  return requestClient.post<any>('/simulator/service',params);
}

