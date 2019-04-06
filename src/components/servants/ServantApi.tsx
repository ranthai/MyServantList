import { ServantFilters } from "../../models/ServantData";

export const callApi = async (filters: ServantFilters) => {
  const url = `/api/servants/?class=${JSON.stringify(filters.class_filters)}`
  const response = await fetch(url);
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
};
