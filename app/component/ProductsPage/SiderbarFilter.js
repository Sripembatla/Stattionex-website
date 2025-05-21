import { useGetFilteredDataQuery } from "@/app/redux-tookit/services/productService";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import ReactSlider from "react-slider";
// import "../Chat/style.scss";
import "./style.scss";
import { useRouter } from "next/navigation";

const SidebarFilters = ({
  priceRange,
  categoryName,
  colors,
  onCategoryChange,
  onPriceChange,
  onBrandSelect,
  onColorSelect,
  onSizeSelect,
  dresses,
  categoryId,
  inputValue,
  setSidebarSubCategory,
  setSidebarTernary,
  sidebarSubCategory,
  sidebarTernary,
}) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    subCategory: true,
    ternaryCategory: true,
    brand: true,
  });

  const toggleSection = (sectionId) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
  };

  const [expandedSections, setExpandedSections] = useState({
    subCategory: false,
    brand: false,
  });

  const toggleShowAll = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getDisplayedItems = (section) => {
    const sectionData = {
      category: category,
      subCategory: subCategories,
      ternaryCategory: ternaryCategories,
      brand: brands,
    };
    return expandedSections[section]
      ? sectionData[section]
      : sectionData[section].slice(0, 6);
  };

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [categorySelectedID, setCategorySelectedID] = useState('');
  const [selectedSubCategoryID, setSelectedSubCategoryID] = useState([]);
  const [selectedTernaryID, setSelectedTernaryID] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setCategorySelectedID(categoryId)
    setSelectedSubCategoryID(sidebarSubCategory);
    setSelectedTernaryID(sidebarTernary);
  }, [categoryId, sidebarSubCategory, sidebarTernary]);

  const { data, isLoading } = useGetFilteredDataQuery();
  // console.log("data sidebar", data);
  
  useEffect(() => {
    categoryName(data?.data?.categories?.name);
  }, [data]);

  const category = data?.data?.categories || [];
  const subCategories = category.flatMap((category) => category.subCategories || []);
  const ternaryCategories = subCategories.flatMap((subCategory) => subCategory.thirdCategories || []);
  const brands = data?.data?.brands || [];
  const types = data?.data?.types || [];

  // console.log("subCategories", subCategories);
  // console.log("ternaryCategories", ternaryCategories);
  
  
const toggleSelection = (id, setSelected) => {
    setSelected((prev) => {
      if (!Array.isArray(prev)) return [id];
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

 const handleCategory = (category) => {
  const isSelected = categorySelectedID === category._id;

  if (isSelected) {
    setCategorySelectedID(null);
    setSelectedSubcategories([]);
    onCategoryChange(null); // clear selection
  } else {
    setCategorySelectedID(category._id);
    setSelectedSubcategories(category?.subCategories || []);
    onCategoryChange(category._id);
  }
};

   const handleSubCategory = (subCategory) => {
    toggleSelection(subCategory._id, setSidebarSubCategory);
    toggleSelection(subCategory._id, setSelectedSubCategoryID);
  };
  
  const handleTernaryCategory = (ternary) => {
    toggleSelection(ternary._id, setSidebarTernary);
    toggleSelection(ternary._id, setSelectedTernaryID);
  };
  
  const handleBrandClick = (brand) => {
    setSelectedBrand((prevSelectedBrands) => {
      const brandIndex = prevSelectedBrands?.indexOf(brand);

      if (brandIndex === -1) {
        return [...prevSelectedBrands, brand];
      } else {
        return prevSelectedBrands.filter((b) => b !== brand);
      }
    });

    onBrandSelect((prevSelectedBrands) => {
      const brandIndex = prevSelectedBrands?.indexOf(brand);

      if (brandIndex === -1) {
        return [...prevSelectedBrands, brand];
      } else {
        return prevSelectedBrands.filter((b) => b !== brand);
      }
    });
  };
  const clearFilters = () => {
    setActiveCategory(null);
    setSelectedBrand([]);
    setSelectedSubCategoryID(null);
    onBrandSelect(null);
    onCategoryChange(null);
    setSidebarSubCategory(null);
    setSidebarTernary(null);
    setSelectedSubCategoryID(null);
    setSelectedTernaryID(null);
    setCategorySelectedID(null);
    router.push("/products");

  };

  return (
    <div className="relative">
      <button
        className="p-2 bg-primary rounded-lg text-white z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Icon
          icon={isOpen ? "mi:close" : "mi:filter"}
          color="white"
          width={20}
          height={20}
        />
      </button>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div
          className={`text-black transition-transform duration-300 transform md:transform-none md:static md:block ${isOpen ? "translate-x-0" : "-translate-x-full"
            } fixed top-[90px] md:top-0 left-0 h-[80vh] md:h-full md:relative bg-white w-72 z-40 md:z-0 shadow-lg overflow-y-auto no-scrollbar p-4`}
        >
          <div className="p-2 border-b">
            <div className="flex justify-between items-start mb-6">
              <h4 className="font-medium flex justify-between text-[16px] text-[#141842] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
                Filters
              </h4>
              <div className="mb-4">
                <button
                  className="border border-[#E4E4E4] shadow-sm py-2 px-4 rounded-full w-full text-[#726C6C] text-[14px] flex items-center"
                  onClick={clearFilters}
                >
                  <Icon icon="lsicon:close-small-filled" width="20" height="20" />{" "}
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <div className="border border-[#F3F3F3] rounded-[7px] px-[10px] py-[17px]">
            {category.length > 0 && (
              <div className="border-b mb-5 border-[#DDDDDD]">
                <div className="flex justify-between cursor-pointer items-center">
                  <h4 className="font-medium mt-1 mb-2 flex justify-between text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
                    Category
                  </h4>
                  <Icon
                    icon={
                      openSections["category"]
                        ? "icon-park-outline:up"
                        : "icon-park-outline:down"
                    }
                    width="22"
                    height="22"
                    color="black"
                  />
                </div>
                {openSections["category"] && (
                  <ul
                    className="text-lg sm:text-base md:text-lg lg:text-xl custom-scrollbar w-[97%] no-scrollbar"
                    style={{
                      maxHeight: expandedSections["category"] ? "none" : "220px",
                      overflowY: expandedSections["category"] ? "unset" : "scroll",
                    }}
                  >
                    {getDisplayedItems("category").map((category) => (
                      <li
                        key={category._id}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          className={`custom-checkbox cursor-pointer h-4 w-4 border-5 border-[#6A7A99]`}
                          checked={categorySelectedID === category._id}
                          onChange={() => handleCategory(category)}
                          style={{
                            border: "2px solid #023047",
                            backgroundColor:
                              categorySelectedID === category._id
                                ? "#023047"
                                : "transparent",
                          }}
                        />
                        <label className="flex items-center gap-2 p-1 font-normal text-[14px] text-[#141842]">
                          {category.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {subCategories.length > 0 && (
              <div className="border-b mb-5 border-[#DDDDDD]">
                <div
                  className="flex justify-between cursor-pointer items-center"
                  onClick={() => toggleSection("subCategory")}
                >
                  <h4 className="font-medium mt-1 mb-2 flex justify-between text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
                    Sub Category
                  </h4>
                  <Icon
                    icon={
                      openSections["subCategory"]
                        ? "icon-park-outline:up"
                        : "icon-park-outline:down"
                    }
                    width="22"
                    height="22"
                    color="black"
                  />
                </div>
                {openSections["subCategory"] && (
                  <ul
                    className="text-lg sm:text-base md:text-lg lg:text-xl custom-scrollbar w-[97%] no-scrollbar"
                    style={{
                      maxHeight: expandedSections["subCategory"] ? "none" : "220px",
                      overflowY: expandedSections["subCategory"] ? "unset" : "scroll",
                    }}
                  >
                    {getDisplayedItems("subCategory").map((subCategory) => (
                      <li
                        key={subCategory._id}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          className={`custom-checkbox cursor-pointer h-4 w-4 border-5 border-[#6A7A99]`}
                          // checked={selectedSubCategoryID === subCategory.id}
                          checked={selectedSubCategoryID?.includes(subCategory._id)}
                          onChange={() => handleSubCategory(subCategory)}
                          style={{
                            border: "2px solid #023047",
                            backgroundColor:
                              selectedSubCategoryID?.includes(subCategory._id)
                                ? "#023047"
                                : "transparent",
                          }}
                        />
                        <label className="flex items-center gap-2 p-1 font-normal text-[14px] text-[#141842]">
                          {subCategory.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                {openSections["subCategory"] && subCategories.length > 6 && (
                  <button
                    className="text-[#F3B960] border-b border-[#F3B960] mt-2 text-[14px] mb-7"
                    onClick={() => toggleShowAll("subCategory")}
                  >
                    {expandedSections["subCategory"] ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            )}

            {selectedSubCategoryID && ternaryCategories.length > 0 && (
              <div className="border-b mb-5 border-[#DDDDDD]">
                <div
                  className="flex justify-between cursor-pointer items-center"
                  onClick={() => toggleSection("ternaryCategory")}
                >
                  <h4 className="font-medium mt-1 mb-2 flex justify-between text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
                    Ternary Category
                  </h4>
                  <Icon
                    icon={
                      openSections["ternaryCategory"]
                        ? "icon-park-outline:up"
                        : "icon-park-outline:down"
                    }
                    width="22"
                    height="22"
                    color="black"
                  />
                </div>
                {openSections["ternaryCategory"] && (
                  <ul
                    className="text-lg sm:text-base md:text-lg lg:text-xl custom-scrollbar w-[97%] no-scrollbar"
                    style={{
                      maxHeight: expandedSections["ternaryCategory"] ? "none" : "220px",
                      overflowY: expandedSections["ternaryCategory"] ? "unset" : "scroll",
                    }}
                  >
                    {getDisplayedItems("ternaryCategory").map((ternary) => (
                      <li
                        key={ternary._id}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          className={`custom-checkbox cursor-pointer h-4 w-4 border-5 border-[#6A7A99]`}
                          checked={selectedTernaryID?.includes(ternary._id)}
                          onChange={() => handleTernaryCategory(ternary)}
                          style={{
                            border: "2px solid #023047",
                            backgroundColor:
                              selectedTernaryID?.includes(ternary._id)
                                ? "#023047"
                                : "transparent",
                          }}
                        />
                        <label className="flex items-center gap-2 p-1 font-normal text-[14px] text-[#141842]">
                          {ternary.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                {openSections["ternaryCategory"] && ternaryCategories.length > 6 && (
                  <button
                    className="text-[#F3B960] border-b border-[#F3B960] mt-2 text-[14px] mb-7"
                    onClick={() => toggleShowAll("ternaryCategory")}
                  >
                    {expandedSections["ternaryCategory"] ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            )}

            {brands.length > 0 && (
              <div className="border-b mb-5 border-[#DDDDDD]">
                <div
                  className="flex justify-between cursor-pointer items-center"
                  onClick={() => toggleSection("brand")}
                >
                  <h4 className="font-medium mt-1 mb-2 flex justify-between text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
                    Brands
                  </h4>
                  <Icon
                    icon={
                      openSections["brand"]
                        ? "icon-park-outline:up"
                        : "icon-park-outline:down"
                    }
                    width="22"
                    height="22"
                    color="black"
                  />
                </div>
                {openSections["brand"] && (
                  <ul
                    className="text-lg sm:text-base md:text-lg lg:text-xl custom-scrollbar w-[97%] no-scrollbar"
                    style={{
                      maxHeight: expandedSections["brand"] ? "none" : "220px",
                      overflowY: expandedSections["brand"] ? "unset" : "scroll",
                    }}
                  >
                    {getDisplayedItems("brand").map((brand) => (
                      <li
                        key={brand._id}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          className="custom-checkbox cursor-pointer h-4 w-4 border-5 border-[#6A7A99]"
                          checked={selectedBrand.includes(brand._id)}
                          onChange={() => handleBrandClick(brand._id)}
                          style={{
                            border: "2px solid #023047",
                            backgroundColor: selectedBrand.includes(brand._id)
                              ? "#023047"
                              : "transparent",
                          }}
                        />
                        <label className="flex items-center gap-2 p-1 font-normal text-[14px] text-[#141842]">
                          {brand.brandName}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                {openSections["brand"] && brands.length > 6 && (
                  <button
                    className="text-[#F3B960] border-b border-[#F3B960] mt-2 text-[14px] mb-7"
                    onClick={() => toggleShowAll("brand")}
                  >
                    {expandedSections["brand"] ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default SidebarFilters;