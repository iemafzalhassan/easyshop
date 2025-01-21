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
  const { error: showError } = useToast();
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
    if (!searchParams) return;
    
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
        showError(error?.message || "Something went wrong!");
      }
    };

    if (productId) {
      getProduct();
    }
  }, [dispatch, searchParams, showError]);

  return mounted && isAuthenticated ? (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="container py-8 lg:py-12"
      >
        <HistoryBackBtn />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              {btns.map((btn) => (
                <Button
                  key={btn.title}
                  variant={activeForm === btn.title ? "default" : "outline"}
                  onClick={() => setActiveForm(btn.title)}
                >
                  {btn.title}
                </Button>
              ))}
            </div>
            <div>
              {activeForm === "billing" ? (
                <BillingAddressForm />
              ) : (
                <ShippingAddressForm />
              )}
            </div>
          </div>
          <OrderSummery />
        </div>
      </motion.div>
    </AnimatePresence>
  ) : null;
};

export default CheckoutPage;
