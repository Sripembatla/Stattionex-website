"use client";
import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  ICON_BASE_URL,
  IMAGE_BASE_URL,
  menuIconsItem,
  menuItems,
  privateSidebarMenu,
  publicSidebarMenu,
  RESPONSIVE_BASE_URL,
  responsiveMenuItems,
} from "@/app/utils/constant";
import { useClickAway } from "react-use";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCompleteProfileMutation, useGetAllProductcategoryQuery, useGetPinCodeQuery, useLoginEmailMutation, useOtpVerificationMutation } from "@/app/redux-tookit/services/authApi";
import { setCredentials, setLocation } from "@/app/redux-tookit/features/authSlice";
import Select from "react-select";
import { openSidebar, profileSidebar } from "@/app/redux-tookit/features/sidebarSlice";
import { useForm } from "react-hook-form";
import TextInput from "../TextInput";
import Avatar from "react-avatar";
import PinCode from "../PinCode";

const SearchInput = dynamic(() => import("../SearchInput"));
const Icon = dynamic(() => import("@iconify/react").then((mod) => mod.Icon), {
  ssr: false,
});


export default function Navbar() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const accessToken = useSelector((state) => state?.auth?.accessToken);

  const cartData = useSelector((state) => state.cart);

  const filteredCartItems =
  cartData.cartItems.filter((item) => !item.hasOwnProperty("isBuyNow")) || [];
  const [activeItem, setActiveItem] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const [steps, setSteps] = useState(null);
  const [timer, setTimer] = useState(120);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const user = useSelector((state) => state?.auth?.user);

  
  // console.log("category", data);
  const searchRef = useRef(null);
  const megaMenuRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const loginParam = searchParams.get("login");
    if (loginParam === "true") {
      setIsLogin(true);
      router.replace("/", { scroll: false });
    } 
  }, [searchParams, router]);

  const menuItems = [
    { href: '/', label: 'Home', icon: 'proicons:home' },
    { href: '/products', label: 'Products', icon: 'solar:fire-linear' },
    { href: '/promotions', label: 'Promotions', icon: 'iconoir:percentage' },
    { href: '/aboutus', label: 'About Us', icon: 'material-symbols:info-outline-rounded' },
  ];



  const handleLocationChange = (location) => {
    // console.log(`Selected Location: ${location}`);
    dispatch(setLocation(location));
    // Add logic to update the location in state or API call
  };

  const [checkEmail, { isLoading: emailLoading }] = useLoginEmailMutation();
  const [checkOTP, { isLoading: otpLoading }] = useOtpVerificationMutation();
  const [completeProfile, { isLoading: profileLoading }] = useCompleteProfileMutation();
  const [showPinCode, setShowPinCode] = useState(false);
  const storedPinCode = localStorage.getItem("userPincode")

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

const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // const query = router;
  // useEffect(() => {
  //   if (query.search) {
  //     setSearchValue(query.search);
  //     setDebouncedSearch(query.search);
  //   }
  // }, [query.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(handler); // Cleanup timeout
  }, [searchValue]);

  const inputRef = useRef();

  useEffect(() => {
    if (debouncedSearch.trim()) {
      router.push(`/products?search=${debouncedSearch.trim()}`);
     } 
  }, [debouncedSearch, searchValue, pathName]);

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

        setIsLogin(false);
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
            reset();
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

        setIsLogin(false);
      }
    } catch (error) {
    }
  };

  const onSubmitOTP = (data) => {
    console.log("OTP form submitted data:", data); // This should show on submit
    const finalData = {
      ...data,
      otp: data.otp.join(""),
    };
    OTPVerification(finalData);
  };

  const handleClick = () => {
    router.push("/browseCategory")
  }
  return (
    <>
      <div className="Navbar">
        <div className="container flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 p-2">
              <Link href="/">
                <img
                  src="/assets/images/logo.png"
                  alt="Logo"
                  className="w-16 h-16"
                />
              </Link>
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-[#7B9220] uppercase">Vriddhee</h2>
                <p className="text-sm font-medium text-gray-400 uppercase">SuperStore</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative w-[550px]" onClick={() => router.push("/products")}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for items.."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full px-4 py-2 text-[#1D2E36] text-[14px] border border-gray-300 rounded-lg bg-[#F3F3F3] focus:border-gray-400 focus:outline-none"
              />
              <button className="px-4 py-2 bg-[#7B9220] text-white rounded-r-lg  absolute right-0 ">
                <Icon icon="line-md:search" width="20" height="20" />
              </button>
            </div>
            <div className="flex items-center justify-start">
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2" onClick={() => setShowPinCode(true)}>
                    <Icon icon="weui:location-outlined" width="25" height="25" />
                    <p className="text-sm  text-[#1D2E36]">{storedPinCode}</p>
                  </div>
                  {showPinCode && (
                    <PinCode show={true}/>
                  )}
                  <div className="flex items-center gap-2 cursor-pointer relative" onClick={() => dispatch(openSidebar())}>
                    <Icon icon="bitcoin-icons:cart-outline" width="25" height="25" />
                    <p className="text-sm  text-[#1D2E36]">My Cart</p>
                    {cartData.cartItems.length > 0 && (
              <span className="absolute -top-2 left-0 w-2 h-2 p-2 bg-[#7b9220] text-white rounded-full text-[10px] flex items-center justify-center">
                {cartData.cartItems.length}
              </span>
              )}
                  </div>
                </div>

                {accessToken ? (
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => dispatch(profileSidebar())}>
                    <div className="w-10 h-10 rounded-full items-center flex justify-center">
                    <Avatar name={user?.fullName} size="40" round={true} />
                    </div>
                    <p className="text-sm font-medium text-[#1D2E36]">{user?.fullName}</p>
                  </div>
                ) : (
                  <div>
                    <button className="px-4 py-3 bg-[#7B9220] text-white rounded-lg flex gap-2" onClick={() => {
                      setIsLogin(true)
                    }}>
                      <Icon icon="line-md:login" width="20" height="20" />
                      <span className="text-sm uppercase">Login</span>
                    </button>
                  </div>
                )
                }
              </div>
              {isLogin && (
                <div
                  className="fixed inset-0 z-50 w-auto bg-black bg-opacity-50 flex justify-center items-center"
                  onClick={() => setIsLogin(false)}
                >
                  <div
                    className="bg-white  rounded-lg w-full md:w-[650px] md:h-[650px] lg:w-[650px] lg:h-[650px] m-4 relative flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src="/assets/images/login.png" alt="login" className="w-1/2" />
                    {steps === "otp" ? (
                      <form onSubmit={handleSubmit(onSubmitOTP)} className="p-2">
                      <div className="flex flex-col mt-12 w-full p-2">
                        <div className="text-[#1D2E36] text-[20px] flex items-center justify-center mb-2">OTP</div>
                        <label className="text-[#1D2E36] text-[12px] ">Verify Email OTP</label>
                        <div className="flex  gap-2 my-4">
                          {[0, 1, 2, 3].map((i, index) => (
                            <input
                            key={index}
                            type="text"
                            maxLength="1"
                            {...register(`otp[${i}]`, {
                              required: true,
                              pattern: {
                                value: /^[0-9]$/,
                                message: "Only numbers allowed",
                              },
                            })}
                            className="w-8 h-8 text-center text-[12px] bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#7b9220]"
                            onChange={(e) => handleInputChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            ref={(el) => {
                              register(`otp[${i}]`).ref(el);
                             (inputRefs.current[i] = el);
                            }}
                          />
                          ))}
                        </div>
                    
                        <div className="mt-2 text-center">
                          <p className="text-gray-400 text-[12px]">
                            Enter <span className="text-[#7b9220]">OTP</span> sent to your email. Valid for <span className="text-[#7b9220]">2min</span>
                          </p>
                        </div>
                    
                        <button
                          type="submit"
                          className="w-full mt-6 py-2 px-4 rounded-lg bg-[#7b9220] text-white"
                          disabled={otpLoading}
                        >
                          {otpLoading ? "Verifying..." : "Continue"}
                        </button>
                      </div>
                    
                      <div className="mt-4 text-center p-2">
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
                    </form>
                    
                    ) : steps === "profile" ? (
                      <form className="p-2" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col mt-12 w-full p-2">
                          <div className="text-[#1D2E36] text-[20px] flex items-center justify-center mb-2">Details</div>
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
                            rules={{
                              pattern: "[0-9]"
                            }}
                          />
                          <button className="bg-[#7b9220] text-white px-4 py-2 w-full rounded-lg" type="submit">{profileLoading ? "Loading..." : "Continue"}</button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleSubmit(EmailVerification)} className="p-2">
                        <div className="flex flex-col mt-12 w-full p-2">
                          <div className="text-[#1D2E36] text-[20px] flex items-center justify-center mb-2">Get Login</div>
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

                          <p className="text-gray-400 mt-2 text-[12px]">By continuing you agree to our <span className="text-[#7b9220]">Terms</span> , <span className="text-[#7b9220]">Refunded</span> and <span className="text-[#7b9220]">Privacy Policy</span></p>

                          <button className="px-4 py-2 w-full bg-[#7b9220] text-white rounded-lg mt-4" type="submit">{emailLoading ? "Loading..." : "Continue"}</button>
                        </div>
                      </form>
                    )
                    }
                  </div>

                </div>
              )}

            </div>
          </div>
          <nav className="nav">
            <div className="p-2">
              <button className="px-4 py-4 bg-[#7B9220] text-white flex gap-2 items-center rounded-lg " onClick={handleClick}>
                <Icon icon="hugeicons:menu-square" width="20" height="20" />
                <span>Browse All Category</span>
              </button>
            </div>
            <ul className="text-menus w-[50%] flex space-x-4">
              {menuItems.map(({ href, label, icon }) => {
                const isActive = pathName === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 ${isActive ? 'text-[#7b9220]' : ''}`}
                  >
                    <Icon icon={icon} width="20" height="20" />
                    <li className={` ${isActive ? 'text-[#7b9220]' : 'text-[#1D2E36]'}`} >{label}</li>
                  </Link>
                );
              })}
            </ul>

            <div className="flex items-center justify-start w-[20%]">
              <Icon icon="solar:phone-linear" width="20" height="20" className="text-[#7B9220]" />
              <span className="ml-2 text-[#7B9220]">+91 1234567890</span>
              <span className="ml-2 text-[#1D2E36]">24/7 Support</span>
            </div>



          </nav>

        </div>
      </div>


      {/* Mobile and Sidebar Components */}
      <div className="MobileNavbar">
        <div className="header_menu">
          <div className="menu_details">
          <div className="flex items-center gap-2">
              <Link href="/">
                <img
                  src="/assets/images/logo.png"
                  alt="Logo"
                  className="w-12 h-12"
                />
              </Link>
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-[#7B9220]">Vriddhee</h2>
                <p className="text-sm font-medium text-gray-400">SuperStore</p>
              </div>
            </div>
            <div className="flex items-center gap-2" onClick={() => setShowPinCode(true)}>
            <p className="text-sm  text-[#1D2E36]">{storedPinCode}</p>

                    <Icon icon="weui:location-outlined" width="20" height="20" className="text-[#7b9220]" />
                    
                  </div>
                  {showPinCode && (
                    <PinCode show={true}/>
                  )}
          </div>
        </div>

        <div className="footer_menu">
          <div className="menu_details">
            <ul>
              {responsiveMenuItems.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  onClick={() => setActiveItem(index)}
                >
                  <li
                    className={`menu-item ${activeItem === index ? "active" : ""
                      }`}

                  >
                    <Icon icon={item.icon} width="20" height="20" />
                    {activeItem === index && (
                      <span className="dot-indicator">...</span>
                    )}
                  </li>
                </Link>
              ))}

              <li className="menu-item" onClick={() => dispatch(openSidebar())}>
                <Icon icon="bi:cart-plus" width="20" height="20" />
              </li>
              <li className="menu-item" onClick={() => dispatch(profileSidebar())}>
                <Icon icon="mdi:menu" width="20" height="20" />
              </li>
            </ul>
          </div>
        </div>
      </div>

    </>
  );
}
