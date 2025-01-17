import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    Avatar,
    Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';

interface OrderItemsProps {
    items: Array<{
        product: {
            _id: string;
            name: string;
            images: Array<{ url: string }>;
            stock: number;
        };
        quantity: number;
        price: number;
    }>;
}

export const OrderItems: React.FC<OrderItemsProps> = ({ items }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.product._id}>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        src={item.product.images[0]?.url}
                                        variant="rounded"
                                        sx={{ width: 48, height: 48, mr: 2 }}
                                    />
                                    <Box>
                                        <Link
                                            component={RouterLink}
                                            to={`/admin/products/${item.product._id}`}
                                            color="inherit"
                                            underline="hover"
                                        >
                                            <Typography variant="subtitle2">
                                                {item.product.name}
                                            </Typography>
                                        </Link>
                                        <Typography variant="body2" color="text.secondary">
                                            Stock: {item.product.stock}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell align="right">
                                {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell align="right">
                                {item.quantity}
                            </TableCell>
                            <TableCell align="right">
                                {formatCurrency(item.price * item.quantity)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
