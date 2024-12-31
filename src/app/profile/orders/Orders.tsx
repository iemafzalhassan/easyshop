"use client";

import OrderDetails from "@/components/profile/OrderDetails";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CartItem } from "@/lib/features/cart/cartSlice";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useState } from "react";

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

export type Order = {
  id: string;
  orderNumber: number;
  status:
    | "pending"
    | "processing"
    | "at local facility"
    | "out for delivery"
    | "completed";
  orderDate: string;
  deliveryTime: string;
  amount: string;
  total: string | number;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  productItems: CartItem[];
};

export const orders: Order[] = [
  {
    id: "1",
    status: "pending",
    orderDate: "Feb 7, 2024",
    deliveryTime: "express delivery",
    amount: "15.00",
    total: "17.00",
    billingAddress: "123 Main St",
    orderNumber: 1087348901,
    paymentMethod: "Cash on delivery",
    shippingAddress: "123 Main St",
    productItems: [
      {
        _id: "1",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "2",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "3",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
    ],
  },
  {
    id: "2",
    status: "completed",
    orderDate: "Feb 7, 2024",
    deliveryTime: "express delivery",
    amount: "15.00",
    total: "17.00",
    billingAddress: "123 Main St",
    orderNumber: 1087348901,
    paymentMethod: "Cash on delivery",
    shippingAddress: "123 Main St",
    productItems: [
      {
        _id: "1",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "2",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "3",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
    ],
  },
  {
    id: "3",
    status: "processing",
    orderDate: "Feb 7, 2024",
    deliveryTime: "express delivery",
    amount: "15.00",
    total: "17.00",
    billingAddress: "123 Main St",
    orderNumber: 1087348901,
    paymentMethod: "Cash on delivery",
    shippingAddress: "123 Main St",
    productItems: [
      {
        _id: "1",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "2",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "3",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
    ],
  },
  {
    id: "4",
    status: "completed",
    orderDate: "Feb 7, 2024",
    deliveryTime: "express delivery",
    amount: "15.00",
    total: "17.00",
    billingAddress: "123 Main St",
    orderNumber: 1087348901,
    paymentMethod: "Cash on delivery",
    shippingAddress: "123 Main St",
    productItems: [
      {
        _id: "1",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "2",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "3",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
    ],
  },
  {
    id: "5",
    status: "completed",
    orderDate: "Feb 7, 2024",
    deliveryTime: "express delivery",
    amount: "15.00",
    total: "17.00",
    billingAddress: "123 Main St",
    orderNumber: 1087348901,
    paymentMethod: "Cash on delivery",
    shippingAddress: "123 Main St",
    productItems: [
      {
        _id: "1",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "2",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
      {
        _id: "3",
        title: "Apples",
        price: 15.0,
        image: "/groceryImages/apple.png",
        shop_category: "Grocery",
        unit_of_measure: "kg",
        amount: 1,
      },
    ],
  },
];

const Orders = () => {
  const [activeOrder, setActiveOrder] = useState(orders[0]);

  const handleOrderClick = (order: Order) => {
    setActiveOrder(order);
  };

  return (
    <AnimatePresence>
      <motion.section
        variants={ContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="order-page w-full"
      >
        <motion.h1 variants={item} className="font-medium text-2xl">
          My Orders
        </motion.h1>

        <div className="flex gap-4 overflow-auto narrowScrollbar mt-5 w-full pb-3 pr-3">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              variants={item}
              className="min-w-fit cursor-pointer"
            >
              <Card
                key={order.id}
                className={`${
                  order.id === activeOrder.id ? "border-primary" : ""
                }`}
                onClick={() => handleOrderClick(order)}
              >
                <CardHeader className="flex justify-between w-full gap-6 items-center flex-row border-b py-2.5">
                  <CardTitle className="text-lg">
                    Order: <span className="font-normal">#{order.id}</span>
                  </CardTitle>

                  <div
                    className={`${
                      order.status === "completed"
                        ? "bg-green-200 text-green-600"
                        : "bg-yellow-200 text-yellow-600"
                    } rounded-lg py-1 px-2 capitalize text-sm`}
                  >
                    {order.status}
                  </div>
                  {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent className="mt-6 text-sm">
                  <div className="flex justify-between gap-2 w-full">
                    <p className="flex justify-between items-center min-w-24">
                      <span>Order Date</span>
                      <span>:</span>
                    </p>
                    <p className="text-muted-foreground self-end">
                      {order.orderDate}
                    </p>
                  </div>

                  <div className="flex justify-between mt-2 gap-2 w-full">
                    <p className="flex justify-between items-center min-w-24">
                      <span>Delivery Time</span>
                      <span>:</span>
                    </p>
                    <p className="text-muted-foreground self-end">
                      {order.deliveryTime}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start text-sm border-t">
                  <div className="flex justify-between mt-2 gap-2 w-full">
                    <p className="flex justify-between items-center min-w-24">
                      <span className="font-medium">Amount</span>
                      <span>:</span>
                    </p>
                    <p className="text-muted-foreground self-end">
                      ${order.amount}
                    </p>
                  </div>
                  <div className="flex justify-between mt-2 gap-2 w-full">
                    <p className="flex justify-between items-center min-w-24">
                      <span className="font-medium">Total Price</span>
                      <span>:</span>
                    </p>
                    <p className="text-muted-foreground self-end">
                      ${order.total}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <OrderDetails orderId={activeOrder.id} />
      </motion.section>
    </AnimatePresence>
  );
};

export default Orders;
