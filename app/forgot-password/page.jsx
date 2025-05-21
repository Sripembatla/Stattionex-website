"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import TextInput from "../component/TextInput";
import Button from "../component/Button";
import { IMAGE_BASE_URL } from "../utils/constant";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  useForgotPasswordChangeMutation,
  useForgotPasswordOTPMutation,
  useForgotPasswordEmailMutation,
} from "../redux-tookit/services/authApi";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const Forgot = () => {
  const router = useRouter();

  const [steps, setSteps] = useState(null);
  const [user, setUser] = useState("");
  const [msg, setMsg] = useState("");
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [storedEmail, setStoredEmail] = useState("");
  const [timer, setTimer] = useState(150); // Timer in seconds (2:30 = 150 seconds)

  const [checkEMail, { isLoading: emailLoading }] =
    useForgotPasswordEmailMutation();
  const [checkOTP, { isLoading: otpLoading }] = useForgotPasswordOTPMutation();
  const [resendOTP, { isLoading: resendLoading }] =
    useForgotPasswordOTPMutation(); // Assuming same API
  const [changePassword, { isLoading: changePasswordLoading }] =
    useForgotPasswordChangeMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm();

  const EmailVerification = async (value) => {
    try {
      const result = await checkEMail(value).unwrap();
      if (result?.success) {
        setStoredEmail(value.email); // Store the email for later use
        toast.success(result?.message);
        setSteps("otp");
        reset(); // Clear the form fields
      }
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  const OTPVerification = async (value) => {
    try {
      const result = await checkOTP(value).unwrap();
      if (result?.success) {
        console.log("result", result);
        toast.success(result?.message);
        setUser(result?.userid);
        setSteps("password");
        reset();
      }
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred");
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
      const result = await checkEMail({ email: storedEmail }).unwrap();
      if (result?.success) {
        toast.success(result?.message || "OTP resent successfully.");
        setTimer(150); // Reset timer
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendOtpLoading(false);
    }
  };

  const onSubmit = async (value) => {
    try {
      let newValues = { userId: user, ...value };
      console.log("newValues", newValues);
      const result = await changePassword(newValues).unwrap();
      if (result?.success) {
        setMsg(result?.message);
        toast.success(result?.message);
        setSteps("success");
        reset();
      }
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="Forgot">
      <div className="container">
        <div className="user signinBx">
          <div className="imgBx">
            <Image
              src={`${IMAGE_BASE_URL}login.png`}
              width={400}
              height={400}
              alt="Login Banner"
              className="login_banner"
            />
          </div>

          <div className="formBx">
            {steps === "otp" ? (
              <form onSubmit={handleSubmit(OTPVerification)}>
                <TextInput
                  name="otp"
                  placeholder="Enter OTP"
                  label="OTP"
                  register={register}
                  errors={errors}
                  type="text"
                  rules={{
                    required: "OTP is required.",
                    maxLength: {
                      value: 30,
                      message: "OTP must not exceed 30 characters.",
                    },
                  }}
                />
                <div className="m-8 text-center">
                  <p>We&apos;ve sent a OTP to your email. Please check your inbox and enter the OTP to reset your password.</p>
                </div>
                 <Button
      type="submit"
      className="w-full mt-6 py-2"
      variant="primary"
      disabled={otpLoading}
    >
      {otpLoading ? "Verifying..." : "Verify OTP"}
    </Button>

    <div className="mt-4 text-center">
      <p className="text-sm">Did not receive the OTP?</p>
                  {timer > 0 ? (
                    <p>Resend OTP in {formatTime(timer)}</p>
                  ) : (
                    <Button
                      type="button"
                      className="mt-2 py-2"
                      variant="secondary"
                      onClick={handleResendOtp}
                      disabled={resendOtpLoading}
                    >
                      {resendOtpLoading ? "Resending..." : "Resend OTP"}
                    </Button>
                  )}
                </div>
              </form>
            ) : steps === "password" ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                  name="newPassword"
                  placeholder="Enter New Password"
                  label="New Password"
                  register={register}
                  errors={errors}
                  type="password"
                  rules={{
                    required: "Password is required.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long.",
                    },
                    maxLength: {
                      value: 30,
                      message: "Password must not exceed 30 characters.",
                    },
                    pattern: {
                      value: /^(?!.*\s)(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/,
                      message: "Password must include at least one letter, one number, one special character, and no spaces.",
                    },
                  }}
                />

                <TextInput
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  label="Confirm Password"
                  register={register}
                  errors={errors}
                  type="password"
                  rules={{
                    required: "Please confirm your password.",
                    validate: (value) =>
                      value === getValues("newPassword") ||
                      "Passwords do not match.",
                  }}
                />

                <Button
                  type="submit"
                  className="w-full mt-6 py-2"
                  variant="primary"
                  disabled={changePasswordLoading}
                >
                  {changePasswordLoading ? "Changing..." : "Save"}
                </Button>
              </form>
            ) : steps === "success" ? (
              <div className="flex items-center flex-col">
                <Image
                  src={`${IMAGE_BASE_URL}forgot_password.gif`}
                  width={250}
                  height={250}
                  alt="Forgot Password"
                  className="login_banner"
                />
                <p className="font-bold text-xl">{msg}</p>
                <Button
                  type="button"
                  className="w-full mt-6 py-2"
                  variant="primary"
                  onClick={() => router.push('./auth')}
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(EmailVerification)}>
                <div className="form-header flex items-center gap-4">
                  <div
                    className="back cursor-pointer"
                    onClick={() => router.back()}
                  >
                    <Icon icon="weui:back-outlined" width="10" height="20" />
                  </div>
                  <p className="text-[24px] font-bold">Back</p>
                </div>

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
                        const domainName = value.split("@")[1].split(".")[0];  
                        console.log('value', domainName)
  
                        if (domainName.length <= 4) {
                          return "Email domain is not allowed.";
                        }
                        const invalidEmailPatterns = [
                          "gmai.com",
                          "gnail.com",
                          "yahooo.com",
                          "yaho.com",
                          "hotmail.com",
                          "outlook.cm",
                          "mail.com",
                          "aim.com",
                          "zoho.com",
                          "protonmail.com",
                          "temp-mail.org",
                          "guerrillamail.com",
                          "mailinator.com",
                          "yopmail.com",
                          "sharklasers.com",
                          "10minutemail.com",
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

                

                <Button
                  type="submit"
                  className="w-full mt-6 py-2"
                  variant="secondary"
                  disabled={emailLoading}
                >
                  {emailLoading ? "Verifying..." : "Verify Email"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
