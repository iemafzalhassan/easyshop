import React from "react";
import Orders from "./Orders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders - EasyShop",
  description: "View and track all your orders from EasyShop.",
};

const OrderPage = () => {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      <Orders />
    </div>
  );
};

export default OrderPage;
