import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useLogin } from "../services/auth.service";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthProvider";

interface LoginFormData {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { login, isPending} = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        setIsAuthenticated(true);
        navigate("/");
      },
      onError: error => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
          console.log(error.response?.data);
        } else {
          toast.error("Login failed");
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[1000px] grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left side - Form */}
        <div className="p-8 md:p-12">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">How to i get started lorem ipsum dolor sit?</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <FormControl>
                        <input
                          {...field}
                          type="email"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] outline-none transition"
                          placeholder="Enter your email"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <FormControl>
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="w-full pl-10 pr-12 py-3 rounded-lg border border-input bg-background focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] outline-none transition"
                          placeholder="Enter your password"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 px-4 bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white rounded-lg font-medium transition-colors disabled:opacity-70"
                >
                  {isPending ? "Logging in..." : "Login Now"}
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    form.setValue('email', import.meta.env.VITE_DEMO_EMAIL || 'anoop@gmail.com');
                    form.setValue('password', import.meta.env.VITE_DEMO_PASSWORD || 'welcomeE2');
                    form.handleSubmit(onSubmit)();
                  }}
                  className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-70"
                >
                  {isPending ? "Logging in..." : "Try Demo Account"}
                </button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block relative ">
          <img
            src="/login-bg.avif"
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
