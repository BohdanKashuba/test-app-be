import { TSchema } from '../types/functions/getSearchFilters.type';

export const getSearchFilters = (schema: TSchema) => {
  const obj = Object.entries(schema).reduce((arr, [key, value]) => {
    if (typeof value.value === 'undefined' && value.type) {
      return arr;
    }

    if (value.type === 'string') {
      return [...arr, [key, value.value.toString()]];
    }

    if (value.type === 'number') {
      return [...arr, [key, parseFloat(value.value.toString())]];
    }

    if (Object.values(value ?? {}).length) {
      return [...arr, [key, getSearchFilters(value as TSchema)]];
    }

    return arr;
  }, []);

  return Object.fromEntries(obj);
};
