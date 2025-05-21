"use client";
import { toast } from "react-toastify";

// Payment function, no button needed
const initiateRazorpayPayment = async ({ amount, userInfo, onSuccess, onFailure , OrderResponse}) => {
  console.log("OrderResponse1", OrderResponse);
  console.log("userInfo1", userInfo);
  console.log("amount1ss", amount);
  
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const isLoaded = await loadRazorpay();
  if (!isLoaded) {
    toast.error("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Replace with your Razorpay key
    amount: amount * 100 , // Convert to smallest currency unit (e.g., paise)
    currency: "INR",
    order_id: OrderResponse?.razorpayOrderId,
    name: "FMAI",
    description: "Test Transaction",
    image: "./assets/images/logo.png",
    handler: (response) => {
      console.log("responsepay", response);
      
      if (response) {
        toast.success("Payment Successful!");
        onSuccess(response);
      } else {
        toast.error("Payment Failed!");
        onFailure && onFailure(response); // Trigger the failure callback if provided
      }
    },
    prefill: {
      name: "John Doe",
      email: "john.doe@example.com",
      contact: "9876543210",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

export default initiateRazorpayPayment;
