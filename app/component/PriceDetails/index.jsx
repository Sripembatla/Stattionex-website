import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function PriceDetails() {
  const cartData = useSelector((state) => state.cart);
  console.log("cartData", cartData);
  

  

  return (
    <div className="bg-white border p-8 rounded-lg shadow-sm space-y-4 flex-col ">
      <div>
        <h2 className="text-xl font-bold text-center mb-2">Price Details</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p>Price ({cartData?.cartItems.length} items)</p>
            <p className="font-semibold">Rs. { cartData.totalPrice}</p>
          </div>
          <div className="flex justify-between">
            <p>Quantity</p>
            <p className="font-semibold">{cartData.totalQuantity}</p>
          </div>
          {/* <div className="flex justify-between">
            <p>Taxes</p>
            <p className="font-semibold">{cartData.taxValue}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Charges</p>
            <p className="font-semibold">Rs. { cartData?.deliveryCharges}</p>
          </div>
          <div className="flex justify-between border-t border-gray-600 pt-2">
            <p className="font-semibold">Total Payable</p>
            <p className="font-bold">Rs. {cartData?.grossTotalValue.toFixed(2) }</p>
          </div> */}
          {/* <p className="text-green-400 font-bold">
            Your Total Saving this Order Rs. 0
          </p> */}
        </div>
      </div>
    </div>
  );
}