import API from "../config/api";
import { get, post, put, del } from "./http";

export const AreasService = {
  list:   ()=> get(API.areas),
  create: (data)=> post(API.areas, data),
  update: (id, data)=> put(`${API.areas}/${id}`, data),
  remove: (id)=> del(`${API.areas}/${id}`),
};
