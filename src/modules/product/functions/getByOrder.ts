export const getByOrder = (
  orderBy: string,
): { [k: string]: 'asc' | 'desc' } => {
  if (orderBy === 'asc') {
    return {
      price: 'asc',
    };
  }

  if (orderBy === 'desc') {
    return {
      price: 'desc',
    };
  }

  if (orderBy === 'top-rated') {
    return {
      rate: 'desc',
    };
  }

  return {};
};
