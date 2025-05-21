"use client";

import React, { useState, useEffect } from "react";
import PriceDetails from "../component/PriceDetails";
import Private from "../layout/Private";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateAddressPrefrence, updateUserAddress } from "../redux-tookit/features/authSlice";
import { useForm } from "react-hook-form";
import { useCreateNewAddressMutation, useUpdateAddressMutation } from "../redux-tookit/services/authApi";
import AddressSidebar from "../utils/reusable/addressSidebar";
import countries from "../utils/countries";
import { addressType } from "../utils/constant";
import { toast } from "react-toastify";
import axios from "axios";

export default function DeliveryPage() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
   const userData = useSelector((state) => state.auth.user); 
   console.log("userData", userData);
   
  const cartData = useSelector((state) => state.cart);
  let cart_data = cartData?.cartItems;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleClose = () => {
    setIsSidebarOpen(false);
  }

  const handleEditClick = (address) => {
      setEditingAddress(address);
      setSidebarOpen(true);
      setValue("name", address.name);
      setValue("phone", address.phone);
      setValue("address", address.address);
      setValue("landmark", address.landmark);
      setValue("addressType", address.addressType);
      setValue("country", address.country);
      setValue("state", address.state);
      setValue("city", address.city);
      setValue("postalCode", address.postalCode);
    };
  
    const handleAddNewAddress = () => {
      setIsSidebarOpen(true);
    };

      const [postalData, setPostalData] = useState({
        city: "",
        state: "",
        country: "India", // Default to India since the API is for Indian postal codes
      });
    
      const {
        register,
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
        reset,
      } = useForm();
    
      const [createAddress, { data: createData, isSuccess, isError, error }] =
        useCreateNewAddressMutation();
      const [updateAddress] = useUpdateAddressMutation();
    
      const postalCode = watch("postalCode");
    
      const fetchPostalDetails = async (pincode) => {
        try {
          const response = await axios.get(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          const data = response.data[0];
    
    
          if (data.Status === "Success") {
            const postOffice = data.PostOffice[0];
            setPostalData({
              city: postOffice.District || "",
              state: postOffice.State || "",
              country: "India", // Default value
            });
    
            // Autofill the fields
            setValue("city", postOffice.Block || "");
            setValue("state", postOffice.State || "");
            setValue("country", "India");
            toast.success("Details Fetched")
          } else{
            // toast.error("Invalid Postal Code. Please check.");
          }
        } catch (err) {
          console.error("Error fetching postal details:", err);
          toast.error("Error fetching postal details. Try again later.");
        }
      };
    
      useEffect(() => {
        if (postalCode?.length === 6) {
          fetchPostalDetails(postalCode);
        } else {
          setPostalData({
            city: "",
            state: "",
            country: "India", // Default value
          });
    
          // Clear the fields
          setValue("city", "");
          setValue("state", "");
          setValue("country", "India");
        }
    
      }, [postalCode]);
    
      const onSubmit = async (value) => {
        try {
          const result = await createAddress(value).unwrap();
          console.log("result", result);
          
      
          const newAddress = result?.address;
      
          if (newAddress && newAddress._id) {
                  console.log("New Address to dispatch:", newAddress);
                  dispatch(updateUserAddress(newAddress)); 
                  const addressLength = Array.isArray(userData?.addresses)
                  ? userData?.addresses.length
                  : 0;
                dispatch(updateAddressPrefrence({ defaultAddress: addressLength }));
                  toast.success("Address added successfully!");
                }
      
          reset();
          setIsSidebarOpen(false);
        } catch (err) {
          console.error("Create address error:", err);
          toast.error("Failed to add address.");
        }
      };
    
      useEffect(() => {
        if (isSuccess) {
          toast.success(createData?.message);
          setIsSidebarOpen(false);
        } else if (isError) {
          toast.error(error?.data?.message);
        }
      }, [createData?.message, isSuccess, error, isError, setIsSidebarOpen]);
      const onEditSubmit = async (data) => {
        try {
          const result = await updateAddress({
            id: editingAddress._id,
            ...data,
          }).unwrap();
          console.log("edit", result);
          
      
          if (result?.address?._id) {
            dispatch(updateUserAddress(result.address)); 
            toast.success("Address updated successfully!");
          }
      
          setSidebarOpen(false);
        } catch (err) {
          console.error("Error updating address:", err);
          toast.error("Failed to update address");
        }
      };

  useEffect(() => {
    if (userData?.addresses?.length > 0) {
      // Use the default address if available; otherwise, use the first address
      const defaultAddr = userData?.defaultAddress === 0 ? userData?.addresses[0]?._id : userData?.defaultAddress || userData?.addresses[0]?._id;
      // console.log('defaultAddr', defaultAddr)
      // console.log('defaultAddrss', userData?.defaultAddress )
      // console.log('defaultAddr', userData?.addresses[0]?._id)
      setSelectedAddress(defaultAddr);
      dispatch(updateAddressPrefrence({ defaultAddress: defaultAddr }));
    } else {
      setSelectedAddress(null); // Clear selection if no addresses
    }
  }, [userData?.addresses, userData?.defaultAddress]);

  // Sorting the addresses
  const sortedAddresses = [...(userData?.addresses || [])].sort((a, b) => {
    // Move the default address to the top
    if (a._id === userData?.defaultAddress) return -1;
    if (b._id === userData?.defaultAddress) return 1;

    // Fallback to sorting by creation time (if available) or `_id`
    const createdAtA = new Date(a.createdAt || a._id);
    const createdAtB = new Date(b.createdAt || b._id);
    return createdAtA - createdAtB;
  });

  // Helper to format address
  const formatAddress = (addr) =>
    `${addr.address}, ${addr.city}, ${addr.landmark}, ${addr.state}, ${addr.postalCode}`;

  const handleBackClick = () => {
    router.push("/cart");
  };

  const handleProfileClick = () => {
    router.push("/address");
  };

  const handleDelivery = () => {
    router.push("/order-summary");
  };

  const setDeliveryPreference = (_id) => {
    console.log('id', _id)
    setSelectedAddress(_id);
    // dispatch(updateAddressPrefrence({ defaultAddress: _id })); // Ensure the correct payload is passed
  };

  return (
    <Private>
      <div className="bg-white">
        <div className="container relative">
          {/* Back Button */}
          {/* <div
            className="cursor-pointer lg:pl-20 lg:pt-5"
            onClick={() => router.back()}
          >
            <Icon icon="fe:arrow-left" width={25} height={25} />
          </div> */}
          {/* <button
            className="absolute top-10 left-2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 rounded-full pr-8 p-4 text-white group transition-all duration-300 ease-in-out"
            onClick={() => {
              router.back();
            }}
          > 
            <Icon icon="material-symbols:arrow-back" width={20} className="ml-8 text-right transform transition-transform duration-300 group-hover:-translate-x-2" />
          </button> */}
          <div className="min-h-screen p-2 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center items-start container m-auto">
            <div className="  shadow-sm p-8 rounded-lg text-black space-y-4 w-full ">
              
              {sortedAddresses.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No delivery addresses found. Please add one to continue.
                </p>
              ) : (
                sortedAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`p-4  rounded-lg  ${
                      selectedAddress === addr._id
                        ? ""
                        : "ring-2 ring-gray-300"
                    } flex items-start justify-between`}
                  >
                    <div className="flex flex-col items-start">
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr._id}
                        onChange={() => setDeliveryPreference(addr._id)}
                        className="mb-3 mt-1 w-4 h-4 cursor-pointer accent-[#1d2e36]"
                      />
                      <div>
                        <p className="font-normal text-[#1d2e36] text-[24px]">
                          {addr.name} ({addr.addressType}) {addr.phone}
                        </p>
                        <p className="text-[#616161] text-[16px]">{formatAddress(addr)}</p>
                      </div>
                    </div>
                    <button
                      className="text-[#1d2e36] font-normal text-[14px] py-2 px-4 rounded-lg"
                      onClick={() => handleEditClick(addr)}
                    >
                      Edit
                    </button>
                  </div>
                ))
              )}
              <div className="flex flex-col gap-5  w-full">
              {sortedAddresses.length > 0 && (
                  <button
                    className={`bg-[#7b9220] text-white font-normal  py-2 px-4 rounded-lg w-full  md:w-[50%]`}
                    onClick={handleDelivery}
                  >
                    Delivery Here
                  </button>
                )}
                <button
                  className="bg-[#7b9220] text-white font-normal py-2 px-4 rounded-lg w-full  md:w-[50%]"
                  onClick={handleAddNewAddress}
                >
                  Add New Address
                </button>
                
              </div>
              {sidebarOpen && (
                          <AddressSidebar
                            mode="edit"
                            title="Edit Address"
                            onClose={() => setSidebarOpen(false)}
                            onSubmit={handleSubmit(onEditSubmit)}
                            register={register}
                            errors={errors}
                            postalData={postalData}
                            fetchPostalDetails={fetchPostalDetails}
                            countries={countries}
                            addressType={addressType}
                          />
                        )}
                        {isSidebarOpen && (
                          <AddressSidebar
                            mode="add"
                            title="Add New Address"
                            onClose={handleClose}
                            onSubmit={handleSubmit(onSubmit)}
                            register={register}
                            errors={errors}
                            postalData={postalData}
                            fetchPostalDetails={fetchPostalDetails}
                            countries={countries}
                            addressType={addressType}
                          />
                        )}
              

            </div>
            <div className="flex-col w-full md:w-[50%] p-4">
              <PriceDetails />
            </div>
          </div>
        </div>
      </div>
    </Private>
  );
}
