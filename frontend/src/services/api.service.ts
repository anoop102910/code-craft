import axios, { InternalAxiosRequestConfig } from "axios";
import { config } from "@/config";
import {
  UserResponse,
  ProblemResponse,
  ProblemRequest,
  LoginResponse,
  ProblemsResponse,
  SubmitCodeRequest,
  UserCodeResponse,
} from "@/types/index";
import toast from "@/lib/toast";
export const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, async (error) => {
  console.error("Authorization Error:", error);
  if (error.response?.status === 401) {
    try {
      const refreshToken = localStorage.getItem("refresh");
      const response = await api.post("/auth/refresh-token", { token: refreshToken });
      console.log("refresh response", response.data);
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);

      if (error.config && error.config.headers) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
      }
      return api.request(error.config);
    } catch (refreshError) {
      console.error("Token Refresh Error:", refreshError);
      toast.error("Session expired, please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }
  }
  return Promise.reject(error);
});

export const apiService = {
  auth: {
    login: async (data: { username: string; password: string }): Promise<LoginResponse> =>
      (await api.post("/auth/login", data)).data,
    register: async (data: {
      username: string;
      email: string;
      password: string;
    }): Promise<LoginResponse> => (await api.post("/auth/register", data)).data,
    getProfile: async (): Promise<UserResponse> => (await api.get("/auth/me")).data,
  },
  problems: {
    getAll: async (): Promise<ProblemsResponse> => (await api.get("/problems")).data,
    get: async (slug: string): Promise<ProblemResponse> =>
      (await api.get(`/problems/${slug}`)).data,
    create: async (data: ProblemRequest): Promise<ProblemResponse> =>
      (await api.post("/problems", data)).data,
  },
  code: {
    submit: async (data: SubmitCodeRequest): Promise<{ user_code_id: number }> =>
      (await api.post("/submit-code", data)).data,
    get_user_code: async (user_code_id: number): Promise<UserCodeResponse> =>
      (await api.get(`/get-user-code?user_code_id=${user_code_id}`)).data,
  },
};
