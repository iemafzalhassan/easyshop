"use client";

import { useEffect, useState } from "react";
import OrderDetails from "../../../components/profile/OrderDetails";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { orderService, Order as OrderType } from "@/services/order.service";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

const Orders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrders();
        if (response?.data?.orders) {
          setOrders(response.data.orders);
          if (response.data.orders.length > 0) {
            setActiveOrder(response.data.orders[0]);
          }
        }
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">No Orders Found</h2>
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full"
      >
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              variants={item}
              className="w-full"
              onClick={() => setActiveOrder(order)}
            >
              <Card className={`cursor-pointer transition-all duration-200 ${
                activeOrder?._id === order._id ? 'border-primary' : ''
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>Order #{order._id}</span>
                    <span className="text-sm font-normal">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className="capitalize font-medium">{order.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="capitalize">{order.paymentMethod}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {activeOrder && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="p-4 border rounded-md">
                    <p>{activeOrder.shippingAddress.street}</p>
                    <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state}</p>
                    <p>{activeOrder.shippingAddress.country}, {activeOrder.shippingAddress.zipCode}</p>
                    <p>Phone: {activeOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-4">
                    {activeOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="font-medium">
                            {typeof item.product === 'string' ? item.product : item.product.name}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span>{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span>{formatCurrency(activeOrder.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>Payment Method</span>
                        <span className="capitalize">{activeOrder.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Orders;
