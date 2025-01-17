import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Grid,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    InputAdornment,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ProductFormProps {
    initialValues?: any;
    onSubmit: (values: any) => void;
    onCancel: () => void;
    categories: string[];
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Product name is required')
        .min(3, 'Product name must be at least 3 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be greater than or equal to 0'),
    stock: Yup.number()
        .required('Stock is required')
        .min(0, 'Stock must be greater than or equal to 0')
        .integer('Stock must be a whole number'),
    category: Yup.string()
        .required('Category is required'),
    sku: Yup.string()
        .required('SKU is required')
        .matches(/^[A-Za-z0-9-]+$/, 'SKU can only contain letters, numbers, and hyphens'),
    images: Yup.array()
        .min(1, 'At least one image is required')
        .max(5, 'Maximum 5 images allowed')
});

export const ProductForm: React.FC<ProductFormProps> = ({
    initialValues,
    onSubmit,
    onCancel,
    categories
}) => {
    const [previewImages, setPreviewImages] = useState<string[]>(
        initialValues?.images?.map((img: any) => img.url) || []
    );

    const formik = useFormik({
        initialValues: initialValues || {
            name: '',
            description: '',
            price: '',
            stock: '',
            category: '',
            sku: '',
            images: []
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        }
    });

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files);
            const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
            
            formik.setFieldValue('images', [
                ...formik.values.images,
                ...newImages
            ].slice(0, 5));
            
            setPreviewImages(prevImages => [
                ...prevImages,
                ...newPreviewUrls
            ].slice(0, 5));
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formik.values.images];
        newImages.splice(index, 1);
        formik.setFieldValue('images', newImages);

        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <DialogTitle>
                {initialValues ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            
            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Basic Information
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="SKU"
                            name="sku"
                            value={formik.values.sku}
                            onChange={formik.handleChange}
                            error={formik.touched.sku && Boolean(formik.errors.sku)}
                            helperText={formik.touched.sku && formik.errors.sku}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>

                    {/* Pricing and Inventory */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Pricing & Inventory
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Stock"
                            name="stock"
                            type="number"
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                            helperText={formik.touched.stock && formik.errors.stock}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Category"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Images */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Product Images
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadIcon />}
                                disabled={previewImages.length >= 5}
                            >
                                Upload Images
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Button>
                            {formik.touched.images && formik.errors.images && (
                                <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                                    {formik.errors.images as string}
                                </Typography>
                            )}
                        </Box>

                        <ImageList sx={{ maxHeight: 200 }} cols={5} rowHeight={100}>
                            {previewImages.map((image, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        loading="lazy"
                                        style={{ height: '100%', objectFit: 'cover' }}
                                    />
                                    <ImageListItemBar
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'white' }}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                >
                    {initialValues ? 'Update Product' : 'Add Product'}
                </Button>
            </DialogActions>
        </form>
    );
};
