import Taro from "@tarojs/taro";
import { TodoItem } from "./types";

export interface TodoRequest {
  pageNum?: number;
  pageSize?: number;
  keyWords?: string;
  complete?: boolean;
}

export interface TodoResponse {
  data: TodoItem[]
  total: number;
}
/**查询 */
export async function fetchTodoList(params: TodoRequest): Promise<TodoResponse> {
  const { pageNum = 0, pageSize = 10,complete } = params;
  const db = Taro.cloud.database()
  const result = await db.collection('todos').where({complete}).count();
  const res = await db.collection('todos')
    .where({
      complete
    })
    .skip(pageNum * pageSize)
    .limit(pageSize)
    .orderBy('createTime', 'desc')

    .get()
  return {
    data: res.data as TodoItem[],
    total: result.total,
  }
}


/**删除 */
export async function removeTodo(id: string): Promise<Taro.DB.Query.IRemoveResult> {
  const db = Taro.cloud.database()
  const res = await db.collection('todos').doc(id).remove({})
  return res
}

/**添加 */
export async function addTodo(item: Pick<TodoItem, 'description'>): Promise<Taro.DB.Query.IAddResult> {
  const db = Taro.cloud.database()
  const res = await db.collection('todos').add({ data: { ...item, createTime: db.serverDate(), complete: false } })
  return res
}
