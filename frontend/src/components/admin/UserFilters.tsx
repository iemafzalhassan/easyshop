import React from 'react';
import {
    Grid,
    TextField,
    MenuItem,
    Button,
    Box
} from '@mui/material';

interface UserFiltersProps {
    filters: {
        role: string;
        status: string;
        sortBy: string;
        sortOrder: string;
    };
    onFilterChange: (filters: any) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
    filters,
    onFilterChange
}) => {
    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({
            ...filters,
            [field]: event.target.value
        });
    };

    const handleReset = () => {
        onFilterChange({
            role: 'all',
            status: 'all',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Role"
                        value={filters.role}
                        onChange={handleChange('role')}
                    >
                        <MenuItem value="all">All Roles</MenuItem>
                        <MenuItem value="customer">Customer</MenuItem>
                        <MenuItem value="admin">Administrator</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        value={filters.status}
                        onChange={handleChange('status')}
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="verified">Verified</MenuItem>
                        <MenuItem value="unverified">Unverified</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Sort By"
                        value={filters.sortBy}
                        onChange={handleChange('sortBy')}
                    >
                        <MenuItem value="createdAt">Date Joined</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="lastActiveAt">Last Active</MenuItem>
                        <MenuItem value="totalOrders">Total Orders</MenuItem>
                        <MenuItem value="totalSpent">Total Spent</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Order"
                        value={filters.sortOrder}
                        onChange={handleChange('sortOrder')}
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{ mr: 1 }}
                >
                    Reset Filters
                </Button>
            </Box>
        </Box>
    );
};
