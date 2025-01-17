"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
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
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

interface SignupFormProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const SignupForm = ({ setIsOpen }: SignupFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { loading, error } = api.useGetAuthQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await dispatch(setAuthenticated(values));
      const token = localStorage.getItem('token');
      if (token) {
        await api.createCookies(token);
        toast({
          title: "Success",
          description: "You have successfully registered",
          variant: "success",
        });
        if (pathname === "/auth/register") {
          router.push("/");
        }
        setIsOpen?.(false);
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full sm:w-[400px]"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...field}
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
                  placeholder="example@gmail.com"
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
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-3 h-12 gap-3"
        >
          <span>Register</span>
          {loading && (
            <span className="text-base animate-spin">
              <LuLoader />
            </span>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
        >
          <FcGoogle />
          <span>Google</span>
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
