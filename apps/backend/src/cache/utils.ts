export const deepSortObjectByKeys = <T extends Record<string, any>>(
  obj: T,
): T => {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepSortObjectByKeys(item)) as unknown as T;
  }

  const sortedKeys = Object.keys(obj).sort();

  const sortedObj = {} as T;

  sortedKeys.forEach((key) => {
    const value = obj[key];

    if (value !== null && typeof value === "object") {
      sortedObj[key as keyof T] = deepSortObjectByKeys(value);
    } else {
      sortedObj[key as keyof T] = value;
    }
  });

  return sortedObj;
};
