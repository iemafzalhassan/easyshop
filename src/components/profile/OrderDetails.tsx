import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { OrderTable } from "@/components/profile/OrderTable";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { orders } from "@/app/profile/orders/Orders";

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      stiffness: 90,
    },
  },
  exit: {
    opacity: 0,
    x: "100%",
  },
};

type OrderDetailsProps = {
  orderId: string;
};

const status = [
  {
    title: "pending",
    step: 1,
  },
  {
    title: "processing",
    step: 2,
  },
  {
    title: "at local facility",
    step: 3,
  },
  {
    title: "out for delivery",
    step: 4,
  },
  {
    title: "completed",
    step: 5,
  },
];

enum OrderStatus {
  pending = 1,
  processing = 2,
  "at local facility" = 3,
  "out for delivery" = 4,
  completed = 5,
}

const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  return (
    <AnimatePresence>
      {orders.map((od) => {
        return (
          od.id === orderId && (
            <motion.div variants={item} key={od.id}>
              <div className="order-details mt-10">
                <h1 className="font-medium text-lg md:text-2xl">
                  Order Details - {od.orderNumber}
                </h1>
                <div className="bg-accent my-4 rounded-lg p-4">
                  <div className="flex w-full justify-between md:items-center gap-4 flex-wrap">
                    <div className="flex gap-5 items-center">
                      <strong>Order Status : </strong>
                      <div
                        className={`${
                          od.status === "completed"
                            ? "bg-green-200 text-green-600"
                            : "bg-yellow-200 text-yellow-600"
                        } rounded-lg py-1 px-2 capitalize text-sm`}
                      >
                        {od.status}
                      </div>
                    </div>
                    <div className="flex gap-5 items-center">
                      <strong>Payment Method : </strong>
                      <div
                        className={`bg-green-200 text-green-600 rounded-lg py-1 px-2 capitalize text-sm`}
                      >
                        {od.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex text-sm mt-5 w-full justify-between border-b-2 flex-col gap-3 md:flex-row">
                  <div className="left basis-1/2 p-4">
                    <h4 className="">Shipping Address</h4>
                    <p className="text-muted-foreground mt-2">
                      {od.shippingAddress}
                    </p>

                    <h4 className="mt-4">Billing Address</h4>
                    <p className="text-muted-foreground mt-2">
                      {od.billingAddress}
                    </p>
                  </div>
                  <div className="min-h-full w-0.5 bg-input hidden md:block"></div>
                  <div className="right basis-1/2 p-4">
                    <ul>
                      <li className="flex justify-between items-center w-full">
                        <p>Sub Total</p>
                        <p className="text-muted-foreground">${od.amount}</p>
                      </li>
                      <li className="flex justify-between items-center w-full mt-3 border-t pt-3">
                        <p>Discount</p>
                        <p className="text-muted-foreground">$0.00</p>
                      </li>
                      <li className="flex justify-between items-center w-full mt-3 border-t pt-3">
                        <p>Delivery Fee</p>
                        <p className="text-muted-foreground">$50.00</p>
                      </li>
                      <li className="flex justify-between items-center w-full mt-3 border-t pt-3">
                        <p>Tax</p>
                        <p className="text-muted-foreground">$0.21</p>
                      </li>
                      <li className="flex justify-between items-center w-full mt-3 border-t pt-3 font-semibold">
                        <p>Total</p>
                        <p>$64.79</p>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* status */}

                <div className="status mt-5 py-4 flex md:flex-row md:items-center max-w-full overflow-auto flex-col narrowScrollbar">
                  {status.map((sts) => (
                    <div
                      key={sts.step}
                      className="flex flex-row-reverse gap-3 items-center md:flex-col justify-between md:justify-center"
                    >
                      <div className="flex items-center flex-col md:flex-row pr-6 md:pr-0">
                        <div
                          className={`md:w-12 md:h-1 h-6 w-1 ${
                            sts.step === 1 ? "invisible" : ""
                          } ${
                            sts.step <= OrderStatus[od.status]
                              ? "bg-primary"
                              : "bg-input"
                          }`}
                        />
                        <div
                          className={`h-12 w-12 rounded-full border-2 border-dotted border-primary flex justify-center items-center ${
                            sts.step <= OrderStatus[od.status]
                              ? "bg-primary"
                              : "bg-input"
                          }`}
                        >
                          {sts.step <= OrderStatus[od.status] ? (
                            <FaCheck className="text-white" />
                          ) : (
                            sts.step
                          )}
                        </div>
                        <div
                          className={`md:w-12 md:h-1 h-6 w-1 ${
                            sts.step === 5 ? "invisible" : ""
                          } ${
                            sts.step <= OrderStatus[od.status]
                              ? "bg-primary"
                              : "bg-input"
                          }`}
                        />
                      </div>
                      <p className={`text-center capitalize`}>{sts.title}</p>
                    </div>
                  ))}
                </div>

                {/* table */}

                <OrderTable products={od.productItems} />
              </div>
            </motion.div>
          )
        );
      })}
    </AnimatePresence>
  );
};

export default OrderDetails;
