import {
  PaginatedRequestInterface,
  PaginatedResponseInterface,
} from './interface';

export const paginatedResponse = <T>(
  payload: PaginatedRequestInterface<T>,
): PaginatedResponseInterface<T> => {
  const { data: items, total, skip, take } = payload;

  return {
    data: items,
    total,
    page: Math.floor(skip / take) + 1,
    perPage: take,
    hasMore: skip + items.length < total,
  };
};
