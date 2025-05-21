"use client";
import React, { useState } from "react";

import Private from "../layout/Private";
import { Icon } from "@iconify/react";
import PriceDetails from "../component/PriceDetails";
import { useRouter } from "next/navigation";

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState("card");

  const paymentMethods = [
    { id: "wallet", label: "Wallet" },
    { id: "upi", label: "UPI" },
    { id: "netbanking", label: "Net Banking" },
    { id: "cod", label: "Cash on delivery" },
    { id: "card", label: "Credit Or Debit Card" },
  ];
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/order-summary");
  };

  const handlePayment = () => {
    router.push('/paymentsuccess');
  }
  return (
    <div>
      <Private>
        <div className="bg-[#e5e7eb]">
          <div
            className="cursor-pointer lg:pl-20 lg:pt-5 "
            onClick={handleBackClick}
          >
            <Icon icon="fe:arrow-left" width={25} height={25} />
          </div>
          <div className="min-h-screen  p-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center items-start ">
            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
              <h2 className="text-xl mb-4 font-semibold border-b pb-2 text-center flex justify-center items-center gap-2">
                {" "}
                <Icon icon="noto:credit-card" color="yellow" width={20} />{" "}
                PAYMENT
              </h2>
              <ul className="space-y-4">
                {paymentMethods.map((method) => (
                  <li
                    key={method.id}
                    className={`cursor-pointer p-2 rounded-lg ${
                      selectedMethod === method.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-300 "
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    {method.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Method Forms */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-80">
              <h2 className="text-xl mb-4 font-semibold border-b pb-2 text-center flex justify-center items-center gap-2">
                <Icon icon="noto:credit-card" color="yellow" width={20} />
                PAYMENT
              </h2>

              {/* Wallet Form */}
              {selectedMethod === "wallet" && (
                <div className="space-y-4">
                  <p>Select your wallet:</p>
                  <select className="w-full p-2 rounded-md bg-gray-300 text-white outline-none">
                    <option>Select Wallet</option>
                    <option>Paytm</option>
                    <option>PhonePe</option>
                    <option>Amazon Pay</option>
                  </select>
                  <button className="bg-primary hover:bg-amber-500 p-3 rounded-lg w-full mt-4" onClick={handlePayment}>
                    Pay with Wallet
                  </button>
                </div>
              )}

              {/* UPI Form */}
              {selectedMethod === "upi" && (
                <div className="space-y-4">
                  <p>Enter UPI ID:</p>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md bg-gray-300 text-white outline-none"
                    placeholder="example@upi"
                  />
                  <button className="bg-primary hover:bg-amber-500 p-3 rounded-lg w-full mt-4" onClick={handlePayment}>
                    Pay with UPI
                  </button>
                </div>
              )}

              {/* Net Banking Form */}
              {selectedMethod === "netbanking" && (
                <div className="space-y-4">
                  <p>Select your bank:</p>
                  <select className="w-full p-2 rounded-md bg-gray-300 text-white outline-none">
                    <option>Select Bank</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                  <button className="bg-primary hover:bg-amber-500 p-3 rounded-lg w-full mt-4" onClick={handlePayment}>
                    Pay with Net Banking
                  </button>
                </div>
              )}

              {/* Cash on Delivery */}
              {selectedMethod === "cod" && (
                <div className="space-y-4">
                  <p>Pay when you receive your order.</p>
                  <button className="bg-primary hover:bg-amber-500 p-3 rounded-lg w-full mt-4" onClick={handlePayment}>
                    Place Order
                  </button>
                </div>
              )}

              {/* Credit/Debit Card Form */}
              {selectedMethod === "card" && (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Card number</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-md bg-gray-300 text-white outline-none"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">
                      Name on the card
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-md bg-gray-300 text-white outline-none"
                      placeholder="Name"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-sm mb-2">MM/YY</label>
                      <input
                        type="text"
                        className="p-2 rounded-md bg-gray-300 text-white outline-none"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">CVC</label>
                      <input
                        type="text"
                        className="p-2 rounded-md bg-gray-300 text-white outline-none w-16 "
                        placeholder="CVC"
                      />
                    </div>
                  </div>
                  <button className="bg-primary hover:bg-amber-500 p-3 rounded-lg w-full mt-4" onClick={handlePayment}>
                    Place Order
                  </button>
                </form>
              )}
            </div>
            {/* Price Details */}
            <PriceDetails />
          </div>
        </div>
      </Private>
    </div>
  );
}
