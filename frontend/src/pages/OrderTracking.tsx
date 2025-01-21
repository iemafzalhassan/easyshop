import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Container,
    Paper,
    Typography,
    Box,
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
    CircularProgress,
    Button,
    Divider
} from '@mui/material';
import {
    CheckCircle as ConfirmedIcon,
    Inventory as ProcessingIcon,
    LocalShipping as ShippingIcon,
    Home as DeliveredIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';
import { format } from 'date-fns';
import { COLORS } from '../assets/data/constants/theme';

interface TrackingUpdate {
    status: string;
    location: string;
    timestamp: Date;
    description: string;
}

const OrderTrackingPage = () => {
    const router = useRouter();
    const { orderId } = router.query;
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
    const [estimatedDelivery, setEstimatedDelivery] = useState<Date | null>(null);

    const getTimelineDotColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return COLORS.success.main;
            case 'processing':
                return COLORS.warning.main;
            case 'shipped':
                return COLORS.info.main;
            case 'delivered':
                return COLORS.success.dark;
            default:
                return COLORS.secondary[400];
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return <ConfirmedIcon />;
            case 'processing':
                return <ProcessingIcon />;
            case 'shipped':
                return <ShippingIcon />;
            case 'delivered':
                return <DeliveredIcon />;
            default:
                return <LocationIcon />;
        }
    };

    useEffect(() => {
        const fetchOrderAndTracking = async () => {
            if (!orderId) return;
            
            try {
                setLoading(true);
                // Fetch order details
                const { data: orderData } = await api.get(`/checkout/order/${orderId}`);
                setOrder(orderData.data.order);

                // Fetch tracking updates
                const { data: trackingData } = await api.get(`/orders/${orderId}/tracking`);
                setTrackingUpdates(trackingData.data.updates);
                setEstimatedDelivery(new Date(trackingData.data.estimatedDelivery));
            } catch (error: any) {
                showToast(error.response?.data?.message || 'Error fetching order details', 'error');
                router.push('/orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndTracking();
    }, [orderId, showToast, router]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 4, mb: 3 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Track Your Order
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Order #{order._id}
                    </Typography>
                    {estimatedDelivery && (
                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                            Estimated Delivery: {format(estimatedDelivery, 'PPP')}
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Timeline position="alternate">
                    {trackingUpdates.map((update, index) => (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent color="textSecondary">
                                {format(new Date(update.timestamp), 'PPp')}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot 
                                    sx={{ 
                                        bgcolor: getTimelineDotColor(update.status),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {getStatusIcon(update.status)}
                                </TimelineDot>
                                {index < trackingUpdates.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="h6" component="span">
                                    {update.status}
                                </Typography>
                                <Typography color="textSecondary">
                                    {update.location}
                                </Typography>
                                <Typography>
                                    {update.description}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Delivery Address
                    </Typography>
                    <Typography color="textSecondary">
                        {order.shippingAddress.street}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                        <br />
                        {order.shippingAddress.country} - {order.shippingAddress.pinCode}
                        <br />
                        Phone: {order.shippingAddress.phone}
                    </Typography>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => router.push('/orders')}
                    >
                        View All Orders
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => router.push(`/order/${order._id}`)}
                    >
                        Order Details
                    </Button>
                    {order.orderStatus === 'shipped' && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                                // Handle delivery confirmation
                                api.post(`/orders/${order._id}/confirm-delivery`)
                                    .then(() => {
                                        showToast('Delivery confirmed successfully', 'success');
                                        router.push(`/order/${order._id}`);
                                    })
                                    .catch((error) => {
                                        showToast(error.response?.data?.message || 'Error confirming delivery', 'error');
                                    });
                            }}
                        >
                            Confirm Delivery
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderTrackingPage;
