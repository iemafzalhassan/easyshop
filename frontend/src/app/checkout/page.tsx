"use client";

import HistoryBackBtn from "../../components/HistoryBackBtn";
import OrderSummery from "../../components/checkout/OrderSummery";
import BillingAddressForm from "@/components/forms/BillingAddressForm";
import ShippingAddressForm from "@/components/forms/ShippingAddressForm";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { productService } from "@/services/product.service";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
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

const btns = [
  {
    title: "billing",
  },
  {
    title: "shipping",
  },
];

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [activeForm, setActiveForm] = useState("shipping");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    const productId = searchParams.get("product");
    const quantity = searchParams.get("quantity");
    const color = searchParams.get("color");
    const size = searchParams.get("size");

    const getProduct = async () => {
      try {
        const product = await productService.getProductById(productId!);
        dispatch(
          addToCart({
            ...product,
            quantity: Number(quantity),
            selectedColor: color,
            selectedSize: size,
          })
        );
      } catch (error: any) {
        toast({
          title: error?.message || "Something went wrong!",
          variant: "destructive",
        });
      }
    };

    if (productId) {
      getProduct();
    }
  }, [dispatch, searchParams, toast]);

  return mounted && isAuthenticated ? (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="container py-6"
      >
        <div className="flex items-center gap-4 mb-8">
          <HistoryBackBtn />
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-8">
              {btns.map((btn) => (
                <Button
                  key={btn.title}
                  type="button"
                  variant={activeForm === btn.title ? "default" : "outline"}
                  className={`capitalize ${
                    activeForm === btn.title
                      ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                      : "hover:text-primary"
                  }`}
                  onClick={() => setActiveForm(btn.title)}
                >
                  {btn.title}
                </Button>
              ))}
            </div>

            {activeForm === "billing" ? (
              <BillingAddressForm />
            ) : (
              <ShippingAddressForm />
            )}
          </div>

          <OrderSummery />
        </div>
      </motion.div>
    </AnimatePresence>
  ) : null;
};

export default CheckoutPage;
