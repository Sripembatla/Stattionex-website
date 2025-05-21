"use client";
import "./style.scss";
import { useState, useEffect } from "react";
import {
  useCreateNewAddressMutation,
  useDeleteAddressMutation,
  useGetAddressQuery,
  useUpdateAddressMutation, // Keep this if you need to fetch addresses initially
} from "../redux-tookit/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import SkeletonLoader from "../component/Skeleton";
import { removeUserAddress, updateAddressPrefrence, updateUserAddress } from "../redux-tookit/features/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import Private from "../layout/Private";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import TextInput from "../component/TextInput";
import SelectInput from "../component/SelectInput";
import { addressType } from "../utils/constant";
import countries from "../utils/countries";
import { max } from "date-fns";
import axios from "axios";
import AddressSidebar from "../utils/reusable/addressSidebar";

export default function Address() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // console.log("routserrouterrouter", id);
  const addresses = useSelector((state) => state.auth.user);
  console.log("adresses", addresses);
  
  const [deleteAddress] = useDeleteAddressMutation();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  // console.log(addresses, "address");

  // Optional: Fetch addresses initially from API and set in Redux
  // useEffect(() => {
  //   const fetchAddresses = async () => {
  //     const result = await useGetAddressQuery();
  //     if (result.data) {
  //       dispatch(setUserAddresses(result.data.addresses));
  //     }
  //   };

  //   fetchAddresses();
  // }, [dispatch]);

 
  // const prevPath = localStorage.getItem("prevPath");
  // useEffect(() => {
  //   console.log('prevPathprevPathprevPath', prevPath)
  //   if (prevPath == "/deliverypage") {
  //     setAddOpen(true);
  //   }
  // }, []);

  useEffect(() => {
    if (id) {
      const foundObject = addresses.find((item) => item._id === id);
      handleModal(foundObject);
    }
  }, [id]);

  const handleModal = (data) => {
    setSelectedData(data);
    setEditOpen(true);
  };

  const handleDelete = async (addressId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteAddress({ id: addressId }).unwrap();
      dispatch(removeUserAddress({ _id: addressId }));
      // console.log(addresses);
      Swal.fire("Deleted!", "Your address has been deleted.", "success");
    }
  };


  const router = useRouter();


  const [selectedAddress, setSelectedAddress] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: addressData } = useGetAddressQuery();

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

  const handleClose = () => {
    setIsSidebarOpen(false);
  }

  const handleBackdropClick = () => {
    setSidebarOpen(false);
  };

  const { user } = useSelector((state) => state.auth);
  console.log("user", user);
  

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
        toast.success("Details Fetched ")
      } else {
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
        const addressLength = Array.isArray(user?.addresses)
        ? user?.addresses.length
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
    if (addressData?.addresses?.length === 0) {
      setIsSidebarOpen(true);
    }
  }, [addressData]);

  useEffect(() => {
    if(addressData?.addresses?.length > 0){
      setSelectedAddress(addressData?.addresses[0]._id)
    }
  }, [addressData]);

  return (
    <Private>
      <div className='relative flex gap-4'>
        {/* <button
                              className="absolute top-8 -left-0 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 rounded-full pr-6 p-4  text-white flex group transition-all duration-300 ease-in-out"
                              onClick={() => {
                                  const prevPath = localStorage.getItem("prevPath");
                                  if (prevPath === "/auth") {
                                      router.push("/");
                                  } else {
                                      router.back();
                                  }
                              }}
                          >
                              <Icon
                                  icon="material-symbols:arrow-back"
                                  width={20}
                                  className="ml-8 transform transition-transform duration-300 group-hover:-translate-x-2"
                              />
                          </button> */}

        <h1 className='text-2xl font-medium ml-20 mt-4 text-[#1d2e36]'>My Address</h1>


      </div>
      {isSidebarOpen && addressData?.addresses?.length === 0 && (
        <AddressSidebar mode="add" title="Add New Address" onClose={handleClose} onSubmit={handleSubmit(onSubmit)} register={register}
          errors={errors}
          postalData={postalData}
          fetchPostalDetails={fetchPostalDetails}
          countries={countries}
          addressType={addressType}
        />
      )}

      {addressData?.addresses?.length > 0 ? (
        <div className="p-4 max-w-7xl mx-auto h-screen ">
          {addressData?.addresses?.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 border-b py-4"
            >
              <input
                type="radio"
                checked={selectedAddress === item._id}
                onChange={() => setSelectedAddress(item._id)}
                className="mt-1 accent-[#1d2e36]"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-600">
                  {item.addressType}
                </div>
                <div className="text-gray-500 text-base mt-1">
                  {item.name},{item.phone}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {item.address},{item.landmark},{item.city},{item.state},-{item.postalCode}
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <button className="text-[#7b9220]" onClick={() => handleEditClick(item)}>
                  <Icon icon="la:edit" width={20} />
                </button>
                <button className="text-[#7b9220]" onClick={() => handleDelete(item._id)}>
                  <Icon icon="mingcute:delete-2-line" width={20} />
                </button>
              </div>
            </div>
          ))}
          <button className="mt-4 w-full md:w-[410px] bg-[#7b9220] text-white py-2 rounded flex items-center justify-center gap-2" onClick={handleAddNewAddress}>
            <span className="text-lg">+</span>
            ADD NEW ADDRESS
          </button>
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
      ) : (
        <div className="p-4 max-w-7xl mx-auto h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-medium text-[#1d2e36]">No Address Found , Please Add New Address</h1>
          <button className="mt-4 w-full md:w-[410px] bg-[#7b9220] text-white py-2 rounded flex items-center justify-center gap-2" onClick={handleAddNewAddress}>
            <span className="text-lg">+</span>
            ADD NEW ADDRESS
          </button>
        </div>
      )}
    </Private>
  );
}
