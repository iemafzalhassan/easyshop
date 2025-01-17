"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuLoader } from "react-icons/lu";
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
import { setAuthenticated } from "@/lib/features/auth/authSlice";
import { api } from "@/services/api";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface LoginFormProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const LoginForm = ({ setIsOpen }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", values);
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        dispatch(setAuthenticated(true));
        setIsOpen?.(false);
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        if (pathname === "/login") {
          router.push("/");
          router.refresh();
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" {...field} />
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
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className="w-full" type="submit">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LuLoader className="animate-spin" /> Please wait...
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      <div className="flex items-center gap-4 my-4">
        <div className="h-0.5 bg-muted flex-1"></div>
        <span className="text-sm text-muted-foreground">OR</span>
        <div className="h-0.5 bg-muted flex-1"></div>
      </div>
      <Button variant="outline" className="w-full" type="button">
        <FcGoogle className="mr-2 text-lg" />
        Continue with Google
      </Button>
    </Form>
  );
};

export default LoginForm;
