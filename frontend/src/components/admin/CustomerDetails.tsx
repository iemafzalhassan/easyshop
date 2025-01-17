import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Chip,
    Grid,
    Link,
    Button,
    Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    ShoppingBag as OrdersIcon,
    AccountCircle as AccountIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

interface CustomerDetailsProps {
    user: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
        createdAt: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate?: string;
        isVerified: boolean;
    };
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ user }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Customer Information
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                            src={user.avatar}
                            sx={{ width: 64, height: 64, mr: 2 }}
                        />
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6">
                                    {user.name}
                                </Typography>
                                {user.isVerified && (
                                    <Chip
                                        label="Verified"
                                        color="success"
                                        size="small"
                                    />
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Customer since {format(new Date(user.createdAt), 'PP')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                            <Typography>
                                {user.email}
                            </Typography>
                        </Box>
                        {user.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                <Typography>
                                    {user.phone}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            component={RouterLink}
                            to={`/admin/customers/${user._id}`}
                            variant="outlined"
                            startIcon={<AccountIcon />}
                        >
                            View Profile
                        </Button>
                        <Button
                            component="a"
                            href={`mailto:${user.email}`}
                            variant="outlined"
                            startIcon={<EmailIcon />}
                        >
                            Send Email
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                        Order History
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Orders
                                    </Typography>
                                    <Typography variant="h6">
                                        {user.totalOrders}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Spent
                                    </Typography>
                                    <Typography variant="h6">
                                        ₹{user.totalSpent.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {user.lastOrderDate && (
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Last Order
                            </Typography>
                            <Typography>
                                {format(new Date(user.lastOrderDate), 'PPp')}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                        <Button
                            component={RouterLink}
                            to={`/admin/customers/${user._id}/orders`}
                            variant="text"
                            startIcon={<OrdersIcon />}
                        >
                            View All Orders
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
