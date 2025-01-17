import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { styled } from '@mui/material/styles';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';
import { format } from 'date-fns';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
}));

const StyledTimelineDot = styled(TimelineDot)<{ status: string }>(({ theme, status }) => ({
    '&.confirmed': {
        backgroundColor: theme.palette.success.main,
    },
    '&.processing': {
        backgroundColor: theme.palette.warning.main,
    },
    '&.shipped': {
        backgroundColor: theme.palette.info.main,
    },
    '&.delivered': {
        backgroundColor: theme.palette.success.main,
    },
    '&.pending': {
        backgroundColor: theme.palette.grey[400],
    },
}));

interface TrackingUpdate {
    status: string;
    location: string;
    timestamp: Date;
    description: string;
}

const OrderTrackingPage: React.FC = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [order, setOrder] = useState<any>(null);
    const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [estimatedDelivery, setEstimatedDelivery] = useState<Date | null>(null);

    useEffect(() => {
        const fetchOrderAndTracking = async () => {
            try {
                // Fetch order details
                const { data: orderData } = await api.get(`/checkout/order/${orderId}`);
                setOrder(orderData.data.order);

                // Fetch tracking updates
                const { data: trackingData } = await api.get(`/orders/${orderId}/tracking`);
                setTrackingUpdates(trackingData.data.updates);
                setEstimatedDelivery(new Date(trackingData.data.estimatedDelivery));
            } catch (error: any) {
                showToast(error.response?.data?.message || 'Error fetching order details', 'error');
                navigate('/orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndTracking();
    }, [orderId, navigate, showToast]);

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

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <StyledPaper>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Track Your Order
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
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
                            <TimelineOppositeContent color="text.secondary">
                                {format(new Date(update.timestamp), 'PPp')}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <StyledTimelineDot status={update.status.toLowerCase()}>
                                    {getStatusIcon(update.status)}
                                </StyledTimelineDot>
                                {index < trackingUpdates.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="h6" component="span">
                                    {update.status}
                                </Typography>
                                <Typography color="text.secondary">
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
                    <Typography color="text.secondary">
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
                        onClick={() => navigate('/orders')}
                    >
                        View All Orders
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/order/${order._id}`)}
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
                                        navigate(`/order/${order._id}`);
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
            </StyledPaper>
        </Container>
    );
};

export default OrderTrackingPage;
