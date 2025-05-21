"use client";
import React, { useState, useEffect, useRef } from "react";
import { useCompleteProfileMutation, useLoginEmailMutation, useOtpVerificationMutation } from "../redux-tookit/services/authApi";
import { useForm } from "react-hook-form";
import TextInput from "../component/TextInput";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux-tookit/features/authSlice";

const Auth = () => {
  const [storedEmail, setStoredEmail] = useState("");
  const [steps, setSteps] = useState(null);
  const [timer, setTimer] = useState(120);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const dispatch = useDispatch();

  const [checkEmail, { isLoading: emailLoading }] = useLoginEmailMutation();
  const [checkOTP, { isLoading: otpLoading }] = useOtpVerificationMutation();
  const [completeProfile, { isLoading: profileLoading }] = useCompleteProfileMutation();
  const router = useRouter();

  const inputRefs = useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const EmailVerification = async (value) => {
    try {
      const result = await checkEmail(value).unwrap();
      if (result?.success) {
        setStoredEmail(value.email);
        setSteps("otp");
        reset();
      }
    } catch (error) {

    }
  }

  const OTPVerification = async (value) => {
    try {
      const result = await checkOTP({ email: storedEmail, ...value }).unwrap();
      if (result?.isNewUser === true) {
        console.log("result", result);

        setSteps("profile");
        reset();
      } else {
        reset();
        await dispatch(
          setCredentials({
            accessToken: result?.token,
            user: result?.user,
          })
        )

        router.push("/");
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (steps === "otp" && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown); // Cleanup on component unmount
    }
  }, [steps, timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    try {
      console.log("Email for Resend OTP:", storedEmail);
      if (!storedEmail) {
        toast.error("Email is required to resend OTP.");
        return;
      }

      setResendOtpLoading(true);
      const result = await checkEmail({ email: storedEmail }).unwrap();
      if (result?.success) {
        // toast.success(result?.message || "OTP resent successfully.");
        setTimer(120); // Reset timer
      }
    } catch (error) {
      // toast.error(error?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendOtpLoading(false);
    }
  };


  const onSubmit = async (value) => {
    try {
      const result = await completeProfile({ email: storedEmail, ...value }).unwrap();
      if (result?.success) {
        await dispatch(
          setCredentials({
            accessToken: result?.token,
            user: result?.user,
          })
        )

        router.push("/");
      }
    } catch (error) {
    }
  };

  const onSubmitOTP = (data) => {
    console.log("data", data);

    const finalData = {
      ...data,
      otp: data.otp.join(""), // "1234" instead of ["1", "2", "3", "4"]
    };

    OTPVerification(finalData);
  };



  return (
    <div
      className="bg-white rounded-lg w-full h-screen  relative flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full h-[380px] ">
        <img
          src="/assets/images/mobileLogin.png"
          alt="login"
          className="w-full h-full object-cover rounded-b-lg"
        />
      </div>

      <div className="w-full p-4">
        {steps === "otp" ? (
          <form onSubmit={handleSubmit(onSubmitOTP)}>
            <div className="flex flex-col  w-full">
              <div className="text-[#1D2E36] text-[20px] text-center mb-2">OTP</div>
              <label className="text-[#1D2E36] text-[12px]">Verify Email OTP</label>
              <div className="flex justify-center gap-2 my-4">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    {...register(`otp[${i}]`, {
                      required: "Required",
                      pattern: {
                        value: /^[0-9]$/,
                        message: "Only numbers allowed",
                      },
                    })}
                    className="w-10 h-10 text-center text-[14px] bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#7b9220]"
                    onChange={(e) => handleInputChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    ref={(el) => {
                      register(`otp[${i}]`).ref(el);
                       (inputRefs.current[i] = el);
                      }}
                  />
                ))}
              </div>

              <p className="text-gray-400 text-[12px] text-center">
                Enter <span className="text-[#7b9220]">OTP</span> sent to your email. Valid for <span className="text-[#7b9220]">2min</span>
              </p>

              <button
                type="submit"
                className="w-full mt-6 py-2 px-4 rounded-lg bg-[#7b9220] text-white"
                disabled={otpLoading}
              >
                {otpLoading ? "Verifying..." : "Continue"}
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-[#1D2E36]">Did not receive the OTP?</p>
                {timer > 0 ? (
                  <p className="text-sm text-[#1D2E36]">Resend OTP in {formatTime(timer)}</p>
                ) : (
                  <button
                    type="button"
                    className="mt-2 py-2 px-4 w-full rounded-lg bg-[#7b9220] text-white"
                    onClick={handleResendOtp}
                    disabled={resendOtpLoading}
                  >
                    {resendOtpLoading ? "Resending..." : "Resend OTP"}
                  </button>
                )}
              </div>
            </div>
          </form>
        ) : steps === "profile" ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full">
              <div className="text-[#1D2E36] text-[20px] text-center mb-2">Details</div>
              <TextInput
                name="firstName"
                placeholder="Enter your first name"
                label="Enter First Name"
                register={register}
                errors={errors}
                type="text"
              />
              <TextInput
                name="lastName"
                placeholder="Enter your last name"
                label="Enter Last Name"
                register={register}
                errors={errors}
                type="text"
              />
              <TextInput
                name="phone"
                placeholder="Enter your Number"
                label="Enter Your Number"
                register={register}
                errors={errors}
                type="number"
                rules={{ pattern: "[0-9]" }}
              />
              <button className="bg-[#7b9220] text-white px-4 py-2 w-full rounded-lg mt-4" type="submit">
                Continue
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(EmailVerification)}>
            <div className="flex flex-col mt-4 w-full">
              <div className="text-[#1D2E36] text-[20px] text-center mb-2">Get Login</div>
              <TextInput
                name="email"
                placeholder="Enter Email ID"
                label="Enter Email ID"
                register={register}
                errors={errors}
                type="email"
                rules={{
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[A-Za-z]+\.(com|in|net|org|co)$/i,
                    message: "Invalid email address.",
                  },
                  validate: {
                    notInvalidDomain: (value) => {
                      const domainName = value.split("@")[1]?.split(".")[0] || "";
                      if (domainName.length <= 4) return "Email domain is not allowed.";
                      const invalidEmailPatterns = [
                        "gmai.com", "gnail.com", "yahooo.com", "yaho.com", "hotmail.com",
                        "outlook.cm", "mail.com", "aim.com", "zoho.com", "protonmail.com",
                        "temp-mail.org", "guerrillamail.com", "mailinator.com",
                        "yopmail.com", "sharklasers.com", "10minutemail.com",
                      ];
                      const domain = value.split("@")[1];
                      if (invalidEmailPatterns.includes(domain)) {
                        return "Email domain is not allowed.";
                      }
                      return true;
                    },
                  },
                }}
              />

              <p className="text-gray-400 mt-2 text-[12px] text-center">
                By continuing you agree to our <span className="text-[#7b9220]">Terms</span>, <span className="text-[#7b9220]">Refunded</span> and <span className="text-[#7b9220]">Privacy Policy</span>
              </p>

              <button className="px-4 py-2 w-full bg-[#7b9220] text-white rounded-lg mt-4" type="submit">
                {emailLoading ? "Loading..." : "Continue"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
export default Auth;
