import API from "../config/api";
import { get, post, put, del } from "./http";

export const MiembrosService = {
  list:   ()=> get(API.miembros),
  create: (data)=> post(API.miembros, data),
  update: (id, data)=> put(`${API.miembros}/${id}`, data),
  remove: (id)=> del(`${API.miembros}/${id}`),
};
