"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "./styles/style.scss";
import {
  ICON_BASE_URL,
  IMAGE_BASE_URL,
  products,
  testimonials,
} from "@/app/utils/constant";
import Link from "next/link";
import CountdownTimer from "@/app/utils/reusable/useCountdown";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/grid";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Controller } from "swiper";
import {
  EffectCoverflow,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
  Autoplay,
  Grid,
  Thumbs,
  FreeMode,
} from "swiper/modules";
import {
  useGetHomeBannerQuery,
} from "@/app/redux-tookit/services/homeService";
import Private from "./layout/Private";
import Button from "./component/Button";
import SkeletonLoader from "./component/Skeleton";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { formatDateToMMDDYYYY } from "./utils/reusable/functions";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./component/ProductsPage/ProductCard";
import { Icon } from "@iconify/react";
import Marquee from "react-fast-marquee";
import { useAddtoCartMutation, useGetExploreCategoryQuery, useGetProductsTagQuery } from "./redux-tookit/services/authApi";
import { addItemToCart, removeItemFromCart, updateItemQuantity } from "./redux-tookit/cart/cartSlicer";
import QuantityController from "./utils/reusable/quantity";
import { toast } from "react-toastify";
import StarRatings from "react-star-ratings";
const HomeComponent = () => {
  const swiperRef = useRef(null);
  const swiperRef2 = useRef(null);
  const [search, setSearch] = useState("");
  const [selectedCategoryExplore, setSelectedCategoryExplore] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.accessToken);

  const pastelColors = ["#FEEFEA", "#FFF3FF", "#F2FCE4", "#FEEFEA", "#ECFFEC", "#FFFCEB", "#DEF9EC"]



  const { data: dataHomeBanner, isLoading: isLoadingHomeBanner } =
    useGetHomeBannerQuery();
  // console.log("dataHomeBanner", dataHomeBanner);

  const { data: exploreCategory, isLoading: isCategoryLoading } = useGetExploreCategoryQuery();
  // console.log("exploreCategory", exploreCategory);

  const { data: tagProducts } = useGetProductsTagQuery({ tag: "Featured" });
  // console.log("tag", tagProducts);
  const { data: tagProductss } = useGetProductsTagQuery({ tag: "Best Seller" });
  // console.log("tags", tagProductss);
  const [addtoCart, { data: cart, isSuccess, isError }] =
    useAddtoCartMutation();


  const allTagsCard = tagProducts?.data?.flatMap((card) => card.products || []) || [];

  const filteredTagsCard =
    selectedCategory === "All"
      ? allTagsCard
      : tagProducts?.data?.find((cat) => cat.categoryName === selectedCategory)?.products || [];

  const allTagsCards = tagProductss?.data?.flatMap((card) => card.products || []) || [];

  const filteredTagsCards =
    selectedTag === "All"
      ? allTagsCards
      : tagProductss?.data?.find((cat) => cat.categoryName === selectedTag)?.products || [];


  const allSubCategories =
    exploreCategory?.data?.flatMap((category) => category.subCategories || []) || [];

  const filteredSubCategories =
    selectedCategoryExplore === "All"
      ? allSubCategories
      : exploreCategory?.data?.find((cat) => cat.categoryName === selectedCategoryExplore)?.subCategories || [];



  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const router = useRouter();

  // const [controlledSwiper, setControlledSwiper] = useState(null);

  useEffect(() => {
    if (!thumbsSwiper) {
      setThumbsSwiper(null); // Initialize thumbsSwiper as null to avoid any dependency issues
    }
  }, [thumbsSwiper]);

  const handleRedirect = (url) => {
    router.push("/products");
  };

  const handleRedirectTag = (tag) => {
    if (tag) {
      router.push(`/products?tagsKeywords=${encodeURIComponent(tag)}`);
    }
  };

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);

      swiper.on("slideChange", () => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      });
    }
  }, []);

  const handleAddtoCart = async (product, variant, type) => {


    if (!variant) return toast.error("Please select a variant");

    if (token == null && type === "orderSummary") return router.push("/?login=true");

    const selectedImage = product?.images?.[0] || "";

    const dataRedux = {
      productId: product?._id,
      name: product?.name,
      variants: variant, // full variant object
      quantity: 1,
      img: selectedImage || "",
      variantId: variant._id,
    };

    const dataApi = {
      productId: product._id,
      variantId: variant._id || variant.id,
      units: 1, // update this to user-selected quantity if needed
    };
    try {
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
    }


  };
  const cartItems = useSelector((state) => state.cart?.cartItems || []);


  return (
    <Private>
      <div className="w-full md:hidden flex justify-center my-2 p-2">
        <div className="flex items-center  gap-2 relative w-full">
          <input
            type="text"
            placeholder="Search for items.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-[#F3F3F3] focus:outline-none focus:border-gray-400"
          />
          <button className="px-4 py-3 bg-[#7B9220] text-white rounded-r-lg  absolute right-0 ">
            <Icon icon="line-md:search" width="20" height="20" />
          </button>
        </div>
      </div>
      <div className="Home">
        {isLoadingHomeBanner ? (
          <SkeletonLoader itemCount={1} height={"99vh"} width="100vw" />
        ) : (
          dataHomeBanner?.banners?.length > 0 && (
            <div className="HomeBanner">
              <Swiper
                direction="vertical"
                speed={600}
                // pagination={{
                //   clickable: true,
                // }}
                // navigation={true}
                allowTouchMove={true}
                // autoplay={{
                //   delay: 3000,
                //   disableOnInteraction: false,
                // }}
                loop
                modules={[Pagination, Navigation, Autoplay]}
                className="banner_slider"
                onSwiper={(swiper) => (window.mySwiper = swiper)}
              >
                {dataHomeBanner?.banners?.map((item) => (
                  <SwiperSlide key={item._id} onClick={() => window.mySwiper?.slideNext()}>
                    <div className="banner_content">
                      {/* <Image
                        src={item.desktopImage}
                        alt={`Banner for ${item.title}`}
                        objectFit="cover"
                        layout="responsive"
                        width={1720}
                        height={100}
                      /> */}
                      <img src={item.image} alt={`Banner for ${item.title}`} className="w-full h-full object-cover" />

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )
        )}
        <div className="ExploreCategory my-4 m-2 md:m-0">
          <div className="container flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4 p-2 md:p-0" >
              <h2 className="text-[#1D2E36] text-xl md:text-3xl font-medium">Explore Categories</h2>
              <ul className="flex gap-4 md:gap-10 overflow-x-auto md:overflow-visible text-[12px] md:text-[16px]">
                <li
                  className={`cursor-pointer ${selectedCategoryExplore === "All" ? "text-[#7B9220] font-medium underline" : "text-[#1d2e36]"}`}
                  onClick={() => setSelectedCategoryExplore("All")}
                >
                  All
                </li>
                {exploreCategory?.data?.slice(0, 4).map((item, index) => (
                  <li
                    key={index}
                    onClick={() => setSelectedCategoryExplore(item.categoryName)}
                    className={` cursor-pointer ${selectedCategoryExplore === item.categoryName ? "text-[#7B9220] font-medium underline" : "text-[#1d2e36]"
                      }`}
                  >
                    {item.categoryName}
                  </li>
                ))}
              </ul>
            </div>

            {/* Swiper */}
            <div className="relative w-full mt-6">
              {filteredSubCategories.length > 6 && (
                <div className="absolute inset-y-0 -left-6 -translate-x-1/2 z-10 hidden md:flex items-center">
                  <button
                    type="button"
                    onClick={() => swiperRef2.current?.slidePrev()}
                    className="bg-[#F7F7F7] rounded-full border border-slate-300 text-slate-500 p-2 shadow"
                  >
                    <Icon icon="ic:round-arrow-back" width="25" height="25" />
                  </button>
                </div>
              )}

              <Swiper
                onSwiper={(swiper) => (swiperRef2.current = swiper)}
                slidesPerView={2}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 6 },
                }}
                spaceBetween={15}
                className="relative"
                loop={true}
              >
                {filteredSubCategories.map((item, index) => (
                  <SwiperSlide key={index} style={{ width: "155px" }}>
                    <div
                      className="w-full h-[195px] mx-auto rounded-lg overflow-hidden flex flex-col justify-center items-center"
                      style={{ backgroundColor: pastelColors[index % pastelColors.length] }}
                      onClick={() => router.push(`/products?subcategory=${item.subCategoryId}`)}
                    >
                      <div className="w-[101px] h-[101px]">
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-all ease-in-out duration-300"
                        />
                      </div>
                      <p className="text-[#1d2e36] text-base text-center mt-2">{item.name}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {filteredSubCategories.length > 6 && (
                <div className="absolute inset-y-0 -right-6 translate-x-1/2 z-10 hidden md:flex items-center">
                  <button
                    type="button"
                    onClick={() => swiperRef2.current?.slideNext()}
                    className="bg-[#f7f7f7] rounded-full border border-slate-300 text-slate-500 p-2 shadow"
                  >
                    <Icon icon="ic:round-arrow-forward" width="25" height="25" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="FeaturedProducts my-4 m-2 md:m-0 ">
          <div className="container flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
              <h2 className="text-[#1D2E36] text-xl md:text-3xl font-medium">Featured Products</h2>
              <ul className="flex gap-4 md:gap-10 overflow-auto md:overflow-visible text-[12px] md:text-[16px]">
                <li
                  className={`cursor-pointer ${selectedCategory === "All" ? "text-[#7B9220] font-medium underline" : "text-[#1d2e36]"}`}
                  onClick={() => setSelectedCategory("All")}
                >
                  All
                </li>
                {tagProducts?.data?.slice(0, 4).map((item, index) => (
                  <li
                    key={index}
                    onClick={() => setSelectedCategory(item.categoryName)}
                    className={` cursor-pointer ${selectedCategory === item.categoryName ? "text-[#7B9220] font-medium underline" : "text-[#1d2e36]"
                      }`}
                  >
                    {item.categoryName}
                  </li>
                ))}
              </ul>
            </div>

            {/* Swiper section */}
            <div className="relative w-full mt-6">
              {filteredTagsCard.lenth > 4 && (

                <div className="absolute inset-y-0 -left-6 -translate-x-1/2 z-10 hidden md:flex items-center">
                  <button
                    type="button"
                    onClick={() => swiperRef2.current?.slidePrev()}
                    className="bg-[#F7F7F7] rounded-full border border-slate-300 text-slate-500 p-2 shadow"
                  >
                    <Icon icon="ic:round-arrow-back" width="25" height="25" />
                  </button>
                </div>
              )}

              <Swiper
                onSwiper={(swiper) => (swiperRef2.current = swiper)}
                slidesPerView={2}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
                spaceBetween={15}
                className="relative"
                loop={true}
              >
                {filteredTagsCard.map((item, index) => {
                  const variant = item.variant?.[0];
                  const cartItem = cartItems.find(
                    (cartItem) =>
                      cartItem.productId === item._id && cartItem.variantId === variant?._id // Use item._id here
                  );
                  return (
                  
                  <SwiperSlide key={index} style={{ width: '228px' }}>
                    <div className="w-full  h-[315px] mx-auto rounded-lg overflow-hidden flex flex-col border">
                      <div className=" w-full md:w-[224px] h-[144px] mx-auto " onClick={() => router.push(`/products/${item._id}`)}>
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-full h-full object-contain hover:scale-110 transition-all ease-in-out duration-300"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-[#616161] text-sm"> </p>
                        <p className="text-[#1d2e36] text-[14px]  h-[50px] mt-2">{item.name} {item.variant?.[0]?.quantity} {item.variant?.[0]?.unit} </p>
                        <div className="text-yellow-500 text-lg mt-2">
                        <StarRatings
                          rating={item.rating}
                          starRatedColor="#FFD700"
                          numberOfStars={4}
                          name="rating"
                          starDimension={"16px"}
                          starSpacing={"2px"}
                          isSelectable={false}
                        />
                      </div>
                        <div className="flex justify-between gap-4 mt-4">
                          <div className="flex gap-2 items-center">
                            <p className="text-[#7b9220] text-base">₹{item.variant?.[0]?.sellingPrice}</p>
                            <p className="text-[#616161] text-base line-through">₹{item.variant?.[0]?.mrp}</p>
                          </div>
                          {cartItem?.quantity > 0 ? (
                            
                            <QuantityController
                              quantity={cartItem.quantity}
                              onIncrease={() =>
                                dispatch(
                                  updateItemQuantity({
                                    productId: cartItem.productId,
                                    variantId: cartItem.variantId,
                                    quantity: cartItem.quantity + 1,
                                    operation: 'increment',
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
                                      operation: 'decrement',
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
                          <button className="bg-[#F7F7F7] text-[#7b9220] p-2 flex items-center" onClick={() => handleAddtoCart(item, variant)}>
                            <Icon icon="bitcoin-icons:cart-outline" width="20" height="20" />
                            <p className="text-[14px]">Add</p>
                          </button>
                        )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  );
                
})}
              </Swiper>

              {/* Right Arrow */}
              {filteredTagsCard.length > 4 && (
                <div className="absolute inset-y-0 -right-6 translate-x-1/2 z-10 hidden md:flex items-center">
                  <button
                    type="button"
                    onClick={() => swiperRef2.current?.slideNext()}
                    className="bg-[#f7f7f7] rounded-full border border-slate-300 text-slate-500 p-2 shadow"
                  >
                    <Icon icon="ic:round-arrow-forward" width="25" height="25" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="my-6">
          <div className="container flex flex-col">
            <div className="w-full h-full">
              <img
                src="/assets/images/banner2.png"
                className="w-full h-full p-[23px] bg-[#f7f7f7] rounded-xl"
                alt="heading"
              />
            </div>
          </div>
        </div>
        <div className="StockClearance my-6 m-2 md:m-0">
          <div className="container flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
              <h2 className="text-[#1D2E36]  text-xl md:text-3xl font-medium">Home & Kitchen Deals</h2>
              <ul className="flex gap-4 md:gap-10 overflow-auto md:overflow-visible text-[12px] md:text-[16px]">
                <li
                  className={`cursor-pointer ${selectedTag === "All" ? "text-[#7B9220] font-medium underline" : "text-[#1d2e36]"}`}
                  onClick={() => setSelectedTag("All")}
                >
                  All
                </li>
                {tagProductss?.data?.slice(0, 4).map((item, index) => (
                  <li
                    key={index}
                    onClick={() => setSelectedTag(item.categoryName)}
                    className={` cursor-pointer ${selectedTag === item.categoryName ? "text-[#7B9220] font-medium underline" : "text-[#1d2e36]"
                      }`}
                  >
                    {item.categoryName}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative w-full my-6">
              {/* Left Arrow */}
              {filteredTagsCards.length > 4 && (
                <div className="absolute inset-y-0 -left-6 -translate-x-1/2 z-10 hidden md:flex items-center">
                  <button
                    type="button"
                    onClick={() => swiperRef2.current?.slidePrev()}
                    className="bg-[#F7F7F7] rounded-full border border-slate-300 text-slate-500 p-2 shadow"
                  >
                    <Icon icon="ic:round-arrow-back" width="25" height="25" />
                  </button>
                </div>
              )}

              <Swiper
                onSwiper={(swiper) => (swiperRef2.current = swiper)}
                slidesPerView={2}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
                spaceBetween={15}
                className="relative"
                loop={true}
              >
                {filteredTagsCards.map((item) => {
                  const variant = item.variant?.[0]; // Get the first variant
                  const cartItem = cartItems.find(
                    (cartItem) =>
                      cartItem.productId === item._id && cartItem.variantId === variant?._id // Use item._id here
                  );

                  return (
                    <SwiperSlide key={item._id} style={{ width: '265px' }}>
                      <div className="w-full  h-[420px] md:h-[380px] mx-auto rounded-lg overflow-hidden flex flex-col border">
                        <div className=" w-full md:w-[224px] h-[144px] mx-auto" onClick={() => router.push(`/products/${item._id}`)}>
                          <img
                            src={item.images?.[0]}
                            alt={item.name}
                            className="w-full h-full object-contain hover:scale-110 transition-all ease-in-out duration-300 flex justify-center items-center"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-[#1d2e36] text-base  mt-2">{item.name}</p>
                          <p className="text-[#616161] text-sm h-[40px]  ">{item.variant?.[0]?.quantity} {item.variant?.[0]?.unit}</p>
                          <div className="flex justify-between mt-4">
                            <div className="flex flex-col">
                              <div className="flex gap-2 items-center">
                                <div className="flex flex-col items-center gap-2">
                                  <p className="text-[#A5A5A5] text-[12px]">MRP</p>
                                  <p className="text-[#a5a5a5] text-[12px] line-through">₹{item.variant?.[0]?.mrp}</p>

                                </div>
                                <div className="flex flex-col items-center gap-2">
                                  <p className="text-[#1D2E36] text-[12px]">Vriddhee</p>
                                  <p className="text-[#1d2e36] text-[14px] font-normal">₹{item.variant?.[0]?.sellingPrice}</p>
                                </div>
                              </div>
                              <p className="text-[#A5A5A5] text-[12px] mt-2 italic">(Inclusive of all taxes)</p>
                            </div>
                            <div className="bg-[#00FF3B] bg-opacity-[10%] text-[#7b9220] p-2 flex flex-col items-center rounded-lg w-[65px] h-[50px]">
                              <p className=" text-[16px]">₹ {item.variant?.[0]?.mrp - item.variant?.[0]?.sellingPrice}</p>
                              <p className=" text-[12px]">Off</p>
                            </div>
                          </div>
                          {cartItem?.quantity > 0 ? (
                            <QuantityController
                              quantity={cartItem.quantity}
                              onIncrease={() =>
                                dispatch(
                                  updateItemQuantity({
                                    productId: cartItem.productId,
                                    variantId: cartItem.variantId,
                                    quantity: cartItem.quantity + 1,
                                    operation: 'increment',
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
                                      operation: 'decrement',
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
                            <button
                              className="bg-[#7b9220] text-white text-sm p-2 rounded-lg mt-4 flex justify-center items-center gap-2 w-full"
                              onClick={() => handleAddtoCart(item, variant)}
                            >
                              <Icon icon="bitcoin-icons:cart-outline" width="20" height="20" />
                              <p>Add to Cart</p>
                            </button>
                          )}
                        </div>
                      </div>

                    </SwiperSlide>
                  );
                })}

              </Swiper>

              {/* Right Arrow */}
              {filteredTagsCards.length > 4 && (
                <div className="absolute inset-y-0 -right-6 translate-x-1/2 z-10 hidden md:flex items-center">
                  <button
                    type="button"
                    onClick={() => swiperRef2.current?.slideNext()}
                    className="bg-[#f7f7f7] rounded-full border border-slate-300 text-slate-500 p-2 shadow"
                  >
                    <Icon icon="ic:round-arrow-forward" width="25" height="25" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Private>
  );
};

export default HomeComponent;
