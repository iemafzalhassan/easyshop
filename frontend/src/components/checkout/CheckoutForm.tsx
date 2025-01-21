import React, { useState } from 'react';
import {
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import {
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert,
    TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface CheckoutFormProps {
    clientSecret: string;
    paymentMethod: 'card' | 'upi' | 'cod';
    onPaymentComplete: (paymentResult: any) => void;
}

const StyledCardElement = styled(CardElement)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        borderColor: theme.palette.text.primary,
    },
}));

const UPIForm = styled('form')(({ theme }) => ({
    '& .MuiTextField-root': {
        marginBottom: theme.spacing(2),
    },
}));

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
    clientSecret,
    paymentMethod,
    onPaymentComplete
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [upiId, setUpiId] = useState('');

    const handleCardPayment = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement)!,
                    },
                }
            );

            if (paymentError) {
                setError(paymentError.message || 'Payment failed');
            } else if (paymentIntent) {
                onPaymentComplete({
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    method: 'card'
                });
            }
        } catch (err: any) {
            setError(err.message || 'Payment failed');
        } finally {
            setProcessing(false);
        }
    };

    const handleUPIPayment = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !upiId) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const { error: paymentError, paymentIntent } = await stripe.confirmUpiPayment(
                clientSecret,
                {
                    payment_method: {
                        upi: {
                            vpa: upiId,
                        },
                    },
                }
            );

            if (paymentError) {
                setError(paymentError.message || 'Payment failed');
            } else if (paymentIntent) {
                onPaymentComplete({
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    method: 'upi'
                });
            }
        } catch (err: any) {
            setError(err.message || 'Payment failed');
        } finally {
            setProcessing(false);
        }
    };

    const handleCODPayment = () => {
        onPaymentComplete({
            id: 'cod_' + Date.now(),
            status: 'pending',
            method: 'cod'
        });
    };

    const renderPaymentMethod = () => {
        switch (paymentMethod) {
            case 'card':
                return (
                    <form onSubmit={handleCardPayment}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Card Details
                            </Typography>
                            <StyledCardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={!stripe || processing}
                            startIcon={processing && <CircularProgress size={20} />}
                        >
                            {processing ? 'Processing...' : 'Pay Now'}
                        </Button>
                    </form>
                );

            case 'upi':
                return (
                    <UPIForm onSubmit={handleUPIPayment}>
                        <Typography variant="h6" gutterBottom>
                            UPI Payment
                        </Typography>
                        <TextField
                            fullWidth
                            label="UPI ID"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@upi"
                            required
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={!upiId || processing}
                            startIcon={processing && <CircularProgress size={20} />}
                        >
                            {processing ? 'Processing...' : 'Pay with UPI'}
                        </Button>
                    </UPIForm>
                );

            case 'cod':
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Cash on Delivery
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Pay in cash when your order is delivered.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleCODPayment}
                            disabled={processing}
                        >
                            Place Order
                        </Button>
                    </Box>
                );
        }
    };

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}
            {renderPaymentMethod()}
        </Box>
    );
};
