import React from 'react';
import {
    Grid,
    TextField,
    MenuItem,
    InputAdornment,
    Button,
    Box
} from '@mui/material';

interface ProductFiltersProps {
    filters: {
        category: string;
        minPrice: string;
        maxPrice: string;
        stock: string;
        sortBy: string;
        sortOrder: string;
    };
    categories: string[];
    onFilterChange: (filters: any) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
    filters,
    categories,
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
            category: 'all',
            minPrice: '',
            maxPrice: '',
            stock: 'all',
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
                        label="Category"
                        value={filters.category}
                        onChange={handleChange('category')}
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        label="Min Price"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleChange('minPrice')}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        label="Max Price"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleChange('maxPrice')}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        select
                        fullWidth
                        label="Stock Status"
                        value={filters.stock}
                        onChange={handleChange('stock')}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="in_stock">In Stock</MenuItem>
                        <MenuItem value="low_stock">Low Stock</MenuItem>
                        <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        select
                        fullWidth
                        label="Sort By"
                        value={filters.sortBy}
                        onChange={handleChange('sortBy')}
                    >
                        <MenuItem value="createdAt">Date Added</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="price">Price</MenuItem>
                        <MenuItem value="stock">Stock</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={1}>
                    <TextField
                        select
                        fullWidth
                        label="Order"
                        value={filters.sortOrder}
                        onChange={handleChange('sortOrder')}
                    >
                        <MenuItem value="asc">Asc</MenuItem>
                        <MenuItem value="desc">Desc</MenuItem>
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
