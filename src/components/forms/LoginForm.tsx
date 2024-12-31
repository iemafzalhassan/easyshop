"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createCookies } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  User,
  setAuthenticated,
  setCurrentUser,
} from "@/lib/features/auth/authSlice";
import fetchData from "@/lib/fetchDataFromApi";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuLoader } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormProps = {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export function LoginForm({ setIsOpen }: LoginFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "demo@gmail.com",
      password: "test1234",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const res = await fetchData.post("/auth/login", values);
      await createCookies(res.data.token);
      dispatch(setCurrentUser(res.data.user as User));
      form.reset();
      setIsLoading(false);
      setIsOpen && setIsOpen(false);
      dispatch(setAuthenticated(true));
      toast({
        title: "Success",
        description: "You have successfully Logged in",
        variant: "success",
      });

      // if user is on login or register page, redirect to the previous page
      if (pathname === "/login" || pathname === "/register") {
        router.back();
      } else {
        router.push(pathname);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Authentication failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  type="email"
                  placeholder="Email"
                  {...field}
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
                  className="h-12"
                  type="password"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 h-12 gap-3"
        >
          <span>Login</span>
          {isLoading && (
            <span className="text-base animate-spin">
              <LuLoader />
            </span>
          )}
        </Button>

        <div className="flex gap-3 items-center justify-center my-3">
          <div className="flex-1 h-0.5 bg-muted"></div>
          <p className="text-muted">Or</p>
          <div className="flex-1 h-0.5 bg-muted"></div>
        </div>
        <Button
          type="button"
          className="w-full h-12 flex gap-4 bg-gray-900 border-input hover:text-white hover:bg-gray-800"
        >
          <span className="text-3xl">
            <FcGoogle />
          </span>
          <span>Login with google</span>
        </Button>
      </form>
    </Form>
  );
}
