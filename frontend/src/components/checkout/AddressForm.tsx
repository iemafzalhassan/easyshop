import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface AddressFormProps {
    addresses: any[];
    selectedAddress: any;
    onAddressSelect: (address: any) => void;
}

const StyledAddressPaper = styled(Paper)<{ selected?: boolean }>(({ theme, selected }) => ({
    padding: theme.spacing(2),
    cursor: 'pointer',
    border: `2px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
    '&:hover': {
        borderColor: theme.palette.primary.light,
    },
}));

const addressSchema = yup.object().shape({
    type: yup.string().required('Address type is required'),
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    pinCode: yup.string()
        .required('PIN code is required')
        .matches(/^[0-9]{6}$/, 'Invalid PIN code'),
    phone: yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Invalid phone number'),
    isDefault: yup.boolean()
});

export const AddressForm: React.FC<AddressFormProps> = ({
    addresses,
    selectedAddress,
    onAddressSelect
}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(addressSchema),
        defaultValues: editingAddress || {
            type: 'home',
            isDefault: false
        }
    });

    const handleAddAddress = (data: any) => {
        // In a real app, you would make an API call here
        onAddressSelect(data);
        setShowAddForm(false);
        reset();
    };

    const handleEditAddress = (address: any) => {
        setEditingAddress(address);
        setShowAddForm(true);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                    Select Delivery Address
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setEditingAddress(null);
                        setShowAddForm(true);
                    }}
                >
                    Add New Address
                </Button>
            </Box>

            <RadioGroup
                value={selectedAddress?._id || ''}
                onChange={(e) => {
                    const address = addresses.find(addr => addr._id === e.target.value);
                    if (address) onAddressSelect(address);
                }}
            >
                <Grid container spacing={2}>
                    {addresses.map((address) => (
                        <Grid item xs={12} key={address._id}>
                            <StyledAddressPaper
                                selected={selectedAddress?._id === address._id}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <FormControlLabel
                                        value={address._id}
                                        control={<Radio />}
                                        label=""
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="subtitle1">
                                                {address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address
                                                {address.isDefault && (
                                                    <Typography
                                                        component="span"
                                                        variant="caption"
                                                        sx={{ ml: 1, color: 'primary.main' }}
                                                    >
                                                        (Default)
                                                    </Typography>
                                                )}
                                            </Typography>
                                            <Button
                                                size="small"
                                                startIcon={<EditIcon />}
                                                onClick={() => handleEditAddress(address)}
                                            >
                                                Edit
                                            </Button>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {address.street}
                                            <br />
                                            {address.city}, {address.state}
                                            <br />
                                            {address.country} - {address.pinCode}
                                            <br />
                                            Phone: {address.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            </StyledAddressPaper>
                        </Grid>
                    ))}
                </Grid>
            </RadioGroup>

            <Dialog
                open={showAddForm}
                onClose={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    reset();
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
                <form onSubmit={handleSubmit(handleAddAddress)}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Address Type</InputLabel>
                                    <Select
                                        {...register('type')}
                                        error={!!errors.type}
                                        label="Address Type"
                                    >
                                        <MenuItem value="home">Home</MenuItem>
                                        <MenuItem value="work">Work</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('street')}
                                    label="Street Address"
                                    fullWidth
                                    error={!!errors.street}
                                    helperText={errors.street?.message}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('city')}
                                    label="City"
                                    fullWidth
                                    error={!!errors.city}
                                    helperText={errors.city?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('state')}
                                    label="State"
                                    fullWidth
                                    error={!!errors.state}
                                    helperText={errors.state?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('country')}
                                    label="Country"
                                    fullWidth
                                    error={!!errors.country}
                                    helperText={errors.country?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('pinCode')}
                                    label="PIN Code"
                                    fullWidth
                                    error={!!errors.pinCode}
                                    helperText={errors.pinCode?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('phone')}
                                    label="Phone Number"
                                    fullWidth
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <input
                                            type="checkbox"
                                            {...register('isDefault')}
                                        />
                                    }
                                    label="Set as default address"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setShowAddForm(false);
                                setEditingAddress(null);
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            {editingAddress ? 'Save Changes' : 'Add Address'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {selectedAddress && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={() => onAddressSelect(selectedAddress)}
                    >
                        Deliver to this Address
                    </Button>
                </Box>
            )}
        </Box>
    );
};
