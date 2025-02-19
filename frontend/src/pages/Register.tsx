import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { useRegister } from '../services/auth.service';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const { register, isPending} = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data, {
      onSuccess: () => navigate('/'),
      onError: (error) => console.error('Registration failed:', error.message),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[1000px] grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left side - Form */}
        <div className="p-8 md:p-12">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground">Get started with your free account today</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Full Name</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] outline-none transition"
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                          placeholder="Create a password"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white rounded-lg font-medium transition-colors disabled:opacity-70"
              >
                {isPending ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </Form>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">Or Register with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 border rounded-lg hover:bg-gray-50 transition">
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border rounded-lg hover:bg-gray-50 transition">
                <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block relative">
          <img 
            src="/login-bg.avif" 
            alt="Register illustration" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}; 