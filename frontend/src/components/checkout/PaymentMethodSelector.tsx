import React from 'react';
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
    Stack,
    Button
} from '@mui/material';
import {
    CreditCard as CardIcon,
    AccountBalance as UPIIcon,
    LocalShipping as CODIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface PaymentMethodSelectorProps {
    selectedMethod: 'card' | 'upi' | 'cod';
    onMethodSelect: (method: 'card' | 'upi' | 'cod') => void;
}

const StyledMethodPaper = styled(Paper)<{ selected?: boolean }>(({ theme, selected }) => ({
    padding: theme.spacing(2),
    cursor: 'pointer',
    border: `2px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
    '&:hover': {
        borderColor: theme.palette.primary.light,
    },
}));

const PaymentIcon = styled(Box)(({ theme }) => ({
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: theme.palette.action.hover,
}));

const paymentMethods = [
    {
        id: 'card',
        title: 'Credit/Debit Card',
        description: 'Pay securely with your credit or debit card',
        icon: CardIcon,
    },
    {
        id: 'upi',
        title: 'UPI Payment',
        description: 'Pay using UPI apps like Google Pay, PhonePe, or Paytm',
        icon: UPIIcon,
    },
    {
        id: 'cod',
        title: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        icon: CODIcon,
    },
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
    selectedMethod,
    onMethodSelect,
}) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Select Payment Method
            </Typography>

            <Stack spacing={2}>
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                        <StyledMethodPaper
                            key={method.id}
                            selected={selectedMethod === method.id}
                            onClick={() => onMethodSelect(method.id as 'card' | 'upi' | 'cod')}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PaymentIcon>
                                    <Icon color={selectedMethod === method.id ? 'primary' : 'action'} />
                                </PaymentIcon>
                                <Box sx={{ ml: 2, flex: 1 }}>
                                    <Typography variant="subtitle1">
                                        {method.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {method.description}
                                    </Typography>
                                </Box>
                                <Radio
                                    checked={selectedMethod === method.id}
                                    onChange={() => onMethodSelect(method.id as 'card' | 'upi' | 'cod')}
                                />
                            </Box>
                        </StyledMethodPaper>
                    );
                })}
            </Stack>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    onClick={() => window.history.back()}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={() => onMethodSelect(selectedMethod)}
                >
                    Continue
                </Button>
            </Box>
        </Box>
    );
};
