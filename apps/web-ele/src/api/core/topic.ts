import { requestClient } from '#/api/request';

//新增自定义topic
export async function addTopic(topicParams :any) {
  return requestClient.post<any>('/topic/add',topicParams);
}  


//显示topics
export async function getTopics(params :any) {
  return requestClient.get<any>('/topic/topics',{params});
}  

//删除topic
export async function deleteTopicApi(params :any) {
  return requestClient.delete<any>('/topic/delete',{params});
}
