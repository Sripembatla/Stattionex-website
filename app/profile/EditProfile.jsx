"use client";
import "./style.scss";
import { useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import TextInput from "../component/TextInput";
import { Controller, useForm } from "react-hook-form";
import Button from "../component/Button";
import { useUpdateCustomerMutation } from "../redux-tookit/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux-tookit/features/authSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import PhoneNumberInput from "../component/phonenumber";

export default function EditProfile({ data, open, setOpen, selectedFile }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm();
  const [updateCustomer, { data: updateData, isSuccess, isError, error }] =
    useUpdateCustomerMutation();

  // Handle form submission
  const onSubmit = async (value) => {
    try {
      // Prepare payload for API request
      const payload = {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        phone: value.phone,
        // profileImg: selectedFile || "", // Add profile image if exists
        username: data?.user?.username,
      };

      // Call API to update customer
      const result = await updateCustomer(payload).unwrap();

      // Log the result for debugging
      console.log("Update result:", result);

      // Check if the result has valid data before dispatching
      if (result?.user?.user) {
        dispatch(
          setCredentials({
            accessToken, // Assuming this exists
            user: {
              firstName: result?.user?.user.firstName,
              lastName: result?.user?.user.lastName,
              email: result?.user?.user.email,
              phone: result?.user?.user.phone,
              username: result?.user.username,
            }, // Assuming result contains updated user data
          })
        );
        // toast.success("Profile updated successfully"); // Success toast
        Swal.fire("Success", "Profile updated successfully", "success");
      } else {
        console.log("No valid user data returned", result); // Add logging here for debugging
        // toast.error("Failed to update profile.");
        Swal.fire("Error", "Failed to update profile.", "error");
      }
      if (result?.user) {
        localStorage.setItem("username", result?.user.username);
      }
    } catch (err) {
      console.error("Update error:", err);
      // toast.error("An error occurred while updating.");
      Swal.fire("Error", "An error occurred while updating.", "error");
    }
  };

  // Handle success and error after mutation response
  useEffect(() => {
    if (isSuccess) {
      // toast.success(updateData?.message);
      setOpen(false); // Close the modal after successful update
    } else if (isError) {
      console.log("Error Data:", error); // Log error for debugging
      // toast.error(error?.data?.message);
    }
  }, [isSuccess, updateData, isError, error, setOpen]);

  // Reset form fields with existing user data when `data` prop changes
  useEffect(() => {
    if (data) {
      reset({ ...data }); // Populate the form with initial data
    }
  }, [data, reset]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10 EditProfile"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-gray-100 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <DialogTitle
              as="h3"
              className="text-base font-semibold leading-6 text-white bg-primary p-4"
            >
              Edit Profile
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 sm:grid-cols-2 gap-x-2">
                <TextInput
                  name="firstName"
                  placeholder="Enter First Name"
                  label="First Name"
                  register={register}
                  errors={errors}
                  type="text"
                  rules={{
                    required: "This First Name is required.",
                    maxLength: {
                      value: 30,
                      message: "This First Name must not exceed 30 characters",
                    },
                  }}
                />
                <TextInput
                  name="lastName"
                  placeholder="Enter Last Name"
                  label="Last Name"
                  register={register}
                  errors={errors}
                  type="text"
                  rules={{
                    required: "This Last Name is required.",
                    maxLength: {
                      value: 30,
                      message: "This Last Name must not exceed 30 characters",
                    },
                  }}
                />
              </div>
              <TextInput
                name="username"
                placeholder="Enter Username"
                label="Username (Not Editable)"
                register={register}
                errors={errors}
                type="text"
                disabled={true} // Username is not editable
              />
              <TextInput
                name="email"
                placeholder="Enter Email"
                label="Email"
                register={register}
                errors={errors}
                type="text"
                rules={{
                  required: "This Email is required.",
                  maxLength: {
                    value: 30,
                    message: "This Email must not exceed 30 characters",
                  },
                }}
              />

              <PhoneNumberInput name="phone" label="Phone Number" control={control} errors={errors} validationRules={{ required: "Phone number is required." }} />

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  size="sm"
                  className="font-normal"
                  type="button"
                  onClick={() => setOpen(false)}
                  variant="default"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="font-normal"
                  type="submit"
                  variant="primary"
                >
                  Update
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
