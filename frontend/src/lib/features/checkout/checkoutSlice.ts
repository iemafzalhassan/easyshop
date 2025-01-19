import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AddressType {
  title: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  pinCode: string;
  streetAddress: string;
}

interface CheckoutState {
  shippingAddress: AddressType | null;
  billingAddress: AddressType | null;
}

const initialState: CheckoutState = {
  shippingAddress: null,
  billingAddress: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingAddress: (state, action: PayloadAction<AddressType>) => {
      state.shippingAddress = action.payload;
    },
    setBillingAddress: (state, action: PayloadAction<AddressType>) => {
      state.billingAddress = action.payload;
    },
    clearCheckoutData: (state) => {
      state.shippingAddress = null;
      state.billingAddress = null;
    },
  },
});

export const { setShippingAddress, setBillingAddress, clearCheckoutData } = checkoutSlice.actions;
export default checkoutSlice.reducer;
