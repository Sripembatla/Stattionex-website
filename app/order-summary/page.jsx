"use client";
import Private from "../layout/Private";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeItemFromCart, updateItemQuantity } from "../redux-tookit/cart/cartSlicer";
import {
  useOrderMutation,
  useGetWalletQuery,
  useGetCouponQuery,
} from "../redux-tookit/services/authApi";
import { toast } from "react-toastify";
import { useState, useEffect, useMemo } from "react";
import { updateBalance } from "../redux-tookit/features/authSlice";
import initiateRazorpayPayment from "../utils/reusable/razorPay";
import QuantityController from "../utils/reusable/quantity";

export default function Order() {
  const cartData = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state?.auth?.user);
  const { data: couponData } = useGetCouponQuery();

  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [razorpayOrderId, setRazorpayOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const buyNowStatus = useMemo(() => {
    const status = localStorage.getItem("buynow");
    return status === null ? false : JSON.parse(status);
  }, []);

  const filteredCartItems = useMemo(() => {
    return cartData.cartItems.filter((item) => item.isBuyNow === true);
  }, [cartData.cartItems]);

  const result = useMemo(() => {
    return buyNowStatus ? { ...cartData, cartItems: filteredCartItems } : cartData;
  }, [buyNowStatus, cartData, filteredCartItems]);

  const cart_data = useMemo(
    () => (buyNowStatus ? result?.cartItems : cartData?.cartItems),
    [buyNowStatus, result, cartData]
  );

  const offersWithProductId = useMemo(() => {
    return couponData?.coupons?.map((c) => ({
      ...c,
      code: c.code,
      offerCode: c.code,
      offerType: `${c.code} - Save ₹${c.discountAmount}`,
    }));
  }, [couponData]);

  const [order] = useOrderMutation();

  const createOrderPayload = (paymentType) => {
    const defaultAddress = userInfo?.addresses?.find(
      (addr) => addr._id === userInfo?.defaultAddress
    );
    if (!defaultAddress || !defaultAddress._id) {
      toast.error("Default address is missing!");
      throw new Error("Default address is not properly set.");
    }
    return {
      paymentDetails: {},
      address: defaultAddress._id,
      paymentMethod: paymentType,
    };
  };

  const processOrder = async () => {
    try {
      const orderPayload = createOrderPayload(paymentMethod);
      const response = await order(orderPayload).unwrap();
      if (response.success) {
        dispatch(clearCart());
        return response;
      } else {
        toast.error(response?.message);
        return null;
      }
    } catch (err) {
      toast.error(err?.message || "Order placement failed");
    }
  };

  const handlePlaceOrder = async () => {
    const orderRes = await processOrder();
    if (!orderRes) return;

    if (paymentMethod === "CARD") {
      initiateRazorpayPayment({
        amount: cartData.totalPrice,
        userInfo,
        onSuccess: () => router.push("/paymentsuccess"),
        onFailure: (err) => toast.error("Payment Failed"),
        OrderResponse: orderRes,
      });
    } else {
      router.push("/paymentsuccess");
    }
  };

  const handleApplyCoupon = (coupon) => {
    if (cartData.totalPrice >= coupon.minOrderAmount) {
      setSelectedCoupon(coupon);
      setAppliedCoupons([...appliedCoupons, coupon]);
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
    } else {
      toast.error("Minimum order amount not met for this coupon, minimum order amount is " + coupon.minOrderAmount + ".");
    }
  };

  const handleRemoveCoupon = (coupon) => {
    setAppliedCoupons(appliedCoupons.filter((c) => c.code !== coupon.code));
    setSelectedCoupon(null);
    toast.success(`Coupon "${coupon.code}" removed successfully!`);
  };

  const calculateSubtotal = (cart) =>
    cart?.reduce((total, item) => total + item?.price * item?.quantity, 0);

  const subtotal = calculateSubtotal(cart_data);
  const shippingCharges = buyNowStatus
    ? cart_data[0]?.deliveryCharges
    : cartData?.deliveryCharges;

  const discount = selectedCoupon?.discountAmount || 0;
  const total = subtotal + shippingCharges - discount;
  const handlePaymentSuccess = (response) => {
    console.log("Payment was successful!", response);
    // Handle your success logic here (e.g., update state, navigate)
    router.push("/paymentsuccess");
  };

  const handlePaymentFailure = (response) => {
    console.log("Payment failed", response);
    // Handle failure logic here (e.g., show an error message or log details)
  };
  const totalMrp = cartData.cartItems.reduce(
    (acc, item) => acc + item.variants?.mrp * item.quantity,
    0
  );
  const totalSelling = cartData.cartItems.reduce(
    (acc, item) => acc + item.variants?.sellingPrice * item.quantity,
    0
  );
  const totalSaving = totalMrp - totalSelling;

  return (
    <Private>
      <div className="bg-white min-h-screen container">
        <div className="lg:min-h-screen flex flex-col lg:flex-row lg:items-start justify-center space-y-4 lg:space-y-0 md:space-x-4">
        <div className="bg-white sm:p-6 rounded-lg max-w-5xl w-full flex flex-col items-center sm:mt-16 shadow-sm">
  <div className="space-y-6 w-full">
    {cart_data?.map((item) => (
      <div
        key={item.productId}
        className="flex flex-rowitems-center justify-center bg-white p-4 gap-4 sm:gap-6 rounded-lg w-full"
      >
        <img
          src={item.img}
          alt="Product Image"
          className="w-24 h-24 sm:w-40 sm:h-40 object-cover rounded-lg mx-auto"
        />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          {/* Product Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-normal text-[#1d2e36] text-lg sm:text-xl lg:text-2xl">
              {item.name}
            </h3>
            <p className="text-[#616161] text-sm sm:text-base">
              Variant: <span className="text-[#1d2e36]">{item.variants?.quantity}{item.variants?.unit}</span>
            </p>
          </div>

          {/* Price & Savings */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-1 sm:gap-2 text-sm sm:text-base">
            <div className="text-[#1d2e36] text-xl">
              ₹ {item.variants?.sellingPrice * item.quantity}
            </div>
            <div className="text-[#616161]">
              Saving: ₹ {(item.variants?.mrp * item.quantity) - (item.variants?.sellingPrice * item.quantity)}
            </div>
          </div>

          {/* Quantity Controller */}
          <div className="w-full sm:w-[195px] h-[50px]">
            <QuantityController
              quantity={item.quantity}
              onIncrease={() =>
                dispatch(
                  updateItemQuantity({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity + 1,
                    operation: "increment",
                  })
                )
              }
              onDecrease={() => {
                if (item.quantity > 1) {
                  dispatch(
                    updateItemQuantity({
                      productId: item.productId,
                      variantId: item.variantId,
                      quantity: item.quantity - 1,
                      operation: "decrement",
                    })
                  );
                } else {
                  dispatch(
                    removeItemFromCart({
                      productId: item.productId,
                      variantId: item.variantId,
                    })
                  );
                }
              }}
              onRemove={() =>
                dispatch(
                  removeItemFromCart({
                    productId: item.productId,
                    variantId: item.variantId,
                  })
                )
              }
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

          <div className="flex flex-col items-center justify-center space-y-2 ">
            <div className="bg-white rounded-xl p-4 lg:p-4 h-fit w-full lg:mt-16 shadow-sm border">

              {offersWithProductId?.length > 0 ? (
                <div className="w-full mb-6">
                  <h3 className="font-medium text-[20px] mb-2">
                    Available Coupons
                  </h3>
                  <div
                    className="space-y-2 overflow-auto no-scrollbar"
                    style={{ maxHeight: "250px" }} // Adjust the maxHeight as needed
                  >
                    {offersWithProductId.map((coupon) => (
                      <div
                        key={coupon.code}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-lg space-x-4"
                      >
                        <div className="flex items-center">
                          <Icon
                            icon="mdi:coupon-outline"
                            width={25}
                            height={25}
                          />
                          <div className="ml-2">
                            <h4 className="font-semibold">{coupon.offerType}</h4>
                            <p className="text-sm text-gray-500">
                              Code: {coupon.offerCode}
                            </p>
                          </div>
                        </div>
                        {/* <button
                        className="bg-primary text-white px-4 py-2 rounded-lg"
                        onClick={() => handleApplyCoupon(coupon)}
                      >
                        Apply
                      </button> */}
                        <button
                          className="bg-secondary text-white px-4 py-2 rounded-lg"
                          onClick={
                            () =>
                              appliedCoupons.some(
                                (applied) => applied.code === coupon.code
                              )
                                ? handleRemoveCoupon(coupon) // If applied, remove it
                                : handleApplyCoupon(coupon) // If not applied, apply it
                          }
                        >
                          {appliedCoupons.some(
                            (applied) => applied.code === coupon.code
                          )
                            ? "Remove"
                            : "Apply"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full mb-6">
                  <h3 className="font-bold text-[20px] mb-2">No Coupons Available</h3>
                  {/* <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={enteredCoupon}
                    onChange={(e) => setEnteredCoupon(e.target.value)}
                    placeholder="Enter the code"
                    className="bg-gray-100 border border-gray-300 rounded-[10px] py-2 px-4 w-full text-[20px]"
                  />
                  <button
                    className="bg-secondary text-white px-4 py-2 rounded-[10px] w-full text-[20px]"
                    onClick={handleApplyCoupon}
                  >
                    Redeem
                  </button>
                </div> */}
                </div>
              )}

              <div className="border-t border-gray-300 py-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {cartData?.totalPrice?.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping Charges</span>
                  <span>Rs. {shippingCharges}</span>
                </div>

                {selectedCoupon && cartData?.totalPrice >= selectedCoupon.minOrderAmount && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Discount ({selectedCoupon.code})</span>
                    <span>- Rs. {selectedCoupon.discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium text-lg mt-8">
                  <span>Total</span>
                  <span>
                    Rs.{" "}
                    {selectedCoupon && cartData?.totalPrice >= selectedCoupon.minOrderAmount
                      ? (cartData.totalPrice - selectedCoupon.discountAmount).toFixed(2)
                      : cartData?.totalPrice?.toFixed(2)}
                  </span>
                </div>

                <div>
                  <p className="text-[#1d2e36] text-[18px] font-normal my-4">Payment Method</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="w-4 h-4 accent-[#7b9220]"
                    />
                    <label htmlFor="cod" className="text-[#1d2e36] text-[14px] font-normal">
                      Cash on Delivery
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                      className="w-4 h-4 accent-[#7b9220]"
                    />
                    <label htmlFor="card" className="text-[#1d2e36] text-[14px] font-normal">
                      RazorPay
                    </label>
                  </div>
                </div>
              </div>


              <button className="bg-[#7b9220] text-white px-4 py-2 rounded-[10px] w-full text-[18px]" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>

          </div>
        </div>
      </div>
    </Private>
  );
}
