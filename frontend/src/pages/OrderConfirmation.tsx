import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Container,
    Paper,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Divider,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    CheckCircle as SuccessIcon,
    LocalShipping as ShippingIcon,
    Inventory as PackageIcon,
    Home as DeliveredIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { api } from '../services/api';
import { formatCurrency } from '../utils/format';
import { useToast } from '../hooks/useToast';
import { COLORS } from '../assets/data/constants/theme';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
    fontWeight: 'bold',
    '&.confirmed': {
        backgroundColor: COLORS.success.light,
        color: theme.palette.success.contrastText,
    },
    '&.processing': {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.contrastText,
    },
    '&.shipped': {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.info.contrastText,
    },
    '&.delivered': {
        backgroundColor: COLORS.success.light,
        color: theme.palette.success.contrastText,
    },
    '&.cancelled': {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
    },
}));

const OrderConfirmationPage = () => {
    const router = useRouter();
    const { orderId } = router.query;
    const { showToast } = useToast();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/checkout/order/${orderId}`);
                setOrder(data.data.order);
            } catch (error: any) {
                showToast(error.response?.data?.message || 'Error fetching order', 'error');
                router.push('/orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, router, showToast]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!order) {
        return null;
    }

    const orderSteps = [
        { label: 'Order Confirmed', status: 'confirmed' },
        { label: 'Processing', status: 'processing' },
        { label: 'Shipped', status: 'shipped' },
        { label: 'Delivered', status: 'delivered' }
    ];

    const currentStepIndex = orderSteps.findIndex(step => step.status === order.orderStatus);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <StyledPaper>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <SuccessIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Thank you for your order!
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Order #{order._id}
                    </Typography>
                    <StatusChip
                        label={order.orderStatus.toUpperCase()}
                        className={order.orderStatus.toLowerCase()}
                        sx={{ mt: 2 }}
                    />
                </Box>

                <Stepper activeStep={currentStepIndex} sx={{ mb: 4 }}>
                    {orderSteps.map((step, index) => (
                        <Step key={step.label} completed={index <= currentStepIndex}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                            Order Items
                        </Typography>
                        <List>
                            {order.items.map((item: any) => (
                                <ListItem key={item._id}>
                                    <ListItemAvatar>
                                        <Avatar src={item.product.images[0]?.url} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.product.name}
                                        secondary={`Quantity: ${item.quantity}`}
                                    />
                                    <Typography>
                                        {formatCurrency(item.price * item.quantity)}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography color="text.secondary">Subtotal</Typography>
                                    <Typography>
                                        {formatCurrency(order.totalAmount - (order.totalAmount * 0.18))}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography color="text.secondary">Tax (18% GST)</Typography>
                                    <Typography>
                                        {formatCurrency(order.totalAmount * 0.18)}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle1">Total</Typography>
                                    <Typography variant="subtitle1">
                                        {formatCurrency(order.totalAmount)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Shipping Address
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {order.shippingAddress.street}
                                    <br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state}
                                    <br />
                                    {order.shippingAddress.country} - {order.shippingAddress.pinCode}
                                    <br />
                                    Phone: {order.shippingAddress.phone}
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Payment Information
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Method: {order.paymentInfo.method}
                                    <br />
                                    Status: {order.paymentInfo.status}
                                    <br />
                                    ID: {order.paymentInfo.id}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        onClick={() => router.push('/orders')}
                    >
                        View All Orders
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/track-order/' + order._id)}
                    >
                        Track Order
                    </Button>
                </Box>
            </StyledPaper>
        </Container>
    );
};

export default OrderConfirmationPage;
