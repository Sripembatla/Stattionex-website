"use client";
import React, { useRef } from 'react';
import Icons from '../CustomIcons/Icons';
import "./style.scss";
import { IMAGE_BASE_URL } from '@/app/utils/constant';
import { Icon } from '@iconify/react';

const OTPForm = () => {
  const inputRefs = useRef([]);

  const handleInputChange = (e, idx) => {
    const value = e.target.value;
    
    // Ensure only numbers are entered
    if (!isNaN(value) && value.length <= 1) {
      // Move to the next input if the value is not empty
      if (value.length === 1 && idx < inputRefs.current.length - 1) {
        inputRefs.current[idx + 1].focus();
      }
    }

    // Handle backspace to move to the previous input
    if (value === "" && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  return (

    <div className=" flex h-screen md:flex">
      {/* Left Side: Image */}
      <div className="otp-image w-1/2 md:w-full relative">
        <img
          src={`${IMAGE_BASE_URL}otp.png`} // Replace with your image path
          alt="OTP Side Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: OTP Form */}
      <div className="otp-form w-1/2 md:w-full flex justify-center items-center bg-gray-100 p-4">
        <div className="w-3/4 max-w-md">
          <div className="back-button mb-4">
            <Icon icon="ep:back" width={25} height={25} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Enter OTP</h2>
          <p className="mb-6 text-gray-600">
            We have shared a code to your registered email address
            <br />
            robertstore@example.com
          </p>
          <div className="flex space-x-4 mb-6 justify-center">
            {/* OTP Input Fields */}
            {Array(4).fill().map((_, idx) => (
              <input
                id="inputs"
                key={idx}
                type="text" // Changed to text to fully control input length
                maxLength="1"
                inputMode="numeric" // Forces numeric keypad on mobile
                pattern="[0-9]*" // Only allows numbers
                className="otp-input w-12 h-12 md:w-10 md:h-10 text-center text-2xl border border-gray-300 rounded-md"
                ref={(el) => (inputRefs.current[idx] = el)} // Reference each input
                onChange={(e) => handleInputChange(e, idx)}
              />
            ))}
          </div>
          <button className="btn-verify w-full h-12 bg-gray-300 rounded-md font-semibold text-white">
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
