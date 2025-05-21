"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { closeSidebar } from "../redux-tookit/features/sidebarSlice";
import { useRouter } from "next/navigation";
import {
  useDeleteCartMutation,
  useGetCartQuery,
  useGetSingleProductQuery,
  useUpdateCartMutation,
} from "../redux-tookit/services/authApi";
import {
  updateItemQuantity,
  removeItemFromCart,
  addItemToCart,
  setCartItems,
} from "../redux-tookit/cart/cartSlicer";
import { motion } from "framer-motion";
import QuantityController from "../utils/reusable/quantity";

const Cart = () => {
  const isOpenCart = useSelector((state) => state.sidebar.isOpenCart);
  const cartData = useSelector((state) => state.cart);
  const token = useSelector((state) => state?.auth?.accessToken);
  const [isCartOpen, setCartOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, refetch } = useGetCartQuery({ token });
  // console.log("data", data);
  const [updateCart] = useUpdateCartMutation();
  const [deleteCart] = useDeleteCartMutation();

  const [cart_data, setCart_Data] = useState({})

  useEffect(() => {
    setCart_Data(cartData)
  }, [cartData])
  

  useEffect(() => {
    if (isOpenCart) {
      refetch();
    }
  }, [isOpenCart, refetch]);


  useEffect(() => {
    // console.log("isOpen", isOpen);

    setCartOpen(isOpenCart);
  }, [isOpenCart]);


  useEffect(() => {
    if (data) {
      data.items?.map(item => {
        console.log('items, items', item)
        const itemData = {
          itemId: item?.itemId,
          productId: item?.productId,
          name: item.productName,
          img: item.images?.[0] || "", // use placeholder if needed
          quantity: item.units,
          variantId: item.variant?._id,
          variants: {
            ...item.variant,
            mrp: item.variant.mrp, // assuming no separate MRP; adjust if needed
            sellingPrice: item.variant.sellingPrice,
          },
        };

        const existingItem = cartData?.cartItems?.find(
          existingItem =>
            existingItem?.productId === itemData?.productId &&
            existingItem?.variantId === itemData?.variantId,
        );
        if (!existingItem) {
          dispatch(addItemToCart(itemData));
        }
       
      });
    }
 

setCart_Data(prev => {
  console.log('prev', prev);

  const updatedItems = prev?.cartItems.map(prevItem => {
    const matchedItem = data?.items?.find(dataItem =>
      dataItem?.productId === prevItem?.productId &&
      dataItem?.variant._id === prevItem?.variantId
    );

    if (matchedItem) {
      return {
        ...prevItem,
        itemId: matchedItem?.itemId, // ✅ Assign itemId here
      };
    }

    return prevItem;
  });

  return {
    ...prev,
    cartItems: updatedItems,
  };
});
   
  }, [isOpenCart, data]);

  useEffect(() => {
  console.log("Updated cartData", cartData);
}, [cartData?.cartItems]);



  const handleCheckOut = () => {
    if (token == null) {
      dispatch(closeSidebar());
      router.push("/?login=true");
    } else {
      dispatch(closeSidebar());
      router.push("/deliverypage");
    }
  };

  const handleCloseCart = () => {
    console.log("close cart");

    dispatch(closeSidebar());
  };
  const handleBackdropClick = () => {
    dispatch(closeSidebar());
  };

  const totalMrp = cart_data?.cartItems?.reduce(
    (acc, item) => acc + item.variants?.mrp * item.quantity,
    0
  );
  const totalSelling = cart_data?.cartItems?.reduce(
    (acc, item) => acc + item.variants?.sellingPrice * item.quantity,
    0
  );
  const totalSaving = totalMrp - totalSelling;

  return (
    <>
      {
        isCartOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={handleBackdropClick}
            aria-label="Backdrop"
          ></div>
        )
      }
      <motion.div
        key={isCartOpen}
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-lg flex flex-col w-full sm:w-[500px] lg:w-[765px] `}
        initial={{ opacity: 0, x: "100%" }}
        animate={{
          opacity: isCartOpen ? 1 : 0,
          x: isCartOpen ? 0 : "100%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >


        <button onClick={() => dispatch(closeSidebar())} className="absolute top-14 -left-4 w-10 h-10 flex shadow-lg items-center justify-center bg-white rounded-full">
          <Icon icon="ph:arrows-out-cardinal" color="black" width="25" />
        </button>

        {/* Cart Content */}
        <div className="p-6 overflow-y-auto flex-grow ">
          <div className="flex justify-between items-center border-b border-slate-300 mb-2 p-1 pb-2 ">
            <div className="flex items-center gap-2 cursor-pointer relative">
              <Icon icon="bitcoin-icons:cart-outline" width="25" height="25" />
              <p className="text-sm  text-[#1D2E36]">My Cart</p>
              {cart_data?.cartItems?.length > 0 && (
                <span className="absolute -top-2 left-0 w-2 h-2 p-2 bg-[#7b9220] text-white rounded-full text-[10px] flex items-center justify-center">
                  {cart_data?.cartItems?.length}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm  text-[#1D2E36]">Total Saving</p>
              <p className="text-sm  text-[#1D2E36]">₹ {totalSaving > 0 ? totalSaving : 0} </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm  text-[#1D2E36]">Total Amount</p>
              <p className="text-sm  text-[#1D2E36]">₹ {cart_data?.totalPrice}</p>
            </div>
          </div>


          {cart_data?.cartItems?.length > 0 ? (
            // console.log("cart_data?.cartItems?", cart_data?.cartItems?),

            cart_data?.cartItems?.map((item, index) => (
              <div key={index} className="flex flex-col gap-4 py-4">
                {/* Product Details */}
                <div className="flex gap-5 w-full  relative">

                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-40 h-40 object-cover  shadow"
                  />
                  <div className="flex flex-col space-y-8 w-full">
                    <div className="flex justify-between items-center">
                      <p
                        className="text-2xl truncate w-[305px] font-normal text-[#1d2e36]"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <p></p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p
                        className="text-[20px] font-medium text-[#1d2e36]"

                      >
                        ₹ {item.variants?.sellingPrice * item.quantity}
                      </p>
                      <p
                        className="text-[#a5a5a5] text-[14px] font-normal"

                      >
                        Saving ₹{(item.variants?.mrp * item.quantity) - (item.variants?.sellingPrice * item.quantity)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p
                        className="text-[16px]  font-normal text-[#a1a1a1]"

                      >
                        Variant: <span className="text-[#1d2e36]">{item.variants?.quantity}{item.variants?.unit}</span>
                      </p>
                      <div className="w-[195px] h-[50px]">
                        <QuantityController
                          quantity={item.quantity}
                          onIncrease={async () => {
                            const newQuantity = item.quantity + 1;
                            dispatch(
                              updateItemQuantity({
                                productId: item.productId,
                                variantId: item.variantId,
                                quantity: newQuantity,
                                operation: "increment",
                              })
                            )
                            // if (!item.itemId) return;
                            await updateCart(
                              {
                                itemId: item.itemId,
                                units: newQuantity
                              }
                            )
                            // refetch();
                          }
                          }
                          onDecrease={async () => {
                            if (item.quantity > 1) {
                              const newQuantity = item.quantity - 1;
                              dispatch(
                                updateItemQuantity({
                                  productId: item.productId,
                                  variantId: item.variantId,
                                  quantity: item.quantity - 1,
                                  operation: "decrement",
                                })
                              );
                              // if (!item.itemId) return;
                              await updateCart(
                                {
                                  itemId: item.itemId,
                                  units: newQuantity
                                }
                              )
                              // refetch();
                            } else {

                              dispatch(
                                removeItemFromCart({
                                  productId: item.productId,
                                  variantId: item.variantId,
                                })
                              );
                              // if (!item.itemId) return;
                              await deleteCart(
                                {
                                  itemId: item.itemId,
                                }
                              )
                              // refetch();
                            }
                          }}
                          onRemove={async () => {
                            console.log("item", item);
                            // return
                            dispatch(
                              removeItemFromCart({
                                productId: item.productId,
                                variantId: item.variantId,
                              })
                            )
                            // if (!item.itemId) return;
                            await deleteCart(
                              {
                                itemId: item?.itemId,
                              }
                            )
                            // refetch();
                          }
                          }
                        />
                      </div>
                    </div>
                  </div>


                </div>

              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-4/5">

              <img src="/assets/images/cartempty1.png" alt="Empty Cart" className="w-1/2 flex justify-center items-center mx-auto mt-4" />
            </div>
          )}
        </div>

        {/* Checkout Button */}
        {cart_data?.cartItems?.length > 0 && (
          <div className="p-6">
            {/* Summary Section */}
            <div className=" border-gray-300 py-6 mt-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {cart_data?.totalPrice}</span>
              </div>

            </div>
            <button
              className="w-full bg-[#7b9220] text-white py-3 rounded-lg  font-medium"
              onClick={handleCheckOut}
            >
              Continue to Checkout
            </button>
          </div>
        )}
      </motion.div>

    </>

  );
};

export default Cart;
