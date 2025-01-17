import React from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Box,
    Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatCurrency } from '../../utils/format';

interface OrderSummaryProps {
    cart: any;
    loading: boolean;
    selectedAddress: any;
    paymentMethod: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    position: 'sticky',
    top: theme.spacing(2),
}));

const SummaryItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
}));

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    cart,
    loading,
    selectedAddress,
    paymentMethod
}) => {
    if (loading) {
        return (
            <StyledPaper>
                <Typography variant="h6" gutterBottom>
                    Order Summary
                </Typography>
                <List>
                    {[1, 2, 3].map((item) => (
                        <ListItem key={item}>
                            <ListItemAvatar>
                                <Skeleton variant="circular" width={40} height={40} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Skeleton width="60%" />}
                                secondary={<Skeleton width="40%" />}
                            />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 2 }}>
                    {[1, 2, 3].map((item) => (
                        <SummaryItem key={item}>
                            <Skeleton width="40%" />
                            <Skeleton width="20%" />
                        </SummaryItem>
                    ))}
                </Box>
            </StyledPaper>
        );
    }

    const subtotal = cart.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
    );
    const shipping = subtotal > 1000 ? 0 : 100;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    return (
        <StyledPaper>
            <Typography variant="h6" gutterBottom>
                Order Summary
            </Typography>

            <List>
                {cart.items.map((item: any) => (
                    <ListItem key={item.product._id}>
                        <ListItemAvatar>
                            <Avatar src={item.product.images[0]?.url} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={item.product.name}
                            secondary={`${item.quantity} x ${formatCurrency(item.price)}`}
                        />
                        <Typography>
                            {formatCurrency(item.price * item.quantity)}
                        </Typography>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
                <SummaryItem>
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography>{formatCurrency(subtotal)}</Typography>
                </SummaryItem>
                <SummaryItem>
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography>
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </Typography>
                </SummaryItem>
                <SummaryItem>
                    <Typography color="text.secondary">Tax (18% GST)</Typography>
                    <Typography>{formatCurrency(tax)}</Typography>
                </SummaryItem>
                <Divider sx={{ my: 1 }} />
                <SummaryItem>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">{formatCurrency(total)}</Typography>
                </SummaryItem>
            </Box>

            {selectedAddress && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Delivery Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedAddress.street}
                        <br />
                        {selectedAddress.city}, {selectedAddress.state}
                        <br />
                        {selectedAddress.country} - {selectedAddress.pinCode}
                        <br />
                        Phone: {selectedAddress.phone}
                    </Typography>
                </Box>
            )}

            {paymentMethod && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Payment Method
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {paymentMethod === 'card'
                            ? 'Credit/Debit Card'
                            : paymentMethod === 'upi'
                            ? 'UPI Payment'
                            : 'Cash on Delivery'}
                    </Typography>
                </Box>
            )}
        </StyledPaper>
    );
};
