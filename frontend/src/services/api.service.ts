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
import { toast } from "react-hot-toast";

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${config.apiUrl}/auth/refresh`,
          { refreshToken: localStorage.getItem("refresh") },
          { withCredentials: true }
        );
        
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear token and show login message
        localStorage.removeItem("token");
        toast.error("Please login to continue");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

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
