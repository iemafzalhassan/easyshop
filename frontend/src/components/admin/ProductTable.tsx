import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Checkbox,
    IconButton,
    Box,
    Typography,
    Avatar,
    Chip,
    Menu,
    MenuItem,
    CircularProgress,
    Link
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/format';

interface ProductTableProps {
    products: any[];
    loading: boolean;
    selected: string[];
    onSelectChange: (selected: string[]) => void;
    page: number;
    rowsPerPage: number;
    totalProducts: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    onRefresh: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    loading,
    selected,
    onSelectChange,
    page,
    rowsPerPage,
    totalProducts,
    onPageChange,
    onRowsPerPageChange,
    onRefresh
}) => {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            onSelectChange(products.map(product => product._id));
        } else {
            onSelectChange([]);
        }
    };

    const handleSelectOne = (productId: string) => {
        const selectedIndex = selected.indexOf(productId);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, productId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        onSelectChange(newSelected);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: any) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedProduct(null);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'error' };
        if (stock < 10) return { label: 'Low Stock', color: 'warning' };
        return { label: 'In Stock', color: 'success' };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={products.length > 0 && selected.length === products.length}
                                    indeterminate={selected.length > 0 && selected.length < products.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Stock</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Updated</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => {
                            const isSelected = selected.indexOf(product._id) !== -1;
                            const stockStatus = getStockStatus(product.stock);

                            return (
                                <TableRow
                                    hover
                                    key={product._id}
                                    selected={isSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => handleSelectOne(product._id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={product.images[0]?.url}
                                                variant="rounded"
                                                sx={{ width: 40, height: 40, mr: 2 }}
                                            />
                                            <Box>
                                                <Link
                                                    component={RouterLink}
                                                    to={`/admin/products/${product._id}`}
                                                    color="inherit"
                                                    underline="hover"
                                                >
                                                    <Typography variant="subtitle2">
                                                        {product.name}
                                                    </Typography>
                                                </Link>
                                                <Typography variant="body2" color="text.secondary">
                                                    SKU: {product.sku}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.category}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatCurrency(product.price)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {product.stock}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={stockStatus.label}
                                            color={stockStatus.color as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(product.updatedAt), 'PP')}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={(e) => handleMenuOpen(e, product)}
                                            size="small"
                                        >
                                            <MoreIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalProducts}
                page={page}
                onPageChange={(event, newPage) => onPageChange(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />

            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    component={RouterLink}
                    to={`/admin/products/${selectedProduct?._id}`}
                >
                    <ViewIcon fontSize="small" sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem
                    component={RouterLink}
                    to={`/admin/products/${selectedProduct?._id}/edit`}
                >
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
};
