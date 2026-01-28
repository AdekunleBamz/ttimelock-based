// Object utility functions

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result as Omit<T, K>;
}

export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => 
    deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
  );
}

export function mergeDeep<T extends object>(...objects: Partial<T>[]): T {
  return objects.reduce((acc, obj) => {
    Object.keys(obj).forEach(key => {
      const accVal = (acc as Record<string, unknown>)[key];
      const objVal = (obj as Record<string, unknown>)[key];
      
      if (Array.isArray(accVal) && Array.isArray(objVal)) {
        (acc as Record<string, unknown>)[key] = [...accVal, ...objVal];
      } else if (isObject(accVal) && isObject(objVal)) {
        (acc as Record<string, unknown>)[key] = mergeDeep(accVal as object, objVal as object);
      } else {
        (acc as Record<string, unknown>)[key] = objVal;
      }
    });
    return acc;
  }, {} as T) as T;
}

function isObject(item: unknown): item is object {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function getNestedValue<T>(obj: object, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let result: unknown = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = (result as Record<string, unknown>)[key];
  }
  
  return (result as T) ?? defaultValue;
}
