import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    InputAdornment,
    Grid,
    Dialog,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { UserTable } from '../../components/admin/UserTable';
import { UserForm } from '../../components/admin/UserForm';
import { UserFilters } from '../../components/admin/UserFilters';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`user-tabpanel-${index}`}
            aria-labelledby={`user-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const UserManagement: React.FC = () => {
    const { showToast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        role: 'all',
        status: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [addUserDialog, setAddUserDialog] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchUsers();
    }, [filters, page, rowsPerPage, tabValue]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: rowsPerPage.toString(),
                search: searchQuery,
                role: filters.role !== 'all' ? filters.role : '',
                status: filters.status !== 'all' ? filters.status : '',
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                type: tabValue === 0 ? 'customers' : 'admins'
            });

            const { data } = await api.get(`/admin/users?${queryParams}`);
            setUsers(data.data.users);
            setTotalUsers(data.data.total);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error fetching users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        setPage(0);
    };

    const handleAddUser = async (userData: any) => {
        try {
            await api.post('/admin/users', userData);
            showToast('User added successfully', 'success');
            setAddUserDialog(false);
            fetchUsers();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error adding user', 'error');
        }
    };

    const handleDeleteUsers = async () => {
        try {
            await api.delete('/admin/users', {
                data: { userIds: selectedUsers }
            });
            showToast('Users deleted successfully', 'success');
            setSelectedUsers([]);
            fetchUsers();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error deleting users', 'error');
        }
    };

    const handleBulkUpdate = async (updateData: any) => {
        try {
            await api.patch('/admin/users/bulk', {
                userIds: selectedUsers,
                ...updateData
            });
            showToast('Users updated successfully', 'success');
            setSelectedUsers([]);
            fetchUsers();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error updating users', 'error');
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setPage(0);
        setSelectedUsers([]);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">
                        User Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setAddUserDialog(true)}
                    >
                        Add User
                    </Button>
                </Box>

                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Customers" />
                    <Tab label="Administrators" />
                </Tabs>
            </Box>

            {/* Search and Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filters
                            </Button>
                            {selectedUsers.length > 0 && (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleDeleteUsers}
                                    >
                                        Delete Selected ({selectedUsers.length})
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {/* Show bulk update dialog */}}
                                    >
                                        Update Selected
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {showFilters && (
                    <Box sx={{ mt: 2 }}>
                        <UserFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </Box>
                )}
            </Paper>

            {/* Users Table */}
            <TabPanel value={tabValue} index={0}>
                <Paper>
                    <UserTable
                        users={users}
                        loading={loading}
                        selected={selectedUsers}
                        onSelectChange={setSelectedUsers}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalUsers={totalUsers}
                        onPageChange={setPage}
                        onRowsPerPageChange={setRowsPerPage}
                        onRefresh={fetchUsers}
                        userType="customer"
                    />
                </Paper>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Paper>
                    <UserTable
                        users={users}
                        loading={loading}
                        selected={selectedUsers}
                        onSelectChange={setSelectedUsers}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalUsers={totalUsers}
                        onPageChange={setPage}
                        onRowsPerPageChange={setRowsPerPage}
                        onRefresh={fetchUsers}
                        userType="admin"
                    />
                </Paper>
            </TabPanel>

            {/* Add User Dialog */}
            <Dialog
                open={addUserDialog}
                onClose={() => setAddUserDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <UserForm
                    onSubmit={handleAddUser}
                    onCancel={() => setAddUserDialog(false)}
                    userType={tabValue === 0 ? 'customer' : 'admin'}
                />
            </Dialog>
        </Container>
    );
};

export default UserManagement;
