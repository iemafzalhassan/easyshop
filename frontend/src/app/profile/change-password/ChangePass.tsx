"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const ContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

// Password validation schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type FormValues = z.infer<typeof passwordSchema>;

function ChangePassword() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);

      // Send request to change password
      await api.patch("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      // Show success message
      toast({
        title: "Success",
        description: "Your password has been changed successfully.",
      });

      // Clear form
      form.reset();

      // Redirect to profile page
      router.push("/profile");
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast({
          title: "Error",
          description: "Current password is incorrect.",
          variant: "destructive",
        });
        form.setError("currentPassword", {
          type: "manual",
          message: "Current password is incorrect",
        });
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to change password",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md mx-auto p-6 space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Change Password</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a strong password to protect your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <IoEyeOffOutline className="w-5 h-5 text-gray-500" />
                      ) : (
                        <IoEyeOutline className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <IoEyeOffOutline className="w-5 h-5 text-gray-500" />
                      ) : (
                        <IoEyeOutline className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <IoEyeOffOutline className="w-5 h-5 text-gray-500" />
                      ) : (
                        <IoEyeOutline className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </AnimatePresence>
  );
}

export default ChangePassword;
