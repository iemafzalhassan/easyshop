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
import { Textarea } from "../ui/textarea";
import { Variants, motion } from "framer-motion";
import { setShippingAddress } from "@/lib/features/checkout/checkoutSlice";
import { useDispatch } from "react-redux";

const formSchema = z.object({
  title: z.string(),
  phone: z.string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^[0-9]{10}$/, "Phone number must contain only digits"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string()
    .min(6, "PIN code must be 6 digits")
    .max(6, "PIN code must be 6 digits")
    .regex(/^[0-9]{6}$/, "PIN code must contain only digits"),
  streetAddress: z.string().min(5, "Street address is required"),
});

const ShippingAddressForm = () => {
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Shipping",
      phone: "9499999995",
      country: "India",
      city: "Muzaffarpur",
      state: "Bihar",
      pinCode: "800000",
      streetAddress: "Kya Raaz-E-Fitna hai Hungama ho gya hai Jahane-E-Mishal me",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    dispatch(setShippingAddress(data));
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
      },
    },
    exit: { opacity: 0, y: 50 },
  };

  return (
    <div className="shipping-form">
      <h1 className="text-xl font-medium mb-4">Shipping Address</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4 items-center flex-col md:flex-row w-full">
            <motion.div variants={itemVariants} className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 94******95" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          <div className="flex gap-4 items-center flex-col md:flex-row w-full">
            <motion.div variants={itemVariants} className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Muzaffarpur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          <div className="flex gap-4 items-center flex-col md:flex-row w-full">
            <motion.div variants={itemVariants} className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Bihar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="pinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN Code</FormLabel>
                    <FormControl>
                      <Input placeholder="eg: 800000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="eg: Kya Raaz-E-Fitna hai Hungama ho gya hai Jahane-E-Mishal me"
                      id="streetAddress"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;
