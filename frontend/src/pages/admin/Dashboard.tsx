import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    IconButton,
    Button,
    Menu,
    MenuItem,
    CircularProgress
} from '@mui/material';
import {
    MoreVert as MoreIcon,
    TrendingUp as RevenueIcon,
    ShoppingCart as OrdersIcon,
    People as CustomersIcon,
    Inventory as ProductsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { api } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { OrdersTable } from '../../components/admin/OrdersTable';
import { RevenueChart } from '../../components/admin/RevenueChart';
import { OrderStatusChart } from '../../components/admin/OrderStatusChart';
import { TopProducts } from '../../components/admin/TopProducts';
import { formatCurrency } from '../../utils/format';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiCardContent-root': {
        flexGrow: 1,
    },
}));

const StatValue = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
}));

const AdminDashboard: React.FC = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [dateRange, setDateRange] = useState('today'); // today, week, month, year

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, ordersRes] = await Promise.all([
                api.get(`/admin/stats?range=${dateRange}`),
                api.get('/admin/orders/recent')
            ]);

            setStats(statsRes.data.data);
            setRecentOrders(ordersRes.data.data.orders);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error fetching dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleDateRangeChange = (range: string) => {
        setDateRange(range);
        handleMenuClose();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    Dashboard
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        onClick={handleMenuOpen}
                        endIcon={<MoreIcon />}
                    >
                        {dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}
                    </Button>
                    <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => handleDateRangeChange('today')}>Today</MenuItem>
                        <MenuItem onClick={() => handleDateRangeChange('week')}>This Week</MenuItem>
                        <MenuItem onClick={() => handleDateRangeChange('month')}>This Month</MenuItem>
                        <MenuItem onClick={() => handleDateRangeChange('year')}>This Year</MenuItem>
                    </Menu>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <RevenueIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="text.secondary">Revenue</Typography>
                            </Box>
                            <StatValue>
                                {formatCurrency(stats.revenue)}
                            </StatValue>
                            <Typography variant="body2" color={stats.revenueChange >= 0 ? 'success.main' : 'error.main'}>
                                {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}% from last period
                            </Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <OrdersIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="text.secondary">Orders</Typography>
                            </Box>
                            <StatValue>
                                {stats.totalOrders}
                            </StatValue>
                            <Typography variant="body2" color={stats.ordersChange >= 0 ? 'success.main' : 'error.main'}>
                                {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}% from last period
                            </Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CustomersIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="text.secondary">Customers</Typography>
                            </Box>
                            <StatValue>
                                {stats.totalCustomers}
                            </StatValue>
                            <Typography variant="body2" color={stats.customersChange >= 0 ? 'success.main' : 'error.main'}>
                                {stats.customersChange >= 0 ? '+' : ''}{stats.customersChange}% from last period
                            </Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ProductsIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="text.secondary">Products</Typography>
                            </Box>
                            <StatValue>
                                {stats.totalProducts}
                            </StatValue>
                            <Typography variant="body2" color={stats.productsChange >= 0 ? 'success.main' : 'error.main'}>
                                {stats.productsChange >= 0 ? '+' : ''}{stats.productsChange}% from last period
                            </Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Charts */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Revenue Overview
                        </Typography>
                        <RevenueChart data={stats.revenueData} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Status
                        </Typography>
                        <OrderStatusChart data={stats.orderStatusData} />
                    </Paper>
                </Grid>

                {/* Recent Orders */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Orders
                        </Typography>
                        <OrdersTable orders={recentOrders} />
                    </Paper>
                </Grid>

                {/* Top Products */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Top Products
                        </Typography>
                        <TopProducts products={stats.topProducts} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard;
