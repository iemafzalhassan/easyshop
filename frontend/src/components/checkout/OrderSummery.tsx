"use client";

import Image from "next/image";
import Link from "next/link";
import { removeFromCart, clearCart } from "@/lib/features/cart/cartSlice";
import { useAppSelector } from "@/lib/hooks";
import { totalPrice } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HiMiniXMark } from "react-icons/hi2";
import Skeleton from "@/components/loader/Skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Counter from "@/components/Counter";
import { orderService } from "@/services/order.service";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/ui/toast";

const paymentMethods = [
  {
    title: "Cash on Delivery",
    value: "cod"
  },
  {
    title: "Card Payment",
    value: "card"
  },
  {
    title: "UPI Payment",
    value: "upi"
  },
  {
    title: "Net Banking",
    value: "netbanking"
  }
];

const OrderSummery = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems } = useAppSelector((state) => state.cart);
  const { shippingAddress, billingAddress } = useAppSelector((state) => state.checkout);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const router = useRouter();

  const handleSelectMethod = (title: string) => {
    setSelectedMethod(title);
  };

  const placeOrder = async () => {
    try {
      setIsLoading(true);

      if (!shippingAddress && !billingAddress) {
        toast({
          title: "Address Required",
          description: "Please fill in shipping or billing address",
          variant: "destructive",
        });
        return;
      }

      if (!selectedMethod) {
        toast({
          title: "Payment Method Required",
          description: "Please select a payment method",
          variant: "destructive",
        });
        return;
      }

      const address = shippingAddress || billingAddress;
      
      if (!address?.phone?.match(/^[0-9]{10}$/) || !address?.pinCode?.match(/^[0-9]{6}$/)) {
        toast({
          title: "Invalid Format",
          description: "Phone number must be 10 digits and PIN code must be 6 digits",
          variant: "destructive",
        });
        return;
      }

      // Calculate total amount
      const subtotal = totalPrice(cartItems);
      const shipping = 5.00;
      const tax = 2.50;
      const total = subtotal + shipping + tax;
      
      // Create order data
      const orderData = {
        shippingAddress: {
          street: address?.streetAddress || "",
          city: address?.city || "",
          state: address?.state || "",
          pinCode: address?.pinCode || "",  
          country: address?.country || "",
          phone: address?.phone || "",  
        },
        paymentInfo: {  
          method: selectedMethod,
        },
        totalAmount: total,  
      };

      console.log('Sending order data:', orderData);  

      // Place the order
      const response = await orderService.createOrder(orderData);

      // Show success message
      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed successfully.",
        variant: "default",
      });

      // Clear cart
      dispatch(clearCart());

      // Redirect to order summary
      router.push(`/orders/${response.data.order._id}`);
    } catch (error: any) {
      console.error('Order error:', error.response?.data || error);  
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      toast({
        title: "Failed to place order",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <AnimatePresence>
      <div className="order-summery">
        <h2 className="text-2xl font-bold mb-5">Order Summary</h2>
        <div className="pb-4">
          {cartItems.length <= 0 && (
            <div className="text-center py-6">No product selected!</div>
          )}
          {cartItems.map((item) => (
            <motion.div
              layout
              key={item._id}
              className="group flex justify-between items-end py-3 hover:bg-accent px-3 rounded-lg relative"
            >
              <Button
                type="button"
                variant="outline"
                className="absolute top-1 right-2 h-7 w-7 p-0 text-base rounded-full hover:text-primary hover:border-primary hidden group-hover:flex"
                onClick={() => dispatch(removeFromCart(item._id))}
              >
                <HiMiniXMark />
              </Button>
              <div className="flex gap-3">
                <Image
                  src={item.image}
                  width={50}
                  height={50}
                  alt={item.name}
                  className="object-cover rounded-md"
                />
                <div className="space-y-1">
                  <Link
                    href={`/products/${item._id}`}
                    className="line-clamp-1 hover:text-primary hover:underline"
                  >
                    {item.name}
                  </Link>
                  <Counter
                    product={item}
                    className="scale-90 origin-left"
                  />
                  <p className="text-muted-foreground text-sm">
                    Unit Price: ${item.price}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                ${Number(item.price) * (item?.quantity || 1)}
              </p>
            </motion.div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div className="pb-5 pt-3">
            <h3 className="text-xl font-medium text-center">
              Select Payment Method
            </h3>
            <div className="flex gap-4 items-center mt-4">
              {paymentMethods.map((method) => (
                <Card
                  className={`${
                    method.value === selectedMethod
                      ? "text-primary border-primary"
                      : ""
                  } cursor-pointer`}
                  key={method.title}
                  onClick={() => handleSelectMethod(method.value)}
                >
                  <CardHeader>
                    <CardTitle className="text-base capitalize">
                      {method.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Subtotal:</span>
              <span>${totalPrice(cartItems)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping:</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tax:</span>
              <span>$2.50</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>Total:</span>
              <span>${totalPrice(cartItems) + 7.50}</span>
            </div>
            <Button
              type="button"
              className="w-full text-white hover:text-white bg-primary hover:bg-primary/90"
              disabled={!selectedMethod || isLoading}
              onClick={placeOrder}
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        )}
      </div>
    </AnimatePresence>
  ) : (
    <Skeleton />
  );
};

export default OrderSummery;
