import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    LinearProgress,
    Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatCurrency } from '../../utils/format';

interface TopProductsProps {
    products: {
        _id: string;
        name: string;
        image: string;
        revenue: number;
        sales: number;
        stock: number;
    }[];
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer',
    },
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.palette.grey[200],
    '& .MuiLinearProgress-bar': {
        borderRadius: 3,
    },
}));

export const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
    // Find the highest revenue for percentage calculation
    const maxRevenue = Math.max(...products.map(p => p.revenue));

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'error' };
        if (stock < 10) return { label: 'Low Stock', color: 'warning' };
        return { label: 'In Stock', color: 'success' };
    };

    return (
        <List disablePadding>
            {products.map((product, index) => {
                const stockStatus = getStockStatus(product.stock);
                const revenuePercentage = (product.revenue / maxRevenue) * 100;

                return (
                    <StyledListItem key={product._id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar
                                src={product.image}
                                variant="rounded"
                                sx={{ width: 48, height: 48 }}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="subtitle2" noWrap>
                                        {product.name}
                                    </Typography>
                                    <Chip
                                        label={stockStatus.label}
                                        color={stockStatus.color as any}
                                        size="small"
                                    />
                                </Box>
                            }
                            secondary={
                                <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.sales} sales
                                        </Typography>
                                        <Typography variant="body2" color="text.primary">
                                            {formatCurrency(product.revenue)}
                                        </Typography>
                                    </Box>
                                    <StyledLinearProgress
                                        variant="determinate"
                                        value={revenuePercentage}
                                        color={index === 0 ? 'primary' : 'secondary'}
                                    />
                                </Box>
                            }
                        />
                    </StyledListItem>
                );
            })}
        </List>
    );
};
