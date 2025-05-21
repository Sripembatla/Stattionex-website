"use client";
import { useState, useEffect } from "react";
import Private from "../layout/Private";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeBuyNow } from "../redux-tookit/cart/cartSlicer";

export default function Payment() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  // useEffect(() => {
    
  //   // Redirect to home after 30 seconds
  //   const timeout = setTimeout(() => {
  //     router.push("/");
  //   }, 15000);

  //   return () => clearTimeout(timeout); // Cleanup on unmount
  // }, []);

  return (
    <div>
      <Private>
        <div className="lg:min-h-screen p-8 flex flex-col space-y-4 md:space-y-0 md:space-x-4 ">
          <div className="container">
            <div className="flex flex-col">
              <p className="text-[24px] font-normal text-[#1D2E36]">
                Orders
              </p>
              <div className="mt-4 border-b border-[#a5a5a5]"></div>
              </div>

            <div className="flex flex-col justify-center items-center rounded-xl border border-[#a5a5a5] p-2 md:p-4 mt-4">
              <div className="w-[106px] h-[106px] flex justify-center items-center">
                <img src="/assets/images/tic.png" alt="" />
              </div>
              <div className="mt-4 flex justify-center items-center">
                <p className="text-[#1d2e36] text-[22px] md:text-[28px] font-normal text-center">Order 166347806 is created successfully</p>
              </div>
              <div className="mt-4 flex gap-2 items-center justify-center">
                <p className="text-[#7b9220] text-[20px] md:text-[24px] font-normal underline text-center" onClick={() => router.push("/orders")}>View Order</p>
                <p className="text-[#a5a5a5] text-[14px] md:text-[18px] font-normal text-center "> Or</p>
                <p className="text-[#7b9220] text-[20px] md:text-[24px] font-normal underline text-center" onClick={() => router.push("/")}>Continue Shopping</p>
              </div>
              <div className="mt-4">
              <p className="text-[#7b9220] text-[16px] md:text-[20px] font-normal text-center">You Saved Rs. 0</p>
              </div>
              <div className="mt-4">
                <p className="text-[#1d2e36] text-[18px] md:text-[22px] text-center">You can add or remove items from this order once it is confirmed</p>
              </div>
            </div>
          </div>
          
        </div>
      </Private>
    </div>
  );
}
