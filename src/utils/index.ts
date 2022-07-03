


export const isFunction = (value: unknown): value is Function => typeof value === 'function';
export const isH5 = TARO_ENV === "h5"