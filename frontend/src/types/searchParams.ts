export type SearchParamsType = {
  [key: string]: string | string[] | undefined;
  page?: string;
  limit?: string;
  sort?: string;
  shop?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
};
