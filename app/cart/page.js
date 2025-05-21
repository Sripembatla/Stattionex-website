"use client";
import React, { useState, useEffect } from "react";
import Private from "../layout/Private";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import {
  useDeleteCartMutation,
  useGetCartQuery,
  useUpdateCartMutation,
} from "../redux-tookit/services/authApi";
import { Button } from "@headlessui/react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  updateItemQuantity,
  addItemToCart,
  removeItemFromCart,
  removeBuyNow,
} from "../redux-tookit/cart/cartSlicer";

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.accessToken);
  const cartData = useSelector((state) => state.cart);
  // console.log("cartDatacartDatacartData", cartData);
  // console.log("tokentokentokentokentoken", token);

  const [updateCart] = useUpdateCartMutation();
  const [deleteCart] = useDeleteCartMutation();
  const { data } = useGetCartQuery();
  // console.log("datadatadata", data);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (data) {
          data.cart.items.forEach((item) => {
            const {
              _id,
              product,
              color,
              price,
              size,
              productImage,
              quantity,
              variant,
            } = item;
            const itemData = {
              id: _id,
              productId: product?._id,
              name: product?.name,
              price: price,
              quantity: quantity,
              colorId: color?._id,
              colorCode: color?.hexCode,
              sizeId: size?._id,
              sizeLabel: size?.sizeLabel,
              img: productImage || "",
              variantId: variant,
              cartId: data?.cart?._id,
            };

            const existingItem = cartData?.cartItems?.find(
              (existingItem) =>
                existingItem?.productId === itemData?.productId &&
                existingItem?.colorId === itemData?.colorId &&
                existingItem?.sizeId === itemData?.sizeId &&
                existingItem?.variantId === itemData?.variantId
            );
            // console.log('existingItem', existingItem)
            if (!existingItem) {
              dispatch(addItemToCart(itemData));
            }
          });
        }
      } catch (cartError) {
        console.log("cartErrorcartErrorcartError", cartError);
      }
    };

    if (token) {
      fetchCartData();
    } else {
      console.log("Token is not there");
    }
  }, [data, token, dispatch]);

  useEffect(() => {
    if (localStorage.getItem("buynow") !== null) {
      localStorage.removeItem("buynow");
      dispatch(removeBuyNow());
    }
  }, []);

  const handleContinue = (v) => {
    router.push(`/${v}`);
  };
  // Check if cart is empty or API returned success as false
  if (cartData.cartItems.length === 0) {
    return (
      <Private>
        {/* <div className="cursor-pointer lg:pl-20 lg:pt-5">
          <Icon icon="fe:arrow-left" width={25} height={25} />
        </div> */}
        <div className="min-h-screen flex flex-col items-center justify-center">
          <img src="/assets/images/cartempty.png" alt="Empty Cart" />
          {token == null ? (
            <Button
              variant="primary"
              className="flex gap-x-2 items-center justify-center bg-primary text-white px-4 py-3 rounded-[10px] "
              onClick={() => handleContinue("auth")}
            >
              <Icon icon="mingcute:shopping-cart-1-line" width={24} />
              <span>Login</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              className="flex gap-x-2 items-center justify-center bg-primary text-white px-4 py-3 rounded-[10px]"
              onClick={() => handleContinue("products")}
            >
              <Icon icon="mingcute:shopping-cart-1-line" width={24} />
              <span>Continue Shopping</span>
            </Button>
          )}
        </div>
      </Private>
    );
  }

  // const cartItems = data.cart.items; // Data from API response
  // const grandTotal = data.cart.grandTotal; // Total amount from API

  const revertCartData = async (actionType, data) => {
    try {
      if (actionType === "update") {
        dispatch(
          updateItemQuantity({
            productId: data.productId,
            quantity: data.quantity,
            operation: data.operation,
            sizeId: data.sizeId,
            colorId: data.colorId,
            variantId: data.variantId,
          })
        );
      } else if (actionType === "delete") {
        dispatch(addItemToCart(data));
      }
      console.log(`Action reverted successfully!`);
    } catch (error) {
      console.error("Failed to revert cart data:", error);
      console.log("Failed to revert cart data.");
    }
  };

  // Quantity change handler
  const handleQuantityChange = async (item, operation) => {
    console.log("itemitem", item);

    const previousData = {
      productId: item.productId,
      quantity: item.quantity,
      operation: operation,
      sizeId: item.sizeId?._id,
      colorId: item.colorId,
      variantId: item.variantId,
    };

    let consoleMessage = "";

    try {
      // Calculate new quantity based on the operation
      let newQuantity =
        operation === "increment" ? item.quantity + 1 : item.quantity - 1;
      // Dispatch action to update item quantity in Redux store
      dispatch(
        updateItemQuantity({
          productId: item.productId,
          quantity: newQuantity,
          operation: operation,
          sizeId: item.sizeId,
          colorId: item.colorId,
        })
      );

      // Only call the API if token exists
      if (token) {
        try {
          if (newQuantity > 0) {
            let data = {
              itemId: item?.id,
              cartId: item?.cartId,
              quantity: newQuantity,
            };

            // Make the API call to update the cart
            const response = await updateCart({
              ...data,
            }).unwrap();
            console.log("Cart updated successfully:", response);
            if (response?.cart) {
              consoleMessage =
                response?.message || "Quantity updated successfully!";
            } else {
              await revertCartData("update", previousData);
              consoleMessage =
                res?.message || "Failed to update quantity on server.";
            }
          }
        } catch (error) {
          await revertCartData("update", previousData);
          consoleMessage = "Error updating quantity on server.";
          console.error("API call error:", error);
        }
      } else {
        consoleMessage = "Quantity updated in cart!";
      }
    } catch (err) {
      console.error("Failed to update item in Redux:", err);
      consoleMessage = "Failed to update item in cart.";
    }

    // Log the message to the console
    console.log("consoleMessage", consoleMessage);
  };

  // Clear entire cart handler
  const clearCart = async (item) => {
    let consoleMessage = "";

    try {
      dispatch(removeItemFromCart({ ...item }));
      // Only call the API if token exists
      if (token) {
        try {
          const response = await deleteCart({ itemId: item.id }).unwrap();
          console.log("responseresponse", response);
          if (response?.success === true) {
            consoleMessage =
              response?.message || "Item removed from server cart!";
          } else {
            if (response.status == 404) {
              consoleMessage = "Item removed from server cart!";
              await revertCartData("delete", item);
            } else {
              consoleMessage =
                response?.message || "Failed to remove item from server cart.";
              await revertCartData("delete", item);
            }
          }
        } catch (error) {
          if (error.status == 404) {
            consoleMessage = "Item removed from server cart!";
            // await revertCartData("delete", item);
          } else {
            console.error("API call error:", error);
            consoleMessage = "Error removing item from server cart.";
            await revertCartData("delete", item);
          }
  
        }
      } else {
        consoleMessage = "Item removed from cart!";
      }
    } catch (err) {
      console.error("Failed to remove item from Redux:", err);
      consoleMessage = "Failed to remove item from cart.";
    }

    // Log the message to the console
    console.log(consoleMessage);
  };

  // Assuming a flat shipping rate, modify if needed
  const shipping = 70;
  const total = 500 + shipping;

  const handleCheckOut = () => {
    if (token == null) {
      router.push("/auth");
    } else {
      router.push("/deliverypage");
    }
  };

  // console.log('cartData.cartItems', cartData.cartItems)

  return (
    <div>
      <Private>
        <div className="bg-[#e5e7eb]">
          {/* <div
            className="cursor-pointer lg:pl-20 lg:pt-5"
            onClick={handleBackClick}
          >
            <Icon icon="fe:arrow-left" width={25} height={25} />
          </div> */}
          <div className="min-h-screen p-4 lg:p-8 lg:mx-10">
            <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 bg-white rounded-lg p-4 lg:p-6">
                {/* Header Section */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 place-items-center">
                  <span className="font-semibold text-lg md:col-span-2">
                    Products
                  </span>
                  <span className="font-semibold text-lg">Price</span>
                  <span className="font-semibold text-lg">Qty</span>
                  <span className="font-semibold text-lg">Total Price</span>
                  <span className="font-semibold text-lg"></span>
                </div>

                {/* Cart Items */}
                {cartData.cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 border-t border-gray-200"
                  >
                    {/* Product Image and Name - Increased width on larger screens */}
                    <div className="flex items-center space-x-5 md:col-span-2">
                      {" "}
                      {/* Give this section more space */}
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-28 h-28 object-cover rounded-lg"
                      />
                      <div className="flex flex-col justify-start mb-4 px-2">
                        <p
                          className=" text-[18px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[18px] truncate w-[200px]"
                          title={item?.name}
                        >
                          {item.name}
                        </p>
                        <p className="text-[12px]">
                          {item.sizeLabel ? "Size : " + item.sizeLabel : ""}
                        </p>
                        <p
                          className={`text-[12px] ${
                            item.colorCode ? "w-4 h-4 rounded-full" : ""
                          } `}
                          style={
                            item.colorCode
                              ? { backgroundColor: item.colorCode }
                              : {}
                          }
                        ></p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-4">
                      <p className="text-[20px] font-semibold">
                        Rs. {item.price}
                      </p>
                    </div>

                    {/* Quantity Buttons */}
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleQuantityChange(item, "decrement")}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300"
                      >
                        <Icon icon="ic:baseline-minus" width={25} />
                      </button>
                      <p className="text-sm text-center font-bold text-[22px]">
                        {item.quantity}
                      </p>
                      <button
                        onClick={() => handleQuantityChange(item, "increment")}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300"
                      >
                        <Icon icon="ic:baseline-plus" width={25} />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center justify-center gap-4">
                      <p className="text-[20px] font-semibold">
                        Rs. {item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => clearCart(item)}
                        className="text-black-500 hover:text-red-500"
                      >
                        <Icon icon="carbon:trash-can" width="22" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="bg-white rounded-lg p-4 lg:p-6 h-fit">
                <div className="mb-6 flex gap-6 items-center">
                  <h3 className="font-bold text-[20px]">
                    Do you have a voucher?
                  </h3>
                  <h3 className="">(Optional)</h3>
                </div>

                <div className="flex items-center space-x-2 mb-4 w-full">
                  <input
                    type="text"
                    placeholder="Enter the code"
                    className="bg-gray-100 border border-gray-300 rounded-[10px] py-2 px-4 w-full text-[20px]"
                  />
                  <button className="bg-primary text-white px-4 py-2 rounded-[10px] w-full text-[20px]">
                    Redeem
                  </button>
                </div>
                <div className="border-t border-gray-300 py-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      Rs. {cartData?.totalPrice ? cartData?.totalPrice : 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping Charges</span>
                    <span>Rs. {shipping}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-8">
                    <span>Total</span>
                    <span>
                      Rs.{" "}
                      {cartData?.totalPrice
                        ? cartData?.totalPrice + shipping
                        : 0}
                    </span>
                  </div>
                </div>
                {/* <button className="bg-primary w-full text-white py-2 rounded-lg mt-4">
                  Save And Checkout
                </button> */}
              </div>
            </div>
            <div className="mt-10 text-center">
              <button
                className="bg-primary text-white px-4 lg:px-32 py-2 rounded-lg w-full lg:w-auto"
                onClick={handleCheckOut}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </Private>
    </div>
  );
}
