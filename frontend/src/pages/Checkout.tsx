import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { AddressForm } from '../components/checkout/AddressForm';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { Button, Stepper, Paper, Container, Grid } from '@mui/material';
import { api } from '../services/api';

// Load stripe outside of components to avoid recreating strip object on every render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

    useEffect(() => {
        if (!cart || cart.items.length === 0) {
            showToast('Your cart is empty', 'error');
            navigate('/cart');
            return;
        }

        // Initialize checkout
        const initializeCheckout = async () => {
            try {
                const { data } = await api.post('/checkout/initiate', {
                    currency: 'inr'
                });
                setClientSecret(data.data.clientSecret);
            } catch (error: any) {
                showToast(error.response?.data?.message || 'Error initializing checkout', 'error');
                navigate('/cart');
            }
        };

        initializeCheckout();
    }, [cart, navigate, showToast]);

    const handleAddressSelect = (address: any) => {
        setSelectedAddress(address);
        setActiveStep(1);
    };

    const handlePaymentMethodSelect = (method: 'card' | 'upi' | 'cod') => {
        setPaymentMethod(method);
        setActiveStep(2);
    };

    const handlePaymentComplete = async (paymentResult: any) => {
        setLoading(true);
        try {
            const { data } = await api.post('/checkout/confirm', {
                shippingAddress: selectedAddress,
                paymentMethod,
                paymentResult
            });

            // Clear cart and show success message
            clearCart();
            showToast('Order placed successfully!', 'success');
            navigate(`/order/${data.data.order._id}`);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error completing checkout', 'error');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            label: 'Shipping Address',
            content: (
                <AddressForm
                    addresses={user?.addresses || []}
                    selectedAddress={selectedAddress}
                    onAddressSelect={handleAddressSelect}
                />
            )
        },
        {
            label: 'Payment Method',
            content: (
                <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onMethodSelect={handlePaymentMethodSelect}
                />
            )
        },
        {
            label: 'Review & Pay',
            content: (
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        clientSecret={clientSecret}
                        paymentMethod={paymentMethod}
                        onPaymentComplete={handlePaymentComplete}
                    />
                </Elements>
            )
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel>{step.label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {steps[activeStep].content}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <OrderSummary
                        cart={cart}
                        loading={loading}
                        selectedAddress={selectedAddress}
                        paymentMethod={paymentMethod}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckoutPage;
