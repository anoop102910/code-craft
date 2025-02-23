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
});

export const apiService = {
  auth: {
    login: async (data: { email: string; password: string }): Promise<LoginResponse> =>
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
