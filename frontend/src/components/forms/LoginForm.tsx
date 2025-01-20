"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
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
import { addToCart, setPendingCartItem } from "@/lib/features/cart/cartSlice";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import { api } from "@/services/api";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);
      
      if (response.token) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        dispatch(setCurrentUser(response.user));

        // Handle pending cart items
        const pendingItems = localStorage.getItem('pendingCartItems');
        const lastAction = localStorage.getItem('lastAttemptedCartAction');
        
        if (pendingItems) {
          try {
            const items = JSON.parse(pendingItems);
            // Add items that are less than 24 hours old
            const validItems = items.filter((item: any) => {
              const addedAt = new Date(item.addedAt);
              const now = new Date();
              const hoursDiff = (now.getTime() - addedAt.getTime()) / (1000 * 60 * 60);
              return hoursDiff < 24;
            });
            
            // Add valid items to cart
            for (const item of validItems) {
              dispatch(addToCart({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
                image: item.image,
                name: item.name
              }));
            }

            // Show success message if items were added
            if (validItems.length > 0) {
              toast.success(`${validItems.length} item(s) have been added to your cart.`);
            }
            
            // Clean up localStorage
            localStorage.removeItem('pendingCartItems');
          } catch (err) {
            console.error('Error processing pending cart items:', err);
            toast.error("There was an error adding your pending items to cart. Please try adding them again.");
          }
        }

        // Get return URL from query params, lastAttemptedCartAction, or default to home
        let redirectUrl = '/';
        
        if (lastAction) {
          try {
            const action = JSON.parse(lastAction);
            if (action.timestamp) {
              const actionTime = new Date(action.timestamp);
              const now = new Date();
              const minutesDiff = (now.getTime() - actionTime.getTime()) / (1000 * 60);
              
              // Use the stored return URL if the action was recent (within 30 minutes)
              if (minutesDiff < 30 && action.returnUrl) {
                redirectUrl = action.returnUrl;
              }
            }
          } catch (err) {
            console.error('Error processing last action:', err);
          }
        }
        
        // Query params override stored return URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('redirect')) {
          redirectUrl = params.get('redirect') || '/';
        }

        // Clean up localStorage
        localStorage.removeItem('lastAttemptedCartAction');
        
        // Show welcome message
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        // Redirect user
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || error.message || "Please check your credentials and try again."
      });
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
          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
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
    </div>
  );
};
