"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { orderService, Order } from '@/services/order.service';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface OrderItem {
    product: {
        _id: string;
        name: string;
        price: number;
    };
    quantity: number;
    price: number;
}

interface OrderWithPopulatedItems extends Omit<Order, 'items'> {
    items: OrderItem[];
}

const OrderConfirmationPage = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { toast } = useToast();
    const [order, setOrder] = useState<OrderWithPopulatedItems | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                toast({
                    title: "Error",
                    description: "Order ID not found",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            try {
                const response = await orderService.getOrderById(orderId);
                if (response?.data?.order) {
                    setOrder(response.data.order);
                } else {
                    toast({
                        title: "Error",
                        description: "Could not find order details",
                        variant: "destructive",
                    });
                }
            } catch (error: any) {
                console.error('Error fetching order:', error);
                toast({
                    title: "Error",
                    description: error.response?.data?.message || 'Error fetching order details',
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, toast]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <Card className="max-w-3xl mx-auto mt-8">
                <CardContent className="p-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
                        <p className="mb-6">We couldn't find the order you're looking for.</p>
                        <Button asChild>
                            <Link href="/">Return to Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Order Confirmation</span>
                        <span className="text-sm font-normal">Order #{order._id}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Order Status</h3>
                        <div className="p-3 bg-green-50 text-green-700 rounded-md">
                            Your order has been confirmed and will be shipped soon!
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <div className="p-4 border rounded-md">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p>{order.shippingAddress.country}, {order.shippingAddress.zipCode}</p>
                            <p>Phone: {order.shippingAddress.phone}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Order Summary</h3>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
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
                                    <span>{formatCurrency(order.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>Payment Method</span>
                                    <span className="capitalize">{order.paymentMethod}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button asChild>
                            <Link href="/profile/orders">View All Orders</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderConfirmationPage;
