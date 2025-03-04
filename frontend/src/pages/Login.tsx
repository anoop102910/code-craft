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
  username: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { login, isPending} = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const form = useForm<LoginFormData>({
    defaultValues: {
      username: "",
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

  const handleDemoLogin = () => {
    login({ username: "anoop102910", password: "welcomeme" }, {
      onSuccess: () => {
        setIsAuthenticated(true);
        navigate("/");
      },
      onError: error => {
        toast.error("Login failed");
      },
    });
  };

  return (
    <div className="flex  justify-center p-4">
      <div className="w-full max-w-[440px] bg-[var(--smash-depth-2)] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-[var(--smash-depth-8)]">Welcome back</h1>
            <p className="text-[var(--smash-depth-6)]">Please enter your details to sign in</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--smash-depth-7)]">Username</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--smash-depth-5)] h-5 w-5" />
                      <FormControl>
                        <input
                          {...field}
                          type="username"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--smash-depth-6)] bg-[var(--smash-depth-2)] text-[var(--smash-depth-8)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition placeholder:text-[var(--smash-depth-5)]"
                          placeholder="Enter your username"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--smash-depth-7)]">Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--smash-depth-5)] h-5 w-5" />
                      <FormControl>
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="w-full pl-10 pr-12 py-3 rounded-lg border border-[var(--smash-depth-6)] bg-[var(--smash-depth-2)] text-[var(--smash-depth-8)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition placeholder:text-[var(--smash-depth-5)]"
                          placeholder="Enter your password"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--smash-depth-5)] hover:text-[var(--smash-depth-7)]"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-[var(--smash-depth-6)] hover:text-[var(--smash-depth-8)] transition-colors"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-2.5 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--smash-depth-10)] rounded-lg font-medium transition-colors disabled:opacity-70"
                >
                  {isPending ? "Signing in..." : "Sign in"}
                </button>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 px-4 bg-[var(--smash-depth-8-04)] hover:bg-[var(--smash-depth-8-10)] text-[var(--smash-depth-7)] rounded-lg font-medium transition-colors disabled:opacity-70"
                >
                  {isPending ? "Signing in..." : "Try Demo Account"}
                </button>

                <div className="text-center pt-4">
                  <span className="text-[var(--smash-depth-6)]">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
