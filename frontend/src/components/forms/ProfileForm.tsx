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
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import { IoMdCloudUpload } from "react-icons/io";
import { useEffect, useState } from "react";
import { Variants, motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { setCurrentUser } from "@/lib/features/auth/authSlice";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      stiffness: 90,
    },
  },
  exit: {
    opacity: 0,
    x: "100%",
  },
};

const DEFAULT_AVATAR = '/assets/images/default-avatar.png';

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must contain at least 2 character(s)")
    .max(20, "Name must contain at most 20 character(s)"),
  email: z
    .string({ required_error: "Email is Required" })
    .email("Please enter your valid email address"),
  bio: z
    .string({ required_error: "bio is required" })
    .min(2, "bio is required")
    .max(100, "bio less than or equal to 100 characters"),
});

const ProfileForm = () => {
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      bio: "",
    },
  });

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file.",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }

      setAvatarFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling image upload:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to process image. Please try again.",
      });
    }
  };

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);

      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        try {
          const response = await api.patch('/api/v1/profile/avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data.status === 'success') {
            // Update currentUser with new avatar URL
            dispatch(setCurrentUser({
              ...currentUser!,
              avatar: response.data.data.user.avatar
            }));
          }
        } catch (error) {
          console.error('Avatar upload error:', error);
          toast({
            variant: "destructive",
            title: "Avatar upload failed",
            description: "Failed to upload avatar, but profile will be updated.",
          });
        }
      }

      // Update profile
      const response = await api.patch('/api/v1/profile', values);
      
      if (response.data.status === 'success') {
        // Merge the existing user data with updated values
        dispatch(setCurrentUser({
          ...currentUser!,
          ...response.data.data.user
        }));
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    // Initialize avatar from currentUser
    if (currentUser?.avatar) {
      setAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  return (
    <AnimatePresence>
      <motion.div
        variants={ContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="profile-form"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={item} className="flex justify-center">
              <label
                htmlFor="avatar"
                className="cursor-pointer relative overflow-hidden rounded-full group"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-black/65 flex justify-center items-center text-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                  {isUploading ? (
                    <div className="animate-spin">⌛</div>
                  ) : (
                    <IoMdCloudUpload />
                  )}
                </div>
                <Image
                  src={avatar}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="object-cover w-[100px] h-[100px] rounded-full"
                />
              </label>
              <input
                type="file"
                name="avatar"
                id="avatar"
                className="hidden"
                title="avatar"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </motion.div>

            <motion.div variants={item}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={item}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={item}>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Apne Jeevan ka Uddeshya yha likhe."
                        id="bio"
                        maxLength={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isUploading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileForm;
