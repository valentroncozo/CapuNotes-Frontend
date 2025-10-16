import API from "../config/api";

/** HTTP base (fetch). Si preferís axios, lo cambiamos fácil. */
export async function http(method, path, body){
  const res = await fetch(API.baseURL + path, {
    method,
    headers: { "Content-Type":"application/json" },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if(!res.ok){
    const msg = await res.text().catch(()=>res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  if(res.status === 204) return null;
  return res.json();
}

export const get  = (path)=> http("GET", path);
export const post = (path, body)=> http("POST", path, body);
export const put  = (path, body)=> http("PUT", path, body);
export const del  = (path)=> http("DELETE", path);
