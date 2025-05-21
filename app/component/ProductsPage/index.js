import { useGetFilteredDataQuery } from "@/app/redux-tookit/services/productService";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import ReactSlider from "react-slider";
import "../Chat/style.scss";
import { color } from "framer-motion";

const SidebarFilters = ({
  // categories,
  priceRange,
  colors,
  onCategoryChange,
  onPriceChange,
  onBrandSelect,
  onColorSelect,
  onSizeSelect,
  dresses,
  categoryId,
  inputValue,
  setIsFilter
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSubCategoryID, setSelectedSubCategoryID] = useState(null);
  const [price, setPrice] = useState([priceRange.min, priceRange.max]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    color: true,
    size: true,
    dress: true,
  });

  const { data } = useGetFilteredDataQuery({
    categoryId: categoryId,
    subcategoryId: selectedSubCategoryID == null ? "" : selectedSubCategoryID,
    search: inputValue,
  });
  console.log(data, "filter");

  // useEffect(() => {}, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryClick = (subCategory) => {
     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', subCategory)
    setActiveCategory((prev) => (subCategory === prev ? null : subCategory));
    // onCategoryChange(subCategory);
    setIsFilter(true);
    // setSelectedSubCategoryID(subCategory);
    console.log("category", subCategory);
  };

  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
    onPriceChange(newPrice);
  };

  const handleColorClick = (color) => {
    setIsFilter(true);
    onColorSelect(color);
    console.log("color", color.name);
  };

  const handleBrandClick = (brand) => {
    setIsFilter(true);
    console.log("Selected brand:", brand);
    onBrandSelect(brand);
    setSelectedBrand(brand);
  };

  const handleSizeClick = (name) => {
    setIsFilter(true);
    console.log("Selected name:", name);
    onSizeSelect(name);
  };

  const [showMore, setShowMore] = useState(false);
  const [showMoreColor, setShowMoreColor] = useState(false);

  const subCategories = data?.data?.subCategories || [];
  const firstFourCategories = subCategories.slice(0, 4);
  const remainingCategories = subCategories.slice(4);

  return (
    <div className="relative">
      <div
        className={`bg-[#F4F4F5] text-black transition-transform duration-300 transform md:transform-none md:static md:block ${"-translate-x-full"} fixed top-0 left-0 h-full  md:relative`}
      >
        {/* <h3
          className="font-bold mb-4 text-[20px] bg-primary text-white flex justify-between p-5 rounded-[10px] uppercase items-center"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Filters
          <span>
            <Icon icon="mi:filter" color="white" width={25} height={25} />
          </span>
        </h3> */}

        {/* Categories */}
        <div className="mb-6 px-2 border-b">
          <h4 className="font-medium mb-2 flex justify-between text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
            Sub Category
          </h4>
          <ul className="space-y-2 text-lg sm:text-base md:text-lg lg:text-xl">
            {/* Display first 4 categories */}
            {firstFourCategories.map((subCategory) => (
              <li key={subCategory.id} className="cursor-pointer">
                <label
                  className={`flex items-center gap-2 rounded-[10px] p-2 font-normal  sm:text-[17px] md:text-[18px] lg:text-[18px] xl:text-[18px] ${
                    activeCategory === subCategory.name ? "bg-primary text-white" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="form-checkbox cursor-pointer h-4 w-4 hover:bg-teal-50"
                    checked={activeCategory === subCategory.name}
                    onChange={() => handleCategoryClick(subCategory)}
                  />
                  {subCategory.name}
                </label>
              </li>
            ))}

            {/* Scrollable section for remaining categories */}
            {showMore && (
              <div className="max-h-40 overflow-y-auto scrollable">
                {remainingCategories.map((subCategory) => (
                  <li key={subCategory.id} className="cursor-pointer">
                    <label
                      className={`flex items-center gap-2 rounded-[10px] p-2 font-medium text-[20px] sm:text-[17px] md:text-[18px] lg:text-[19px] xl:text-[20px] ${
                        activeCategory === subCategory.name ? "bg-primary text-white" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4"
                        checked={activeCategory === subCategory.name}
                        onChange={() => handleCategoryClick(subCategory)}
                      />
                      {subCategory.name}
                    </label>
                  </li>
                ))}
              </div>
            )}
          </ul>

          {/* Toggle button */}
          {subCategories.length > 4 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-primary mt-2 font-medium"
            >
              {showMore ? "Show Less" : `+More (${subCategories.length - 4})`}
            </button>
          )}
        </div>

        {/* Price Range */}
        {/* <div className="relative mb-4  px-2 border-b">
          <label
            htmlFor="labels-range-input"
            className="font-medium mb-2 flex justify-between cursor-pointer text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]"
          >
            Price
           
          </label>
            <>
              <ReactSlider
                className="horizontal-slider mt-4 mb-4 m-4"
                thumbClassName="thumb"
                trackClassName="track"
                value={price}
                min={priceRange.min}
                max={priceRange.max}
                step={100}
                onChange={handlePriceChange}
                withTracks={true}
                renderThumb={(props, state) => (
                  <div
                    {...props}
                    className="bg-primary w-4 h-4 rounded-full my-2 top-[-12px]"
                  ></div>
                )}
                renderTrack={(props, state) => (
                  <div
                    {...props}
                    className={`h-2 rounded-full ${
                      state.index === 1 ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                )}
              />
              <div className="flex mt-10 justify-around text-[14px] sm:text-[16px] md:text-[18px]">
                <p>{price[0]}</p>
                <p>{price[1]}</p>
              </div>
            </>
          
        </div> */}

        {/* Brands */}
        <div className="px-2 border-b">
      <h4 className="font-medium mb-2 flex justify-between cursor-pointer text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
        <span>Brands</span>
      </h4>
      <div className="grid grid-cols-3 gap-2 mt-2 p-2">
        {data?.data.brands?.map((brand) => (
          <div
            key={brand.id} // Ensure there's a unique key for each brand
            className={`w-12 h-9 border flex justify-center items-center rounded-md cursor-pointer text-[15px] sm:text-[14px] md:text-[15px] lg:text-[15px] 
              ${selectedBrand === brand.id ? 'bg-primary text-white border-white' : 'hover:bg-primary hover:text-white border-white'}
            `}
            onClick={() => handleBrandClick(brand.id)}
          >
            {brand.name}
          </div>
        ))}
      </div>
    </div>

        {/* Colors */}
        <div className="mb-6 mt-4 px-2 border-b">
          <h4
            className="font-medium mb-2 flex justify-between cursor-pointer text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]"
            
          >
            Colors
            
          </h4>
          <div className="mt-2 p-2">
            {/* First Four Colors */}
            <div className="flex flex-col space-y-2">
              {data?.data.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={`color-${index}`}
                    className="cursor-pointer w-4 h-4"
                    onChange={() => handleColorClick(color)}
                  />
                  <label
                    htmlFor={`color-${index}`}
                    className="w-4 h-4 rounded-md"
                    style={{ backgroundColor: color.hexCode }}
                  ></label>
                  <span>{color.name}</span>
                </div>
              ))}
            </div>
            {/* Additional Colors (Scrollable) */}
            {showMoreColor && (
              <div className="max-h-40 overflow-y-auto mt-2 scrollable">
                <div className="flex flex-col space-y-2">
                  {data?.data.colors.slice(4).map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`color-more-${index}`}
                        className="cursor-pointer w-4 h-4"
                        onChange={() => handleColorClick(color)}
                      />
                      <label
                        htmlFor={`color-more-${index}`}
                        className="w-4 h-4 rounded-md"
                        style={{ backgroundColor: color.hexCode }}
                      ></label>
                      <span>{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* "+more" Button */}
            {data?.data.colors.length > 4 && (
              <button
                className="text-primary mt-4"
                onClick={() => setShowMoreColor(!showMoreColor)}
              >
                {showMoreColor
                  ? "Show Less"
                  : `+More (${data?.data.colors.length - 4})`}
              </button>
            )}
          </div>
        </div>

        {/* Sizes */}
        {selectedSubCategoryID == null ? (
          ""
        ) : (
          <div className="px-2">
            <h4
              className="font-semibold mb-2 flex justify-between cursor-pointer text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]
            "
            >
              <span>Size</span>
            </h4>
            {data?.data?.productSizes && (
              <div className="grid grid-cols-3 gap-2 mt-2 p-2">
                {data?.data?.productSizes.map((size) => (
                  <div
                    key={size.id} // Ensure there's a unique key for each size
                    className="w-12 h-9 border border-white flex justify-center text-black items-center rounded-md hover:bg-primary hover:text-white cursor-pointer text-[15px] sm:text-[14px] md:text-[15px] lg:text-[15px]"
                    onClick={() => handleSizeClick(size.sizeLabel)}
                  >
                    {size.sizeLabel}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )} */}
    </div>
  );
};