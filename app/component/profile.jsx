"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profileClose } from "../redux-tookit/features/sidebarSlice";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { logoutCredentials, setCredentials } from "../redux-tookit/features/authSlice";
import { clearCart } from "../redux-tookit/cart/cartSlicer";
import Button from "./Button";
import { ICON_BASE_URL, privateSidebarMenus, publicSidebarMenu } from "../utils/constant";
import "./ProductsPage/style.scss";
import TextInput from "./TextInput";
import { useForm } from "react-hook-form";
import { useLogoutCustomerMutation, useUpdateCustomerMutation } from "../redux-tookit/services/authApi";
import 'react-phone-input-2/lib/style.css';
import Avatar from "react-avatar";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const isOpenProfile = useSelector((state) => state.sidebar.isOpenProfile);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [updateCustomer, { data: updateData, isSuccess }] = useUpdateCustomerMutation();
  

  useEffect(() => {
    setIsProfileOpen(isOpenProfile);
  }, [isOpenProfile]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (isSuccess && updateData?.user) {
      dispatch(setCredentials({ accessToken, user: updateData.user }));
      Swal.fire("Success", "Profile updated successfully", "success");
    }
  }, [isSuccess, updateData, accessToken, dispatch]);


  const onSubmit = async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
      };

      const result = await updateCustomer(payload).unwrap();

      if (result?.user) {
        dispatch(setCredentials({ accessToken, user: result.user }));
        localStorage.setItem("username", result.user.username || "");
      } else {
        Swal.fire("Error", "Failed to update profile.", "error");
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error", "An error occurred while updating.", "error");
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setLoading(true);
      setError("");

      try {
        Cookies.remove("token");
        dispatch(logoutCredentials());
        dispatch(clearCart());
        toast.success("Logout Successfully!")
      } catch (err) {
        console.error("Logout error:", err);
        setError("An error occurred while logging out.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackdropClick = () => {
    dispatch(profileClose());
  };

  return (
    <>
      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={handleBackdropClick}
          aria-label="Backdrop"
        ></div>
      )}

      <motion.div
        className="fixed top-0 right-0 h-full z-50 bg-white shadow-lg flex flex-col w-full md:w-[450px] p-6"
        initial={{ opacity: 0, x: "100%" }}
        animate={{
          opacity: isProfileOpen ? 1 : 0,
          x: isProfileOpen ? 0 : "100%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <button
          className="absolute top-4 right-4 text-black text-1xl hover:text-black font-bold"
          onClick={() => dispatch(profileClose())}
          aria-label="Close modal"
        >
          &#x2715;
        </button>

        {accessToken ? (
          <div className="overflow-y-auto no-scrollbar flex-grow">
            <h2 className="text-xl mb-3">Profile</h2>

            <div className="bg-[#f7f7f7] flex justify-between items-center mt-4 rounded-md p-2">
              <div className="flex gap-2 items-center">
                <div className="w-16 h-16 rounded-full object-cover ml-1 relative">
                  {selectedImage || user?.profileImg ? (
                    <img
                      src={selectedImage || user?.profileImg}
                      alt="profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Avatar name={user?.fullName} size="64" round={true} />
                  )}
                </div>
                <div>
                  <p>{user?.fullName}</p>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button className="p-4" onClick={() => setExpanded(!expanded)}>
                <Icon icon="iconoir:edit" width={25} height={25} />
              </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 bg-[#f7f7f7] ${expanded ? "h-fit lg:h-[400px] p-2" : "max-h-0"}`}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
                  <TextInput
                    name="firstName"
                    label="First Name"
                    placeholder="Enter First Name"
                    type="text"
                    register={register}
                    errors={errors}
                    rules={{
                      required: "First Name is required.",
                      maxLength: {
                        value: 10,
                        message: "Max 10 characters.",
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Only letters allowed.",
                      },
                    }}
                  />
                  <TextInput
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter Last Name"
                    type="text"
                    register={register}
                    errors={errors}
                    rules={{
                      required: "Last Name is required.",
                      maxLength: {
                        value: 10,
                        message: "Max 10 characters.",
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Only letters allowed.",
                      },
                    }}
                  />
                  <TextInput
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter Phone"
                    type="number"
                    register={register}
                    errors={errors}
                    rules={{
                      required: "Phone is required.",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "10-digit number required.",
                      },
                    }}
                  />
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <button type="button" className="rounded-lg bg-gray-200 px-8 py-2 w-[167.38px]" onClick={() => setExpanded(false)}>Cancel</button>
                  <button className="rounded-lg bg-[#7B9220] text-white px-8 py-2 w-[167.38px]">Save</button>
                </div>
              </form>
            </div>

            <ul>
              {privateSidebarMenus.map((item, index) => (
                <li key={index} className={`flex items-center justify-between px-4 py-3 mb-2 rounded-lg cursor-pointer ${item.path === pathname ? "bg-blue-50" : ""}`}>
                  <a href={item.path} className="flex items-center space-x-4">
                    <img src={`${ICON_BASE_URL}/profile/${item.icon}.svg`} alt={item.label} className="p-2 bg-[#f7f7f7] rounded-lg" />
                    <span>{item.label}</span>
                  </a>
                  <Icon icon="mingcute:right-line" width={20} height={20} />
                </li>
              ))}
            </ul>

            {/* <Button
              className="w-full mt-4 flex items-center gap-4"
              variant="danger"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" spin width="25" height="25" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:logout" width="25" height="25" />
                  <span>Log Out</span>
                </>
              )}
            </Button> */}
          </div>
        ) : (
          <ul className="mt-16 p-6">
            {publicSidebarMenu.map((item, index) => (
              <li key={index} className={`flex items-center justify-between px-4 py-3 mb-2 rounded-lg cursor-pointer ${item.path === pathname ? "bg-blue-50" : ""}`}>
                <a href={item.path} className="flex items-center space-x-4">
                  <img src={`${ICON_BASE_URL}/profile/${item.icon}.svg`} alt={item.label} className="p-2 bg-blue-50/50 rounded-lg" />
                  <span>{item.label}</span>
                </a>
                <Icon icon="mingcute:right-line" width={20} height={20} />
              </li>
            ))}
          </ul>
        )}
        <Button
              className="w-full mt-4 flex items-center gap-4"
              variant="danger"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" spin width="25" height="25" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:logout" width="25" height="25" />
                  <span>Log Out</span>
                </>
              )}
            </Button>
      </motion.div>
    </>
  );
};

export default Profile;
