import { useState, useEffect } from 'react';

const GLOBAL_STATES: Record<string, any> = {};
const GLOBAL_STATES_DISPATCHERS: Record<string, any[]> = {};

// GlobalState实际上是一个自定义的hook
// 将一个state的value和setValue分别以同一个key存在两个类Map的对象里，再将value和setValue返回出去以便于组件的调用
// 在组件销毁时，相应的setValue也会被销毁
function useGlobalState<T>(key: string, initState: T): [T, (value: T) => void] {
  const [state, setState] = useState(initState);

  useEffect(() => {
    // 判断是否存在这个state
    if (!GLOBAL_STATES[key]) {
      // 如果不存在则初始化这个state和对应的dispatchers数组
      GLOBAL_STATES[key] = initState;
      GLOBAL_STATES_DISPATCHERS[key] = [];
    } else {
      // 如果存在就存入hook的state，最后return出去
      setState(GLOBAL_STATES[key]);
    }
    GLOBAL_STATES_DISPATCHERS[key].push(setState);
    return () => {
      // 组件销毁时从dispatchers数组删除这个组件创建的setState函数
      GLOBAL_STATES_DISPATCHERS[key] = GLOBAL_STATES_DISPATCHERS[key].filter((item) => item !== setState);
    };
  }, []);

  const setStates = (newState: T) => {
    // 若一个global state要更新，遍历所有dispatchers(setState函数)，更新来自不同组件的state
    GLOBAL_STATES_DISPATCHERS[key].forEach((dispatch) => {
      dispatch(newState);
    });
    GLOBAL_STATES[key] = newState;
  };

  return [state, setStates];
};
export default useGlobalState