import { requestClient } from '#/api/request';

export async function addEquipmentApi(params :any) {
  return requestClient.post<any>('/equipment/save',params);
}  

export async function equipmentPageApi(params :any) {
  return requestClient.post<any>('/equipment/page',params);
}  

export async function deleteEquipmentcApi(params :any) {
  return requestClient.delete<any>('/equipment/delete',{params});
}


export async function editEquipmentApi(params :any) {
  return requestClient.post<any>('/equipment/edit',params);
}  

//equipmentList数据
export async function getEquipmentDataApi(params :any) {
  return requestClient.get<any>('/equipment/data',{params});
}  


//获取equipment详细数据
export async function getEquipmentDetailApi(params :any) {
  return requestClient.get<any>('/equipment/detail',{params});
}  


//未加入到分组的设备
export async function getNotAddToGroupEquipment(params :any) {
  return requestClient.get<any>('/equipment/unGroupEquipment',{params});
}  


//分组中的设备
export async function getGroupEquipments(params :any) {
  return requestClient.get<any>('/equipment/groupEquipments',{params});
}  


//将设备从分组中删除
export async function deleteEquipmentsFromGroupApi(params :any) {
  return requestClient.post<any>('/equipment/removeFromGroup',params);
}  


//获取equipment的分组信息
export async function getEquipmentGroupApi(params :any) {
  return requestClient.get<any>('/equipment/group',{params});
}  

//设备修改分组
export async function editEquipmentGroupApi(params :any) {
  return requestClient.post<any>('/equipment/groupEdit',params);
}  


//根据产品id获取所有的设备
export async function getEquipmentsApi(params :any) {
  return requestClient.get<any>('/equipment/equipments',{params});
}  


//根据设备id获取自定义topics
export async function getUserTopicsApi(params :any) {
  return requestClient.get<any>('/equipment/topics',{params});
}  

//根据设备id获取属性
export async function getPropertiesApi(params :any) {
  return requestClient.get<any>('/equipment/properties',{params});
}  

//根据设备id获取事件
export async function getEventsApi(params :any) {
  return requestClient.get<any>('/equipment/events',{params});
}  


//根据设备id获取服务
export async function getServicesApi(params :any) {
  return requestClient.get<any>('/equipment/services',{params});
}  



//根据设备id获取订阅的Topic
export async function getTopicsApi(params :any) {
  return requestClient.get<any>('/equipment/topicList',{params});
}  
