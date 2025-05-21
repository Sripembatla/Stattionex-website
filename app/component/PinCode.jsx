"use client";

import React, { useEffect, useState } from "react";
import { usePinCodeVerificationMutation } from "../redux-tookit/services/authApi";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

export default function PinCode({show}) {
  const [showModal, setShowModal] = useState(false);
  const [pincode, setPinCode] = useState("");
  const [error, setError] = useState("");

  const [checkPinCode, { isLoading }] = usePinCodeVerificationMutation();

  useEffect(() => {
    const storedPinCode = localStorage.getItem("userPincode");
    if (!storedPinCode) {
      setShowModal(true);
    }
    if(show){
      setShowModal(true);
    }
  }, [show]);

  const handleSubmit = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Enter a valid 6-digit pincode");
      return;
    }

    try {
      const response = await checkPinCode({ pincode }).unwrap();
      
      // If API verification is successful
      if (response?.success) {
        toast.success(response?.message);
        localStorage.setItem("userPincode", pincode);
        setShowModal(false);
        setError("");
      } else {
        setError(response?.message || "Invalid pincode. Try again.");
        toast.error(response?.message || "Invalid pincode. Try again.");
      }
    } catch (err) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
      toast.error(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-lg flex flex-col items-center text-center space-y-6 relative">
        <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowModal(false)}>
          <Icon icon="material-symbols:close-rounded" color="black" width={24} />
        </div>
        <div className="w-40 md:w-52">
          <img
            src="/assets/images/location.png"
            alt="location"
            className="w-full h-auto object-contain"
          />
        </div>
        <h2 className="text-[#1D2E36] text-2xl font-semibold">
          Select Your Location
        </h2>
        <p className="text-[#7C7C7C] text-base">
          Switch on your location to stay in tune with what’s happening in your area
        </p>
        <div className="w-full text-left space-y-2">
          <label className="text-[#7C7C7C] text-sm">Your Pin Code Zone</label>
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
           setPinCode(e.target.value);
          if (error) {
            setError("");
          }
        }}
            placeholder="Enter 6-digit PIN code"
            className="border-b border-[#7C7C7C] text-[#1D2E36] w-full py-2 focus:outline-none focus:border-[#1D2E36] transition-colors"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#7b9220] text-white px-6 py-2 rounded-xl mt-4 transition disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
