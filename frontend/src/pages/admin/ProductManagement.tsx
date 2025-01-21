import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    Grid,
    MenuItem,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { api } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { ProductTable } from '../../components/admin/ProductTable';
import { ProductForm } from '../../components/admin/ProductForm';
import { ProductFilters } from '../../components/admin/ProductFilters';

const ProductManagement = () => {
    const router = useRouter();
    const { showToast } = useToast();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: 'all',
        minPrice: '',
        maxPrice: '',
        stock: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [addProductDialog, setAddProductDialog] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [filters, page, rowsPerPage]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: rowsPerPage.toString(),
                search: searchQuery,
                category: filters.category !== 'all' ? filters.category : '',
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                stock: filters.stock !== 'all' ? filters.stock : '',
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            });

            const { data } = await api.get(`/admin/products?${queryParams}`);
            setProducts(data.data.products);
            setTotalProducts(data.data.total);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error fetching products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/admin/categories');
            setCategories(data.data.categories);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error fetching categories', 'error');
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

    const handleAddProduct = async (productData: any) => {
        try {
            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                if (key === 'images') {
                    productData[key].forEach((image: File) => {
                        formData.append('images', image);
                    });
                } else {
                    formData.append(key, productData[key]);
                }
            });

            await api.post('/admin/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showToast('Product added successfully', 'success');
            setAddProductDialog(false);
            fetchProducts();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error adding product', 'error');
        }
    };

    const handleDeleteProducts = async () => {
        try {
            await api.delete('/admin/products', {
                data: { productIds: selectedProducts }
            });
            showToast('Products deleted successfully', 'success');
            setSelectedProducts([]);
            fetchProducts();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error deleting products', 'error');
        }
    };

    const handleBulkUpdate = async (updateData: any) => {
        try {
            await api.patch('/admin/products/bulk', {
                productIds: selectedProducts,
                ...updateData
            });
            showToast('Products updated successfully', 'success');
            setSelectedProducts([]);
            fetchProducts();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error updating products', 'error');
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    Product Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddProductDialog(true)}
                >
                    Add Product
                </Button>
            </Box>

            {/* Search and Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search products..."
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
                            {selectedProducts.length > 0 && (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleDeleteProducts}
                                    >
                                        Delete Selected ({selectedProducts.length})
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
                        <ProductFilters
                            filters={filters}
                            categories={categories}
                            onFilterChange={handleFilterChange}
                        />
                    </Box>
                )}
            </Paper>

            {/* Products Table */}
            <Paper>
                <ProductTable
                    products={products}
                    loading={loading}
                    selected={selectedProducts}
                    onSelectChange={setSelectedProducts}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalProducts={totalProducts}
                    onPageChange={setPage}
                    onRowsPerPageChange={setRowsPerPage}
                    onRefresh={fetchProducts}
                />
            </Paper>

            {/* Add Product Dialog */}
            <Dialog
                open={addProductDialog}
                onClose={() => setAddProductDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <ProductForm
                    onSubmit={handleAddProduct}
                    onCancel={() => setAddProductDialog(false)}
                    categories={categories}
                />
            </Dialog>
        </Container>
    );
};

export default ProductManagement;
