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
  const [activeForm, setActiveForm] = useState("billing");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // Check if we have a product ID in the URL
    const productId = searchParams.get('product');
    if (productId && !cartItems.some(item => item._id === productId)) {
      // Fetch the product and add it to cart
      const fetchAndAddProduct = async () => {
        try {
          const response = await productService.getProduct(productId);
          if (response.status === 'success' && response.data.product) {
            dispatch(addToCart({
              ...response.data.product,
              quantity: 1
            }));
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast({
            title: "Error",
            description: "Failed to add product to cart",
            variant: "destructive",
          });
        }
      };
      fetchAndAddProduct();
    }
  }, [isAuthenticated, searchParams, cartItems, dispatch, router]);

  if (!mounted) return null;

  return (
    <div className="container py-20">
      <div className="flex items-center gap-4 mb-8">
        <HistoryBackBtn />
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="lg:col-span-8"
        >
          <div className="flex items-center gap-4 mb-8">
            {btns.map((btn) => (
              <button
                key={btn.title}
                onClick={() => setActiveForm(btn.title)}
                className={`px-6 py-2 rounded-lg capitalize ${
                  activeForm === btn.title
                    ? "bg-primary text-white"
                    : "bg-gray-100"
                }`}
              >
                {btn.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeForm === "billing" ? (
              <motion.div
                key="billing"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <BillingAddressForm />
              </motion.div>
            ) : (
              <motion.div
                key="shipping"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ShippingAddressForm />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="lg:col-span-4">
          <OrderSummery />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
