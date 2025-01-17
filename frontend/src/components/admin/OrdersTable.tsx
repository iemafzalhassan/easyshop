import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Menu,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box
} from '@mui/material';
import {
    MoreVert as MoreIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/format';

interface OrdersTableProps {
    orders: any[];
    onOrderUpdate?: () => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
    orders,
    onOrderUpdate
}) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [trackingInfo, setTrackingInfo] = useState({
        status: '',
        location: '',
        description: ''
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: any) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedOrder(order);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedOrder(null);
    };

    const handleUpdateStatus = () => {
        setUpdateDialogOpen(true);
        handleMenuClose();
    };

    const handleUpdateSubmit = async () => {
        try {
            await api.post(`/orders/${selectedOrder._id}/tracking`, trackingInfo);
            showToast('Order status updated successfully', 'success');
            setUpdateDialogOpen(false);
            onOrderUpdate?.();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error updating order status', 'error');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'info';
            case 'processing':
                return 'warning';
            case 'shipped':
                return 'primary';
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((order) => (
                                <TableRow key={order._id} hover>
                                    <TableCell>
                                        <Button
                                            color="primary"
                                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                                        >
                                            #{order._id.slice(-6)}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{order.user.name}</TableCell>
                                    <TableCell>
                                        {format(new Date(order.createdAt), 'PPp')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.orderStatus}
                                            color={getStatusColor(order.orderStatus)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatCurrency(order.totalAmount)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={(e) => handleMenuOpen(e, order)}
                                            size="small"
                                        >
                                            <MoreIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={orders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleUpdateStatus}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Update Status
                </MenuItem>
                <MenuItem onClick={() => navigate(`/admin/orders/${selectedOrder?._id}`)}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
            </Menu>

            <Dialog
                open={updateDialogOpen}
                onClose={() => setUpdateDialogOpen(false)}
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
                            value={trackingInfo.status}
                            onChange={(e) => setTrackingInfo(prev => ({
                                ...prev,
                                status: e.target.value
                            }))}
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
                            value={trackingInfo.location}
                            onChange={(e) => setTrackingInfo(prev => ({
                                ...prev,
                                location: e.target.value
                            }))}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={trackingInfo.description}
                            onChange={(e) => setTrackingInfo(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdateSubmit}
                        disabled={!trackingInfo.status || !trackingInfo.location || !trackingInfo.description}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
