"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuLoader2 } from "react-icons/lu";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/lib/hooks";
import { setCurrentUser } from "@/lib/features/auth/authSlice";
import { authService } from "@/services/auth.service";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = values;
      
      const { user, token } = await authService.register(registrationData);
      
      if (!user || !token) {
        throw new Error('Registration failed - invalid response');
      }

      // Set the current user in Redux store
      dispatch(setCurrentUser(user));
      
      // Initialize cart state
      dispatch({ type: 'cart/initializeCart', payload: user._id });

      toast({
        title: "Success",
        description: "Account created successfully! Welcome to EasyShop!",
      });

      // Get the redirect URL from query params or default to home
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/';
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push(redirectTo);
      router.refresh();
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Check if it's an existing user error
      if (error.message.includes('already exists')) {
        const loginUrl = `/login?email=${encodeURIComponent(values.email)}&redirect=${encodeURIComponent(window.location.pathname)}`;
        
        toast({
          title: "Account Exists",
          description: error.message,
          action: (
            <Link href={loginUrl}>
              <Button variant="outline" size="sm">
                Go to Login
              </Button>
            </Link>
          ),
          variant: "default",
          duration: 5000,
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(loginUrl);
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        className="w-full h-11 text-base"
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};
