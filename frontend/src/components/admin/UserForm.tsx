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
    Switch,
    FormControlLabel,
    Avatar,
    IconButton
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface UserFormProps {
    initialValues?: any;
    onSubmit: (values: any) => void;
    onCancel: () => void;
    userType: 'customer' | 'admin';
}

const phoneRegExp = /^(\+?\d{1,3}[- ]?)?\d{10}$/;

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    phone: Yup.string()
        .matches(phoneRegExp, 'Invalid phone number')
        .nullable(),
    password: Yup.string()
        .when('isNewUser', {
            is: true,
            then: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                )
        }),
    confirmPassword: Yup.string()
        .when('password', {
            is: (val: string) => val && val.length > 0,
            then: Yup.string()
                .required('Please confirm password')
                .oneOf([Yup.ref('password')], 'Passwords must match')
        }),
    role: Yup.string()
        .required('Role is required'),
    isActive: Yup.boolean(),
    isVerified: Yup.boolean()
});

export const UserForm: React.FC<UserFormProps> = ({
    initialValues,
    onSubmit,
    onCancel,
    userType
}) => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        initialValues?.avatar || null
    );

    const formik = useFormik({
        initialValues: {
            isNewUser: !initialValues,
            name: initialValues?.name || '',
            email: initialValues?.email || '',
            phone: initialValues?.phone || '',
            password: '',
            confirmPassword: '',
            role: initialValues?.role || userType,
            isActive: initialValues?.isActive ?? true,
            isVerified: initialValues?.isVerified ?? false,
            avatar: null as File | null
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (key === 'avatar' && values.avatar) {
                    formData.append('avatar', values.avatar);
                } else if (key !== 'confirmPassword' && key !== 'isNewUser') {
                    formData.append(key, values[key]);
                }
            });
            onSubmit(formData);
        }
    });

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            formik.setFieldValue('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        formik.setFieldValue('avatar', null);
        setAvatarPreview(null);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <DialogTitle>
                {initialValues ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            
            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Avatar Upload */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={avatarPreview}
                                sx={{ width: 100, height: 100, mb: 1 }}
                            />
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    size="small"
                                    startIcon={<UploadIcon />}
                                >
                                    Upload
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </Button>
                                {avatarPreview && (
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={handleRemoveAvatar}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Basic Information */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Basic Information
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Name"
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
                            label="Email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Role"
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                            error={formik.touched.role && Boolean(formik.errors.role)}
                            helperText={formik.touched.role && formik.errors.role}
                        >
                            <MenuItem value="customer">Customer</MenuItem>
                            <MenuItem value="admin">Administrator</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Password Section */}
                    {(!initialValues || formik.values.isNewUser) && (
                        <>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Password
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                        </>
                    )}

                    {/* Status */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Account Status
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="isActive"
                                    checked={formik.values.isActive}
                                    onChange={formik.handleChange}
                                />
                            }
                            label="Active Account"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="isVerified"
                                    checked={formik.values.isVerified}
                                    onChange={formik.handleChange}
                                />
                            }
                            label="Verified Account"
                        />
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
                    {initialValues ? 'Update User' : 'Add User'}
                </Button>
            </DialogActions>
        </form>
    );
};
