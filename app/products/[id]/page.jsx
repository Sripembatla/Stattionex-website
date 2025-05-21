"use client";
import { useParams, useRouter } from "next/navigation";
import Private from "@/app/layout/Private";
import { Icon } from "@iconify/react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../style.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import { useRef, useState } from "react";
import { WEBSITE_BASE_URL_2 } from "@/app/utils/constant";
import { useEffect } from "react";
import Share from "@/app/component/Share";
import {
  addItemToCart,
  removeItemFromCart,
  buyNow,
  updateItemQuantity,
  removeBuyNow,
} from "@/app/redux-tookit/cart/cartSlicer";
import {
  useDeleteCartMutation,
  useGetCartQuery,
  useGetSingleProductQuery,
  useUpdateCartMutation,
} from "../../redux-tookit/services/authApi";
import StarRatings from "react-star-ratings";
import { useAddtoCartMutation } from "@/app/redux-tookit/services/authApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useGetProductsQuery } from "@/app/redux-tookit/services/productService";
import { openSidebar } from "@/app/redux-tookit/features/sidebarSlice";
import { formatDistanceToNow } from "date-fns";
import QuantityController from "@/app/utils/reusable/quantity";
import AddToCartButton from "@/app/utils/reusable/addtocart";

export default function ProductView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.accessToken);
  const [refreshWhileAddtoCart, setRefreshWhileAddtoCart] = useState(false);
  const { data } = useGetProductsQuery();
  const [fewLeft, setFewLeft] = useState(null);


  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const handleRating = (rate) => {
    setRating(rate);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const params = useParams();
  const {
    data: productData,
    isLoading,
    error,
  } = useGetSingleProductQuery({ id: params.id });
  

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [colorsImage, setColorsImage] = useState(null);
  const [productPrice, setProductPrice] = useState(0);
  const [productBasePrice, setProductBasePrice] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [config, setConfig] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState({});
  const [variant, setVariant] = useState([]);
  const galleryRef = useRef(null);
  const [galleryWidth, setGalleryWidth] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seeMoreState, setSeeMoreState] = useState({});
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceUnit, setPriceUnit] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (productData) {
      const firstVariant = productData.product?.variants[0];
      const variantPrice = firstVariant.sellingPrice || 0;
      const basePrice = firstVariant.mrp || 0;
      const qty = firstVariant.inStock;


      const isFewLeft = qty > 0 && qty < 10;
      setFewLeft(isFewLeft ? qty : null);

      if (qty === 0) {
        setOutOfStock(true);
      }

      setSelectedVariant(firstVariant.id);
      setVariant(firstVariant);
      setSelectedImages(productData.product.images || []);

      // Update product base price
      setProductBasePrice(basePrice);

      if (variantPrice === basePrice) {
        setProductPrice(variantPrice);
        setPercentage(0);
      } else {
        setProductPrice(variantPrice);

        let discountPercentage =
          ((basePrice - variantPrice) / basePrice) * 100;
        setPercentage(discountPercentage.toFixed(2));
      }


    }
  }, [productData]);



  const handleVariantSelect = (selectedVariant) => {
    setVariant(selectedVariant);
    setSelectedVariant(selectedVariant.id);

    const variantPrice = selectedVariant.sellingPrice;
    const basePrice = selectedVariant.mrp;
    const quantity = selectedVariant.quantity;
    const unit = selectedVariant.unit;

    // Update product price based on selected variant
    setProductPrice(variantPrice);
    setProductBasePrice(basePrice)

    // If there's a difference between the base price and selling price, calculate the discount
    if (variantPrice === basePrice) {
      setPercentage(0);
    } else {
      const discountPercentage = ((basePrice - variantPrice) / basePrice) * 100;
      setPercentage(discountPercentage.toFixed(2));
    }

    if (variantPrice && quantity) {
      const perUnit = variantPrice / quantity
      setPriceUnit(`₹${perUnit.toFixed(2)} / 1 ${unit}`)
    } else {
      setPriceUnit(null)
    }
  };

  const handleColorChange = function (color) {
    setSelectedColor(color);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? selectedImages.length - 1 : prevIndex - 1
    );
  };
  const handleNex = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === selectedImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  const [zoomPosition, setZoomPosition] = useState({
    x: 0,
    y: 0,
    isZoomed: false,
  });
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y, isZoomed: true });
  };
  const handleMouseLeave = () => {
    setZoomPosition({ x: 0, y: 0, isZoomed: false });
  };

  const [addtoCart, { data: cart, isSuccess, isError }] =
    useAddtoCartMutation();

    const cartItem = useSelector((state) =>
      state.cart?.cartItems.find(
        (item) =>
          item.productId === productData?.product.id && item.variantId === variant.id
      )
    );

    
    
    
  const handleAddtoCart = async (data, type) => {
    
    
    if (!variant) return toast.error("Please select a variant");
  
    if (token == null && type === "orderSummary") return router.push("/auth");
  
    const selectedImage = selectedImages?.[0] || "";
  
    const dataRedux = {
      productId: productData?.product.id,
      name: productData?.product.name,
      variants: variant, // full variant object
      quantity: 1,
      img: selectedImages?.[0] || "",
      variantId:  variant.id,
    };
  
    const dataApi = {
      productId: productData?.product.id,
      variantId: variant._id || variant.id,
      units: 1, // update this to user-selected quantity if needed
    };

   
    
    try {
      setRefreshWhileAddtoCart(true);
  
      if (token) {
        const result = await addtoCart(dataApi).unwrap();
        if (result) {
          
          
          toast.success("Item added to cart successfully!");
  
          const foundItem = result?.cart?.find((item) => {
            return (
              item.productId === dataRedux.productId &&
              item.variantId === dataRedux.variantId
            );
          });
  
          dispatch(
            addItemToCart({
              ...dataRedux
            })
          );
        } else {
          toast.error("Failed to add item to cart.");
          dispatch(removeItemFromCart({ dataRedux }));
        }
      } else {
        dispatch(addItemToCart(dataRedux));
        toast.success("Item added to cart!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong. Try again.");
      dispatch(removeItemFromCart({ dataRedux }));
    } finally {
      setRefreshWhileAddtoCart(false);
    }
  
    dispatch(openSidebar());
    setCartOpen(true);
  };
  
  return (
    <Private>
      {refreshWhileAddtoCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out opacity-100"
          aria-live="assertive"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-200"></div>
              <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-400"></div>
              <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-600"></div>
            </div>{" "}
          </div>
        </div>
      )}
      <div className="ProductDetails mb-12">
        <div className={`container ${isCartOpen ? "relative z-20" : ""} `}>
          <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col gap-8 mx-6 ">
            {isLoading ? (
              <div className="w-[40%]">
                <div className="flex space-y-5 flex-col">
                  <div className="w-[80%]">
                    <div className="skeleton w-[100%] h-[100%] rounded-md" />
                  </div>
                  <div className="flex  gap-5 w-[40%]">
                    <div className="skeleton w-[100%] h-40 rounded-md" />
                    <div className="skeleton w-[100%] h-40 rounded-md" />
                    <div className="skeleton w-[100%] h-40 rounded-md" />
                  </div>

                </div>
              </div>
            ) : (
              <div className="lg:w-2/5 md:sticky md:top-24 h-max">
                <div className="flex relative space-x-0 md:space-x-3">
                  {/* <button
                    className="absolute top-5 -left-10 transform -translate-x-1/2 -translate-y-1/2 bg-[#7b9220] rounded-full pr-6 p-4  text-white hidden md:flex group transition-all duration-300 ease-in-out"
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

                  <div className="flex flex-col gap-2 h-full w-full">
                    <div className="flex flex-col-reverse gap-4 h-full">
                      {/* Thumbnails */}
                      <div className=" flex  items-center gap-2 overflow-x-auto no-scrollbar">
                        {selectedImages?.map((url, index) => (
                          <div className="w-32 h-[130px] flex-shrink-0" key={index}>
                            <img
                              key={index}
                              src={url}
                              alt={`Product Image ${index + 1}`}
                              className={`w-full object-fill rounded-xl  mb-2 cursor-pointer h-full ${index === currentIndex
                                ? "border-2 border-[#7b9220] rounded-xl"
                                : ""
                                }`}
                              onClick={() => setCurrentIndex(index)}
                            // style={{ height: "100%" }}
                            />
                          </div>
                        ))}
                      </div>
                      {/* Main Image Slider */}
                      <div className="relative w-full h-full flex items-center justify-center rounded-lg">
                        {selectedImages?.length > 0 ? (
                          <>
                            <button
                              onClick={handlePrev}
                              className="absolute left-1 top-1/2 transform -translate-y-1/2 p- text-white rounded-full z-10"
                            >
                              <Icon
                                icon="mynaui:chevron-left"
                                width="30"
                                height="30"
                              />
                            </button>

                            <div className="h-[500px] w-full relative overflow-hidden rounded-lg">
                              <div
                                className="relative w-full h-full"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                              >
                                <img
                                  src={selectedImages[currentIndex]}
                                  alt={`Product Image ${currentIndex + 1}`}
                                  className={`w-full h-full object-fill ${zoomPosition.isZoomed
                                    ? "scale-[2]"
                                    : "scale-[1]"
                                    } transition-transform duration-300 ease-in-out`}
                                  style={{
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                  }}
                                />

                              </div>

                              {/* Out of Stock Overlay */}
                              {(outOfStock) && (
                                <div className="backdrop-blur-sm bg-black/30 absolute top-0 w-full h-full flex items-center justify-center text-4xl text-white font-bold">
                                  Out of Stock
                                </div>
                              )}
                            </div>
                            <button
                              onClick={handleNex}
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 text-white rounded-full z-10"
                            >
                              <Icon
                                icon="mynaui:chevron-right"
                                width="30"
                                height="30"
                              />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center w-full justify-center">
                            No images available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className=" lg:w-3/5 w-full mt-4 lg:mt-0 top-0 overflow-y-auto md:h-screen no-scrollbar">
              <div className="border-b-2 border-slate-300 mb-3 ">
                <div className="flex flex-col md:flex-row md:justify-between  mb-3 w-full">
                  <div className="w-full">

                    {isLoading ? (
                      <div className="skeleton skeleton-heading w-[100%] h-[40px]"></div>
                    ) : (
                      <h1 className="text-xl lg:text-2xl leading-none">
                        {productData?.product?.name}
                      </h1>
                    )}

                  </div>
                  {productData?.product?.type === "veg" ? (
                    <div className=" text-start">
                      <img src="/assets/images/veg.png" alt="veg" className="w-12 h-5" />
                    </div>
                  ) : (
                    <></>
                  )}

                </div>
                <div className="flex gap-3 flex-wrap mb-3" >
                  {productData?.product?.variants.map((item, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-lg border ${variant?.id === item.id
                        ? "bg-[#7b9220] text-white"
                        : "bg-[#f7f7f7] text-[#1d2e36]"
                        }`}
                      onClick={() => handleVariantSelect(item)}
                    >
                      {item?.quantity} {item?.unit}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-b-2 border-slate-300 mb-3 ">
                {/* Price */}
                <div className="w-full md:w-2/5 mb-3 ">
                  <div className=" w-full  flex items-center md:justify-between gap-2">
                    {isLoading ? (
                      <div className="skeleton skeleton-price w-[80px] h-[20px]"></div>
                    ) : (
                      productPrice !== productBasePrice && (
                        <div className="flex flex-col ">
                          <div className="flex items-center text-[#a5a5a5]">
                            <span className="">MRP</span>
                            <span className="ml-2 line-through">
                              ₹ {productBasePrice || productData?.product?.variants[0]?.mrp}
                            </span>
                          </div>
                          <p className="text-[#a5a5a5] text-[12px]">(Inclusive of all taxes)</p>
                        </div>
                      )
                    )}

                    {isLoading ? (
                      <div className="skeleton skeleton-price w-[80px] h-[20px]"></div>
                    ) : (
                      <span className="text-xl text-center font-medium text-[#1d2e36]">
                        ₹
                        {productPrice ||
                          productData?.product?.variants[0]?.sellingPrice}
                      </span>
                    )}

                    {isLoading ? (
                      <div className="skelleton skeleton-price w-[80px] h-[20px]"></div>
                    ) : (
                      priceUnit && (
                        <span className="bg-[#f7f7f7] text-[12px] text-[#1d2e36] p-2">
                          {priceUnit}
                        </span>
                      )
                    )}

                    {/* Show percentage off only if productPrice is not equal to basePriceWithGST */}
                  {/* {isLoading ? (
                    <div className="skeleton skeleton-price w-[80px] h-[20px] bg-gray-300"></div>
                  ) : (

                    percentage != 0 && (
                      <span className="ml-2 text-green-600">
                        ({Math.round(percentage)}% off)
                      </span>
                    )
                  )} */}

                  </div>
                  {isLoading ? (
                    <div className="skeleton skeleton-button w-[50%] h-[100%"></div>
                  ) : (
                    <div className="flex items-center gap-2 w-[195px]">
                    {cartItem?.quantity > 0 ? (
                      <QuantityController
                        quantity={cartItem.quantity}
                        onIncrease={() =>
                          dispatch(
                            updateItemQuantity({
                              productId: cartItem.productId,
                              variantId: cartItem.variantId,
                              quantity: cartItem.quantity + 1,
                              operation: "increment",
                            })
                          )
                        }
                        onDecrease={() => {
                          if (cartItem.quantity > 1) {
                            dispatch(
                              updateItemQuantity({
                                productId: cartItem.productId,
                                variantId: cartItem.variantId,
                                quantity: cartItem.quantity - 1,
                                operation: "decrement",
                              })
                            );
                          } else {
                            dispatch(
                              removeItemFromCart({
                                productId: cartItem.productId,
                                variantId: cartItem.variantId,
                              })
                            );
                          }
                        }}
                        onRemove={() =>
                          dispatch(
                            removeItemFromCart({
                              productId: cartItem.productId,
                              variantId: cartItem.variantId,
                            })
                          )
                        }
                      />
                    ) : (
                      <AddToCartButton onAdd={handleAddtoCart} />
                    )}
                    </div>
                  )}
                </div>
              </div>
              {isLoading ? (
                <div className="skeleton skeleton-heading w-[50%] h-[100%] bg-gray-300"></div>
              ) : (
                <div className="border-b-2 border-slate-300 mb-3">
                  <div className="flex  justify-around gap-4 lg:gap-20 px-2 w-full">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`py-2 px-2 uppercase text-[16px] tracking-widest ${activeTab === "details" ? "border-b-2 border-[#7b9220] text-[#7b9220] font-semibold" : "text-[#a7a7a7]"}`}
                    >
                      Description
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`py-2 px-2 uppercase text-[16px] tracking-widest ${activeTab === "reviews" ? "border-b-2 border-[#7b9220] text-[#7b9220] font-semibold" : "text-[#a7a7a7]"}`}
                    >
                      More Info
                    </button>
                  </div>
                  <div className="mt-4">
                    {activeTab === "details" && <div>
                      <p className="mb-3 text-[14px] text-[#1d2e36]">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: productData?.product?.description,
                          }}
                        />
                      </p></div>}
                    
                    {activeTab === "reviews" && <div>
                      {productData?.product?.moreInfo &&
                        Object.entries(productData.product.moreInfo).map(([key, value], index) => (
                          <p key={index} className="mb-2 text-[14px] text-[#1d2e36]">
                            <span className="font-medium capitalize">{key}:</span> {value}
                          </p>
                        ))}
                    </div>}
                  </div>
                </div>

              )}
          </div>
          </div>
        </div>
      </div>
    </Private>
  );
}
