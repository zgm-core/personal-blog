 
/**
 *
 * @param min 最小
 * @param max 最大
 * @returns 返回最小到最大之间的随机数
 */
function random(min: number = 0, max: number = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const isType = function (type: any, value: any) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
};
/**
 * 判断是否为对象
 */
export const isObject = function (value: any) {
  return isType("Object", value);
};

export function deepClone(target: any, map = new Map()) {
  // target 不能为空，并且是一个对象
  if (target != null && isObject(target)) {
    // 在克隆数据前，进行判断是否克隆过,已克隆就返回克隆的值
    let cache = map.get(target);
    if (cache) {
      return cache;
    }
    // 判断是否为数组
    const isArray = Array.isArray(target);
    let result: any = isArray ? [] : {};
    // 将新结果存入缓存中
    cache = map.set(target, result);
    // 如果是数组
    if (isArray) {
      result = [];
      // 循环数组，
      target.forEach((item: any, index: number) => {
        // 如果item是对象，再次递归
        result[index] = deepClone(item, cache);
      });
    } else {
      // 如果是对象
      Object.keys(target).forEach((key) => {
        if (isObject(result[key])) {
          result[key] = deepClone(target[key], cache);
        } else {
          result[key] = target[key];
        }
      });
    }
    return result;
  } else {
    return target;
  }
}
export function deepMerge(target: any, source: any) {
  target = deepClone(target);
  for (let key in source) {
    if (key in target) {
      // 对象的处理
      if (isObject(source[key])) {
        if (!isObject(target[key])) {
          target[key] = source[key];
        } else {
          target[key] = deepMerge(target[key], source[key]);
        }
      } else {
        target[key] = source[key];
      }
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export { random };
