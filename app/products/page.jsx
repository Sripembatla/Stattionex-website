"use client";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import ProductCard from "../component/ProductsPage/ProductCard";
import Private from "../layout/Private";
import { useGetProductsQuery } from "../redux-tookit/services/productService";
import "./style.scss";
import SkeletonLoader from "../component/Skeleton";
import SidebarFilters from "../component/ProductsPage/SiderbarFilter";


export default function Products() {
  
  const [sortOption, setSortOption] = useState("lowToHigh");
 
  const [currentPage, setCurrentPage] = useState(1);
 
  const productsPerPage = 12;
  const [categoryId, setCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [size, setSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchData, setSearchData] = useState("");
  const [sidebarSubCategory, setSidebarSubCategory] = useState([]);
  const [sidebarTernary, setSidebarTernary] = useState([]);
  const [brand, setBrand] = useState("");

  const [paramsData, setParamsData] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const subcategory = urlParams.get("subcategory");
    const thirdlevel = urlParams.get("thirdlevel");
    const searchData = urlParams.get("search");
    // console.log("category", category, subcategory, thirdlevel);

    setCategory(category);
    setSelectedCategory(category);
    setParamsData({
      categoryId: category,
      subcategoryId: subcategory,
      third_level: thirdlevel,
    });
    setSearchData(searchData);
    if (subcategory) {
      setSidebarSubCategory(subcategory);
    }
    if (thirdlevel) {
      setSidebarTernary(thirdlevel);
    }
  }, [searchParams]);
  const shouldFetch = !!(
    selectedCategory ||
    selectedColor ||
    searchData ||
    brand ||
    size ||
    paramsData?.categoryId ||
    paramsData?.third_level ||
    paramsData?.subcategoryId ||
    sidebarSubCategory ||
    sidebarTernary
  );

  const payload = {
    color: selectedColor,
    search: searchData,
    brand: brand,
    size: size,
    category: selectedCategory || paramsData?.categoryId,
    // subcategory: paramsData?.subcategoryId,
    subcategory: sidebarSubCategory || paramsData?.subcategoryId,

    thirdcategory: sidebarTernary || paramsData?.third_level,
  };
  console.log("payload", payload);

  const filteredPayload = Object.entries(payload).reduce(
    (acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  const { data, error, isLoading } = useGetProductsQuery(filteredPayload, {
    skip: !shouldFetch,
  });
  console.log("data", data);
  const sortedProducts = [...(data?.products || [])].sort((a, b) => {
    if (sortOption === "lowToHigh") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  // Pagination logic
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
 

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const handleCategoryName = (name) => {
    console.log("Selected name:", name);
    setSelectedCategoryName(name)
  };
  const handleColorSelect = (color) => {
    console.log('colorcolorcolor', color)
    setSelectedColor(color);
  };
  
  return (
    <Private>
      <div className="bg-[#FFFFFF] min-h-screen relative container mx-auto ">
        
        {isLoading ? (
          <div className="skeleton w-[100%] h-80"></div>
        ) : (
          <div className="w-full h-full  ">
          <img
            src="/assets/images/banner.png"
            className="w-full h-full p-[23px] bg-[#f7f7f7] rounded-xl"
            alt="heading"
          />
        </div>
        )}

        <div
          className="product_details flex  flex-row-reverse flex-wrap md:flex-row md:flex-nowrap  mb-5"
          style={{ marginTop: "2em" }}
        >
          <div className=" md:block lg:w-[22em] mr-4">
            {/* <div className="Sidebar no-scrollbar"> */}
            {isLoading ? (
              <div className="skeleton w-[100%] h-4/5"></div>
            ) : (
              <div className="">
              <SidebarFilters
                // priceRange={priceRange}
                categoryName={handleCategoryName}
                // colors={colors}
                // dresses={dresses}
                onCategoryChange={setSelectedCategory}
                onPriceChange={() => {}}
                onBrandSelect={setBrand}
                onColorSelect={handleColorSelect}
                onSizeSelect={setSize}
                // onSizeSelect={setSize}
                categoryId={categoryId}
                setSidebarSubCategory={setSidebarSubCategory}
                setSidebarTernary={setSidebarTernary}
                sidebarSubCategory={sidebarSubCategory}
                sidebarTernary={sidebarTernary}
              />
            </div>
            )
            }
          </div>
          <div className="container m-0 px-1 mt-0 mb-4" style={{ marginTop: "0px" }}>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-4 mx-auto">
              {isLoading
                ? Array.from({ length: 20 }, (_, index) => (
                    <div key={index}>
                      <SkeletonLoader
                        itemCount={1}
                        height={"50vh"}
                        width="200%"
                      />
                      <SkeletonLoader
                        itemCount={1}
                        height={"50%"}
                        width="100%"
                      />
                      <SkeletonLoader
                        itemCount={1}
                        height={"50%"}
                        width="180%"
                      />
                    </div>
                  ))
                : paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      
                    />
                  ))}
            </div>

            {!isLoading && paginatedProducts.length === 0 && (
              <div className="w-full h-[90vh] flex justify-center items-center">
                <span className="text-2xl font-bold">No products found</span>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-end mt-8 mb-8">
                {/* Previous Button */}
                <button
                  className={`px-2 py-2 mx-1 ${
                    currentPage === 1
                      ? "bg-gray-200  text-gray-500 cursor-not-allowed"
                      : "bg-[#7b9220]  text-white"
                  }`}
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                >
                  <Icon
                    icon="solar:alt-arrow-left-outline"
                    color="white"
                    width="24"
                    height="24"
                  />
                </button>

                {/* Page Number Buttons */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 mx-1 rounded-md ${
                      currentPage === index + 1
                        ? "bg-[#7b9220] text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  className={`px-2 py-2 mx-1  ${
                    currentPage === totalPages
                      ? "bg-gray-200  text-gray-500 cursor-not-allowed"
                      : "bg-[#7b9220]  text-white"
                  }`}
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                >
                  <Icon
                    icon="solar:alt-arrow-right-outline"
                    color="white"
                    width="24"
                    height="24"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </Private> 
  );
}
