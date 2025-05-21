"use client";
import { Icon } from "@iconify/react";
import "./style.scss";
import { ICON_BASE_URL, IMAGE_BASE_URL } from "../utils/constant";
import Image from "next/image";
import Button from "../component/Button";
import {
  useGetMyOrdersQuery,
  useProductReviewMutation,
  useCancelOrderMutation,
  useTrackOrderQuery,
} from "../redux-tookit/services/authApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UploadImage from "../utils/reusable/uploadImage";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import Loader from "../component/Loader";
import Private from "../layout/Private";


const Invoice = dynamic(() => import("../component/Invoice"), { ssr: false });

export default function MyOrders() {
  const router = useRouter();
  const { data, isLoading } = useGetMyOrdersQuery();
  console.log("data", data);


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      selectedReason: "",
      customReason: "",
    },
  });
  const [submitReview] = useProductReviewMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setReturnModalOpen] = useState(false);
  const [isTrackModalOpen, setTrackModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [currentProductId, setCurrentProductId] = useState(null);
  const [reviewImg, setReviewImg] = useState([]);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    const calculatedHeight = `calc(100% / 4 - 15px)`; // Adjust height calculation
    setHeight(calculatedHeight);
  }, []);

  // console.log('height', height)
  const { data: trackdata } = useTrackOrderQuery({ id: currentOrderId });
  console.log('trackdata', trackdata);


  const isCancelled = trackdata?.currentStatus === "Cancelled";
  let trackingSteps = trackdata?.steps || [];

  if (isCancelled) {
    const cancelIndex = trackingSteps.findIndex(step => step.step === "Cancelled");
    if (cancelIndex !== -1) {
      trackingSteps = trackingSteps.slice(0, cancelIndex + 1);
    }
  }



  const selectedReason = watch("selectedReason");

  const onSubmit = (data) => {
    if (data.selectedReason === "Other" && !data.customReason) {
      return;
    }
    handleCancelOrder(data.selectedReason, data.customReason);
  };

  const handleCancelOrder = async (selectedReason, customReason) => {
    try {
      const payload = {
        reason:
          selectedReason == "Other"
            ? customReason
            : selectedReason || customReason,
      };
      const orderId = currentOrderId;
      await cancelOrder({ orderId, ...payload }).unwrap();
      toast.success("Order Cancelled Successfully!");
      setCancelModalOpen(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order.");
      setCancelModalOpen(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!currentProductId) return;

    const reviewData = {
      rating,
      comment: reviewText,
      productId: currentProductId,
      images: reviewImg || [],
    };
    try {
      await submitReview(reviewData).unwrap();
      toast.success("Review Submitted Successfully!");
      setReviewModalOpen(false);
      setRating(0);
      setReviewText("");
      setReviewImg([]);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  const handleImageChange = (newImages) => {
    if (reviewImg.length + newImages.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    setReviewImg([...reviewImg, ...newImages]);
  };
  useEffect(() => {
    if (
      isReviewModalOpen ||
      isCancelModalOpen ||
      isReturnModalOpen ||
      isTrackModalOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup to ensure the style is reset
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    isReviewModalOpen,
    isCancelModalOpen,
    isReturnModalOpen,
    isTrackModalOpen,
  ]);


  return (
    <Private>
      <div className='relative flex gap-4 container'>
        {/* <button
          className="absolute top-8 -left-0 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 rounded-full pr-6 p-4  text-white flex group transition-all duration-300 ease-in-out"
          onClick={() => {
            const prevPath = localStorage.getItem("prevPath");
            if (prevPath === "/auth" || prevPath === "/paymentsuccess") {
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

        <h1 className='text-[24px] text-[#1d2e36] font-medium  mt-4'>My Orders</h1>


      </div>
      <div className="MyOrder">
        {isLoading ? (
          <Loader />
        ) : data?.orders == undefined || data?.orders.length === 0 ? (
          <div className="notice-board">
            <div className="content">
              {/* <div className="header-content">
                <Image
                  src={`${ICON_BASE_URL}/profile/order.svg`}
                  alt="Order Icon"
                  width={50}
                  height={50}
                />
                <span>My Orders</span>
              </div> */}

              <div className="body-content">
                <span>No Orders Placed Yet</span>
                <p className="text-lg mt-2">
                  Don&apos;t Wait, Make Your First Purchase
                </p>
              </div>

              <div className="footer-content">
                <Image
                  src={`${IMAGE_BASE_URL}no-order-new.png`}
                  alt="Order Icon"
                  width={300}
                  height={300}
                />
              </div>
              <button
                className="flex gap-x-2 items-center justify-center bg-[#7b9220] text-white  p-4 rounded-md"
                onClick={() => router.push("/")}
              >
                <Icon icon="mingcute:shopping-cart-1-line" width={24} />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        ) : (
          data?.orders?.map((item, index) => (
            <div className="container" key={index}>
              <div className="bg-[#f7f7f7] p-4 rounded-lg border">
                <div className="flex flex-col-reverse lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                  <div className="flex flex-col sm:flex-row justify-between w-full lg:w-[50%] gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <span className="text-[16px] text-[#616161] mr-2">OrderId:</span>
                        <span className="text-[16px] font-normal">{item.orderId}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[16px] text-[#616161] mr-2">Total:</span>
                        <span className="text-[16px] font-normal">{item.totalItems}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button className="bg-[#8CC63F]/30 text-[#7b9220] py-2 px-4 rounded-full flex items-center gap-1">
                        <Icon icon="icon-park-outline:dot" width={20} />
                        {item.orderStatus}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full lg:w-[50%]">
                    <div className="hidden lg:block border-l border-[#616161] h-[50px] mr-2"></div>
                    <span className="text-[16px] text-[#616161]">Delivery Date:</span>
                    <span className="text-[16px] font-normal text-[#7b9220]">
                      {new Date(item.placedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
                  {item.items?.map((item, i) => (
                    <div key={i} className="flex  items-start sm:items-center gap-4">
                      <div className="w-[116px] h-[108px] shrink-0">
                        <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-[20px] sm:text-[24px] text-[#1d2e36]">{item.productName}</p>
                        <p className="text-[14px] sm:text-[16px] text-[#616161]">
                          Variant: <span className="text-[#1d2e36]">{item.variantQuantity}{item.variantUnit}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-10">
                    <p className="text-[18px] sm:text-[20px] text-[#1d2e36]">₹{item.totalAmount}</p>
                    <p className="text-[14px] sm:text-[16px] text-[#1d2e36]">Saving ₹{item.totalSaving}</p>

                  </div>
                  <div className="text-[#1d2e36] text-[16px] sm:text-[20px] flex sm:justify-center sm:items-center">{item.totalItems} items</div>
                </div>
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mt-8">
                  <div className="flex flex-col space-y-6 w-full lg:w-auto">
                    <div className="flex items-start gap-16">
                      <p className="text-[16px] text-[#616161]">Order Date:</p>
                      <p className="text-[16px] text-[#1d2e36]">{new Date(item.placedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <p className="text-[16px] text-[#616161]">Payment Method:</p>
                      <p className="text-[16px] text-[#1d2e36]">{item.paymentMethod}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <p className="text-[16px] text-[#616161]">Shipping Address:</p>
                      <p className="text-[16px] text-[#1d2e36] max-w-[350px]">{item.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-full lg:w-[306px] p-6 border rounded-3xl">
                    <p className="text-[20px] text-[#1d2e36] mb-4">Price Summary</p>
                    <div className="flex justify-between text-[12px] text-[#616161] mb-2">
                      <p>Subtotal:</p>
                      <p className="text-[#1d2e36]">₹{item.totalAmount}</p>
                    </div>
                    <div className="flex justify-between text-[12px] text-[#616161] mb-2">
                      <p>Saving:</p>
                      <p className="text-[#1d2e36]">₹{item.totalSaving}</p>
                    </div>
                    <div className="flex justify-between text-[12px] text-[#616161] mb-2">
                      <p>Delivery Charge:</p>
                      <p className="text-[#1d2e36]">Free</p>
                    </div>
                    <div className="flex justify-between text-[16px] text-[#1d2e36] mt-4">
                      <p>Total:</p>
                      <p>₹{item.totalAmount}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 w-full lg:w-[284px]">
                    {item.isCancelled === false && (
                      <button className="px-4 py-2 border border-[#7b9220] text-[#7b9220] text-[14px] rounded-lg w-full h-[50px]" onClick={() => {
                        setCancelModalOpen(true);
                        setCurrentOrderId(item._id);
                      }}>
                        Cancel Order
                      </button>
                    )}

                    <button className="px-4 py-2 border border-[#7b9220] text-[#7b9220] text-[14px] rounded-lg w-full h-[50px]">
                      Need Help
                    </button>
                    <button className="px-4 py-2 border border-[#7b9220] text-[#7b9220] text-[14px] rounded-lg w-full h-[50px]" onClick={() => {
                      setTrackModalOpen(true);
                      setCurrentOrderId(item._id);
                    }}>
                      Track Order
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {isTrackModalOpen && (
        <div
          className="fixed inset-0 z-50 w-auto bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setTrackModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full md:w-1/3 text-left m-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-[#1d2e36] mb-4">Tracking Details</h3>
            <div className="relative">
              {/* Render Tracking Items */}

              {trackingSteps.map((status, index) => {
                const isCompleted = status.completed;
                const isLastCompleted = index === trackingSteps.length - 1;

                return (
                  <div key={index} className="relative flex items-center mb-4">
                    {/* Connecting line */}
                    {index > 0 && (
                      <div
                        className={`absolute left-1.5 w-0.5 ${isCancelled ? "bg-red-500" : isCompleted ? "bg-[#7b9220]" : "bg-gray-300"}`}
                        style={{
                          top: "-40px",
                          height: "100px",
                          transition: "height 0.5s ease-out",
                          animation: isLastCompleted ? "growLine 1s ease-out forwards" : "none",
                        }}
                      />
                    )}

                    {/* Dot */}
                    <span
                      className={`w-4 h-4 rounded-full ${isCancelled
                        ? "bg-red-500"
                        : isCompleted
                          ? "bg-[#7b9220]"
                          : "bg-gray-300"
                        }`}
                      style={{ position: "relative", zIndex: 1 }}
                    ></span>

                    {/* Label & Timestamp */}
                    <div className="ml-8">
                      <span className="font-normal text-[#1d2e36]">{status.step}</span>
                      <p className="text-sm text-gray-600">
                        {status.updatedAt
                          ? new Date(status.updatedAt).toLocaleString()
                          : "Awaiting update..."}
                      </p>
                    </div>
                  </div>
                );
              })}


            </div>
            <button
              onClick={() => setTrackModalOpen(false)}
              className="absolute top-3 right-3 text-[#1d2e36]  rounded-full p-2"
              aria-label="Close tracking modal"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 w-auto  h-screen overflow-y-auto no-scrollbar bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full md:w-1/3 text-center m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">What is your rate?</h3>
            <div className="flex justify-center gap-2 mt-4 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  icon="mdi:star-outline"
                  width={32}
                  onClick={() => setRating(star)}
                  className={`${star <= rating ? "text-yellow-500" : "text-gray-300"
                    } cursor-pointer`}
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              Please share your opinion about the product
            </p>
            <textarea
              placeholder="Your review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full h-20 p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-md mb-4 cursor-pointer">
              <UploadImage
                name="image"
                onImageUpload={handleImageChange}
                icon={true}
                color="black"
                alert={true}
                multiple
              />
              <span className="text-gray-500">Add your photos</span>
            </div>
            {reviewImg.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4 overflow-y-auto no-scrollbar">
                {reviewImg.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review Image ${index + 1}`}
                    className="w-40 h-40 object-cover rounded-md"

                  />
                ))}
              </div>
            )}
            <div className="flex justify-between gap-4">
              <Button
                variant="primary"
                onClick={() => {
                  setReviewModalOpen(false);
                  setReviewImg([]);
                  setRating(0);
                  setReviewText("");
                }}
                className="w-full py-2 bg-gray-200 text-gray-700 rounded-md flex items-center"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitReview}
                className="w-full py-2 bg-yellow-500 text-white rounded-md"
              >
                Send Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 w-auto bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white p-6 rounded-lg w-full md:w-1/3 text-center m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">
              Are you sure you want to cancel?
            </h3>

            {/* Dropdown for selecting reason */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-4">
                <select
                  {...register("selectedReason", {
                    required: "Please select a reason",
                  })}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select a reason</option>
                  <option value="Changed My Mind">Changed My Mind</option>
                  <option value="Price Change">Price Change</option>
                  <option value="Found a Better Deal">
                    Found a Better Deal
                  </option>
                  <option value="Product Not Needed">Product Not Needed</option>
                  <option value="Late Delivery">Late Delivery</option>
                  <option value="Product Out of Stock">
                    Product Out of Stock
                  </option>
                  <option value="Product Description Incorrect">
                    Product Description Incorrect
                  </option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Delivery Address Issue">
                    Delivery Address Issue
                  </option>
                  <option value="Received Damaged/Defective Item">
                    Received Damaged/Defective Item
                  </option>
                  <option value="Unable to Contact Seller">
                    Unable to Contact Seller
                  </option>
                  <option value="Changed Shipping Preference">
                    Changed Shipping Preference
                  </option>
                  <option value="Other">Other</option>
                </select>
                {errors.selectedReason && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.selectedReason.message}
                  </p>
                )}
              </div>

              {/* Show custom reason input if 'Other' is selected */}
              {selectedReason === "Other" && (
                <div className="mt-3">
                  <textarea
                    {...register("customReason", {
                      required: "Please provide your reason",
                    })}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md"
                    placeholder="Please provide your reason"
                  />
                  {errors.customReason && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customReason.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between gap-3 mt-3">
                <Button
                  variant="primary"
                  onClick={() => setCancelModalOpen(false)}
                  className="w-full py-2 bg-gray-200 text-gray-700 rounded-md flex items-center"
                >
                  Go Back
                </Button>
                <Button
                  variant="secondary"
                  type="submit"
                  className="w-full py-2 bg-red-500 text-white rounded-md"
                >
                  Cancel Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 w-auto bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white p-6 rounded-lg w-full md:w-1/3 text-center m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">
              Are you sure you want to return?
            </h3>

            {/* Dropdown for selecting reason */}
            <form onSubmit={handleSubmit(onSubmitReturn)}>
              <div className="mt-4">
                <select
                  {...register("selectedReason", {
                    required: "Please select a reason",
                  })}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select a reason</option>
                  <option value="Changed My Mind">Changed My Mind</option>
                  <option value="Price Change">Price Change</option>
                  <option value="Found a Better Deal">
                    Found a Better Deal
                  </option>
                  <option value="Product Not Needed">Product Not Needed</option>
                  <option value="Late Delivery">Late Delivery</option>
                  <option value="Product Out of Stock">
                    Product Out of Stock
                  </option>
                  <option value="Product Description Incorrect">
                    Product Description Incorrect
                  </option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Delivery Address Issue">
                    Delivery Address Issue
                  </option>
                  <option value="Received Damaged/Defective Item">
                    Received Damaged/Defective Item
                  </option>
                  <option value="Unable to Contact Seller">
                    Unable to Contact Seller
                  </option>
                  <option value="Changed Shipping Preference">
                    Changed Shipping Preference
                  </option>
                  <option value="Other">Other</option>
                </select>
                {errors.selectedReason && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.selectedReason.message}
                  </p>
                )}
              </div>

              {/* Show custom reason input if 'Other' is selected */}
              {selectedReason === "Other" && (
                <div className="mt-3">
                  <textarea
                    {...register("customReason", {
                      required: "Please provide your reason",
                    })}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md"
                    placeholder="Please provide your reason"
                  />
                  {errors.customReason && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customReason.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between gap-3 mt-3">
                <Button
                  variant="primary"
                  onClick={() => setReturnModalOpen(false)}
                  className="w-full py-2 bg-gray-200 text-gray-700 rounded-md flex items-center"
                >
                  Go Back
                </Button>
                <Button
                  variant="secondary"
                  type="submit"
                  className="w-full py-2 bg-red-500 text-white rounded-md"
                >
                  Return Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Private>
  );
}
