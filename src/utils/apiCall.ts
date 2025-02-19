import axios from "axios";

export function apiCall(method: string, url: string, user: any) {
  return axios({
    baseURL: "https://my-fake-backend.onrender.com",
    url,
    method,
    data: user,
  });
}
