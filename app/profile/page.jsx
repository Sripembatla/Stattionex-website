"use client";
import { useState, useEffect, useRef } from "react";
import "./style.scss";
import Button from "../component/Button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logoutCredentials } from "../redux-tookit/features/authSlice";
import {
  useGetProfileQuery,
  useLogoutCustomerMutation,
  useUpdateCustomerMutation,
} from "../redux-tookit/services/authApi";
import { clearCart } from "../redux-tookit/cart/cartSlicer";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import EditProfile from "./EditProfile";
import Cookies from "js-cookie";
import UploadImage from "../utils/reusable/uploadImage";
import { setCredentials } from "../redux-tookit/features/authSlice";
import Avatar from "react-avatar";

export default function Profile() {
  const user = useSelector((state) => state?.auth?.user);
  console.log("user", user);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [
    logoutCustomer,
    { isError: isErrorLogin, isSuccess: isSuccessLogin, error: errorLogin },
  ] = useLogoutCustomerMutation();

  const [updateCustomer, { data: updateData, isSuccess, isError }] =
    useUpdateCustomerMutation();

  const { data } = useGetProfileQuery();
  console.log("data", data);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState({});

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
  
    console.log('phonephone0', phone);
    
    // Remove any non-numeric characters
    const cleaned = ('' + phone).replace(/\D/g, '');
  
    // Format Indian numbers (assuming 10 digits)
    if (cleaned.length === 12) {
      // Format Indian phone numbers: +91 (987) 654-3210
      const phoneWithoutCountryCode = cleaned.substring(2);  // Remove the first two digits (91)
    
      // Format the Indian phone number: +91 (987) 654-3210
      return `+91 (${phoneWithoutCountryCode.substring(0, 3)}) ${phoneWithoutCountryCode.substring(3, 6)}-${phoneWithoutCountryCode.substring(6)}`;    } 
    // If it's an international number (11 digits), format as +{country code}
    else if (cleaned.length === 11 && cleaned[0] === '1') {
      // Format for US (e.g., +1 (555) 123-4567)
      return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
    } 
    else {
      // If the phone number is not in a recognizable format, return it raw
      return `+${cleaned}`;
    }
  };
  

  useEffect(() => {
    if (isSuccessLogin) {
      Swal.fire(
        "Logged out!",
        "You have been logged out successfully.",
        "success"
      );
      router.push("./");
    }

    if (isErrorLogin) {
      console.error("Logout error:", errorLogin);
      setError("An error occurred while logging out. Redirecting to home.");
      setTimeout(() => {
        router.push("./");
      }, 2000);
    }
  }, [isSuccessLogin, isErrorLogin, router, errorLogin]);

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
        Cookies.remove("fmauser");
        dispatch(logoutCredentials());
        dispatch(clearCart());
        // await logoutCustomer();
        router.push("./");
      } catch (err) {
        console.error("Logout error:", err);
        setError("An error occurred while logging out.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageChange = async (e) => {
    try {
      // Assuming that the image is an object containing the image file, or just a URL
      const payload = {
        profileImg: e[0], // Image file or URL
      };

      // Make the API call to update the profile image
      const result = await updateCustomer(payload).unwrap();

      // console.log("update result", result);

      // Assuming result contains the updated user object with profileImg
      const updatedProfileImg = result?.user?.user?.profileImg;

      // console.log("image", updatedProfileImg);

      // Dispatch the updated profile image to Redux
      dispatch(
        setCredentials({
          profileImg: updatedProfileImg,
        })
      );

      // Update the local state to ensure immediate UI update
      setSelectedImage(updatedProfileImg);
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred while updating the image.");
    }
  };

  console.log("profile image", selectedImage);

  const handleImageUpload = (image, name) => {
    setUploadedImages((prevState) => ({
      ...prevState,
      [name]: image,
    }));
  };

  const handleIconClick = () => {
    document.getElementById("file-input").click();
  };

  useEffect(() => {
    if (data) {
      console.log("Fetched profile data:", data);
      dispatch(setCredentials({ user: data?.data?.user }));
    }

    if (error) {
      console.error("Error fetching profile:", error);
    }
  }, [data, error, dispatch]);

  return (
    <>
      <div className="Profile">
        <div className="EditForm">
          <div className="form-header">
            <div className="profile-img">
              <div className="sm:block relative mb-4 sm:mb-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover">
                  {selectedImage || user?.profileImg ? (
                    <img
                      src={selectedImage || user?.profileImg}
                      alt="profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Avatar name={`${user?.username}`} size="96" round={true} />
                  )}
                </div>
                {/* <div
                  className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer"
                  // onClick={handleIconClick}
                >
                  <Icon
                    icon="carbon:camera"
                    color="white"
                    width={20}
                    height={20}
                    onClick={handleProfile}
                  />
                </div> */}
                <div className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer">
                  <UploadImage
                    name="profile"
                    onImageUpload={handleImageChange}
                    icon={true}
                    color="white"
                  />
                </div>
              </div>
            </div>
            <Link
              href={"#"}
              className="text-primary font-bold"
              onClick={() => setOpen(true)}
            >
              Edit
            </Link>
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-control"
                readOnly
                value={user?.firstName}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control"
                readOnly
                value={user?.lastName}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              readOnly
              value={user?.username}
            />
          </div>
          <div className="form-group">
            <label>Email Id</label>
            <input
              type="text"
              className="form-control"
              readOnly
              value={user?.email}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              className="form-control"
              readOnly
              value={formatPhoneNumber(user?.phone)}
            />
          </div>
          {error && <div className="error-message text-red-500">{error}</div>}
          <Button
            type="submit"
            className="w-full mt-4 font-normal flex items-center gap-4"
            variant="primary"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <>
                <span>Logging out...</span>
                <Icon icon="mdi:loading" spin width="25" height="25" />
              </>
            ) : (
              <>
                <span>Logout</span>
                <Icon icon="mdi:logout" width="25" height="25" />
              </>
            )}
          </Button>
        </div>
      </div>

      <EditProfile
        data={user}
        open={open}
        setOpen={setOpen}
        selectedFile={selectedFile}
      />
    </>
  );
}
