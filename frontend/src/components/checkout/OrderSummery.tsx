import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { placeOrder, syncCart, clearCart } from '@/lib/features/cart/cartSlice';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from "../../components/ui/label"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { orderService } from '@/services/order.service';

const OrderSummery = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { cartItems, loading, error } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { shippingAddress, billingAddress } = useAppSelector((state) => state.checkout);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initializeCart = async () => {
      try {
        if (user && cartItems.length > 0) {
          await dispatch(syncCart(cartItems)).unwrap();
        }
      } catch (error) {
        console.error('Error syncing cart:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sync cart. Please try again.",
        });
      }
    };

    initializeCart();
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateShipping = (subtotal: number) => {
    // Free shipping for orders above ₹1000
    return subtotal > 1000 ? 0 : 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    return subtotal + shipping;
  };

  const handlePaymentMethodChange = (value: string) => {
    setSelectedPaymentMethod(value as 'card' | 'upi' | 'netbanking' | 'cod');
  };

  const handlePlaceOrder = async () => {
    try {
      if (!shippingAddress) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please add shipping address before placing order",
        });
        return;
      }

      if (!billingAddress) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please add billing address before placing order",
        });
        return;
      }

      if (cartItems.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Your cart is empty",
        });
        return;
      }

      setIsProcessing(true);

      // Sync cart one final time before placing order
      await dispatch(syncCart(cartItems)).unwrap();

      const orderData = {
        items: cartItems.map(item => ({
          product: typeof item.product === 'string' ? item.product : item.product._id,
          quantity: item.quantity,
          price: item.price // Price in INR
        })),
        shippingAddress,
        billingAddress,
        paymentMethod: selectedPaymentMethod,
        totalAmount: calculateTotal() // Total in INR
      };

      const response = await orderService.createOrder(orderData);
      
      if (response.data?.order?._id) {
        dispatch(clearCart());
        router.push(`/order-confirmation?orderId=${response.data.order._id}`);
        toast({
          title: "Success",
          description: "Order placed successfully!",
        });
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to place order",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{calculateShipping(calculateSubtotal()) === 0 ? 'Free' : `₹${calculateShipping(calculateSubtotal()).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={handlePaymentMethodChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod">Cash on Delivery</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Credit/Debit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi">UPI</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="netbanking" id="netbanking" />
            <Label htmlFor="netbanking">Net Banking</Label>
          </div>
        </RadioGroup>
      </Card>

      <Button
        className="w-full"
        onClick={handlePlaceOrder}
        disabled={isProcessing || loading || cartItems.length === 0}
      >
        {isProcessing || loading ? 'Processing...' : 'Place Order'}
      </Button>
    </div>
  );
};

export default OrderSummery;
