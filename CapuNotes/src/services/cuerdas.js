import API from "../config/api";
import { get, post, put, del } from "./http";

export const CuerdasService = {
  list:   ()=> get(API.cuerdas),
  create: (data)=> post(API.cuerdas, data),
  update: (id, data)=> put(`${API.cuerdas}/${id}`, data),
  remove: (id)=> del(`${API.cuerdas}/${id}`),
};
