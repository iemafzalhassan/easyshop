import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Divider,
    Button,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';
import {
    LocalShipping as ShippingIcon,
    Payment as PaymentIcon,
    Person as CustomerIcon,
    Receipt as InvoiceIcon,
    Print as PrintIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { OrderItems } from '../../components/admin/OrderItems';
import { CustomerDetails } from '../../components/admin/CustomerDetails';
import { formatCurrency } from '../../utils/format';

const OrderDetails = () => {
    const router = useRouter();
    const { orderId } = router.query;
    const { showToast } = useToast();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updateDialog, setUpdateDialog] = useState(false);
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [carrier, setCarrier] = useState('');
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) return;

            try {
                setLoading(true);
                const response = await api.get(`/admin/orders/${orderId}`);
                setOrder(response.data);
                if (response.data.trackingNumber) {
                    setTrackingNumber(response.data.trackingNumber);
                }
                if (response.data.carrier) {
                    setCarrier(response.data.carrier);
                }
            } catch (error: any) {
                showToast(error.response?.data?.message || 'Error fetching order details', 'error');
                router.push('/admin/orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, showToast, router]);

    const handleStatusUpdate = async () => {
        try {
            setStatusUpdateLoading(true);
            await api.patch(`/orders/${orderId}/status`, {
                status: updatedStatus,
                trackingNumber,
                carrier
            });
            showToast('Order status updated successfully', 'success');
            setUpdateDialog(false);
            // Refresh order details
            const response = await api.get(`/orders/${orderId}`);
            setOrder(response.data);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error updating order status', 'error');
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    const handlePrintInvoice = () => {
        window.print();
    };

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
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">Order not found</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Order #{order._id.slice(-6)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Placed on {format(new Date(order.createdAt), 'PPp')}
                        </Typography>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="outlined"
                            startIcon={<PrintIcon />}
                            onClick={handlePrintInvoice}
                        >
                            Print Invoice
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => setUpdateDialog(true)}
                        >
                            Update Status
                        </Button>
                    </Box>
                </Box>

                <Chip
                    label={order.orderStatus.toUpperCase()}
                    color="primary"
                    sx={{ mt: 1 }}
                />

                <Grid container spacing={3}>
                    {/* Order Timeline */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Order Timeline
                            </Typography>
                            <Timeline>
                                {order.trackingUpdates.map((update: any, index: number) => (
                                    <TimelineItem key={update._id}>
                                        <TimelineOppositeContent color="text.secondary">
                                            {format(new Date(update.timestamp), 'PPp')}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot color="primary" />
                                            {index < order.trackingUpdates.length - 1 && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Typography variant="subtitle2">
                                                {update.status.toUpperCase()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {update.location}
                                            </Typography>
                                            <Typography variant="body2">
                                                {update.description}
                                            </Typography>
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                            </Timeline>
                        </Paper>
                    </Grid>

                    {/* Order Details */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Order Items
                            </Typography>
                            <OrderItems items={order.items} />
                            
                            <Divider sx={{ my: 3 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Shipping Address
                                    </Typography>
                                    <Typography variant="body2">
                                        {order.shippingAddress.street}
                                        <br />
                                        {order.shippingAddress.city}, {order.shippingAddress.state}
                                        <br />
                                        {order.shippingAddress.country} - {order.shippingAddress.pinCode}
                                        <br />
                                        Phone: {order.shippingAddress.phone}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Payment Information
                                    </Typography>
                                    <Typography variant="body2">
                                        Method: {order.paymentInfo.method}
                                        <br />
                                        Status: {order.paymentInfo.status}
                                        <br />
                                        ID: {order.paymentInfo.id}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography>Subtotal:</Typography>
                                            <Typography>{formatCurrency(order.totalAmount - (order.totalAmount * 0.18))}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography>Tax (18% GST):</Typography>
                                            <Typography>{formatCurrency(order.totalAmount * 0.18)}</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="subtitle1">Total:</Typography>
                                            <Typography variant="subtitle1">{formatCurrency(order.totalAmount)}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <CustomerDetails user={order.user} />
                        </Paper>
                    </Grid>
                </Grid>

                {/* Status Update Dialog */}
                <Dialog
                    open={updateDialog}
                    onClose={() => setUpdateDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Update Order Status</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                value={updatedStatus}
                                onChange={(e) => setUpdatedStatus(e.target.value)}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Location"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                multiline
                                rows={3}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setUpdateDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleStatusUpdate}
                            disabled={!updatedStatus || !trackingNumber || !carrier}
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default OrderDetails;
