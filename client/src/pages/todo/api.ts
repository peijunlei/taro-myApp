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
export async function fetchTodoList(params: TodoRequest) {
  return await Taro.cloud.callFunction({
    name: 'getTodos',
    data: { ...params }
  })
}


/**删除 */
export async function removeTodo(id: string) {
  return await Taro.cloud.callFunction({
    name: 'delTodo',
    data: { id }
  })
}

/**添加 */
export async function addTodo(item: Pick<TodoItem, 'description'>) {
  return await Taro.cloud.callFunction({
    name: 'addTodo',
    data: item
  })

}
/**更新 */
export async function changeTodoComplete(id: string, bol: boolean) {
  return await Taro.cloud.callFunction({
    name: 'updateTodo',
    data: {
      id,
      complete: bol
    }
  })

}
