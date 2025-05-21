"use client";
import React, { useEffect, useState } from "react";
import Private from "../layout/Private";
import { useGetSubCategoryQuery } from "../redux-tookit/services/authApi";
import { useRouter } from "next/navigation";

export default function BrowseCategory() {
  const { data, isSuccess } = useGetSubCategoryQuery();
  const [activeCategory, setActiveCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && data?.data?.length > 0) {
      const firstCategory = data.data[0];
      setActiveCategory(firstCategory);
      setSubcategories(firstCategory.subCategories || []);
    }
  }, [data, isSuccess]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSubcategories(category.subCategories || []);
  };

  const pastelColors = ["#FEEFEA" , "#FFF3FF", "#F2FCE4", "#FEEFEA",  "#ECFFEC", "#FFFCEB", "#DEF9EC" ]

  return (
    <Private>
      <div className="flex flex-col md:flex-row min-h-screen container mx-auto">
        {/* Sidebar */}
        <aside className="w-full md:w-1/5 bg-white border-r p-4">
          {data?.data?.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => handleCategoryClick(cat)}
              className={`w-full text-left px-4 py-4 mb-2 rounded-xl transition 
                ${
                  activeCategory?.categoryId === cat.categoryId
                    ? "bg-gray-100 border border-gray-300 shadow h-[140px]"
                    : "bg-gray-100 hover:bg-gray-200 text-[#616161]"
                }`}
            >
              {activeCategory?.categoryId === cat.categoryId && cat.icon ? (
                <div className="flex items-center gap-2">
                  <img
                    src={cat.icon}
                    alt={cat.categoryName}
                    className="w-16 h-16 md:w-24 md:h-24 object-contain"
                  />
                  <span className="font-medium text-[#1d2e36]">{cat.categoryName}</span>
                </div>
              ) : (
                <span>{cat.categoryName}</span>
              )}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {subcategories.length > 0 ? (
            subcategories.map((item, index) => (
              <div
                key={item.subCategoryId}
                className="rounded-lg p-4 text-center flex flex-col justify-center items-center shadow w-[165px] h-[192px]"
                style={{ backgroundColor: pastelColors[index % pastelColors.length] }}
                onClick={() => router.push(`/products?subcategory=${item.subCategoryId}`) }
              >
                <img
                  src={item.icon || "./assets/images/image1.png"}
                  alt={item.name}
                  className="w-24 h-24 mx-auto mb-2"
                />
                <p className="font-medium text-sm md:text-base text-[#1d2e36]">{item.name}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full justify-center text-center text-gray-500">
              No subcategories available for &quot;{activeCategory?.categoryName}&quot;
            </p>
          )}
        </main>
      </div>
    </Private>
  );
}
