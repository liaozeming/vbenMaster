import { requestClient } from '#/api/request';


  /** 产品参数*/
  export interface Product {
    id : string
    productName : string
    productKey: string
    productSecret : string
    state: string
    topicList: TopicObject[]
    type: string
    nodeType: string
    onLineType: string
    protocol: string
    dataFormat: string
    identifyType: string
    description: string
    createTime: string
    modifyTime:string
    createPerson:string
  }

  export interface TopicObject {
    type : string
    function:string
    topics:Topic[]
  }

  export interface Topic {
    topic : string
    permission:string
    description:string
  }


/**
 * 获取所有产品
 */
export async function getProductListApi(params :any) {
  return requestClient.get<Product[]>('/product/list',{params});
}


// 新增产品

export async function addProductListApi(product :any) {
  return requestClient.post<any>('/product/save',product);
}


//删除产品
export async function deleteProductListApi(params :any) {
  return requestClient.delete<Boolean>('/product/delete',{params});
}



export interface ProductpageResult {
  items : Product[]
  total : number
}

//产品分页
export async function productPageList(productpage :any) {
  return requestClient.post<ProductpageResult>('/product/page',productpage);
}  


//产品详细信息
export async function getProductDetail(params :any) {
  return requestClient.get<Product>('/product/detail',{params});
}
