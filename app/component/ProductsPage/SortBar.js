import { Icon } from "@iconify/react";
import Link from "next/link";
import SidebarFilters from "../ProductsPage/SiderbarFilter";

const categories = ["Tops", "Printed T-shirts", "Kurti", "Boxers", "Jeans", "Saree", "Dress", "Sweater", "Jackets"];
const priceRange = { min: 1000, max: 5000 };
const colors = ["purple", "black", "red", "orange", "yellow", "green", "blue", "indigo", "violet", "cyan", "pink", "gray"];
const dresses = ["Classic", "Casual", "party", "Semi-formal", "Formal", "Sports", "Elegant"];

const handleSortChange = (e) => setSortOption(e.target.value);
const handleCategoryChange = (category) => {
  // Filter products by category
};
const handlePriceChange = (e) => {
  // Filter products by price
};
const handleColorSelect = (color) => {
  // Filter products by color
};

const SortBar = ({backLink, totalResults, sortOption, onSortChange }) => {
  return (
    <div className="flex  justify-between items-center mb-4 p-2">
      {/* Back Icon */}
      <div className="flex items-center gap-4">
        <Link href={backLink}>
        <Icon icon="material-symbols:arrow-back" /> </Link>
        <span className="md:hidden">Shopping </span>
      </div>

      {/* Total Results */}
      <p className="hidden md:block text-sm md:text-base text-gray-700">{`1-48 of over ${totalResults} results`}</p>
      {/* Try On Button and Sort By */}

      <div className="flex items-center gap-4">
        {/* Sidebar Filters */}
        <div className=" md:hidden">
          <SidebarFilters
            categories={categories}
            priceRange={priceRange}
            colors={colors}
            dresses={dresses}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onColorSelect={handleColorSelect}

          />
        </div>

        {/* Try on Virtual Button */}
        <button className="hidden md:flex bg-orange-500 text-white py-2 px-8 lg:px-10  rounded-md relative group transition-all duration-300">
          <span className="group-hover:hidden">Try on Virtual</span>
          <span className="hidden group-hover:inline">Change Looks</span>
          <span className="bg-secondary rounded-full w-11 h-11 border flex items-center justify-center absolute -right-3 -top-1 group-hover:-left-3 transition-all duration-1000">
            <Icon icon="solar:hanger-line-duotone" color="white" width="25" />
          </span>
        </button>

        {/* Sort By Dropdown */}
        <div className="flex items-center p-2 border text-sm md:text-base rounded-md bg-secondary text-white">
          <span className="mr-2 hidden md:block">Sort By:</span>
          <select
            value={sortOption}
            onChange={onSortChange}
            className="bg-secondary border-none text-white focus:outline-none"
          >
            <option value="lowToHigh">Price Low To High</option>
            <option value="highToLow">Price High To Low</option>
          </select>
        </div>
      </div>
    </div>
  );


};

export default SortBar;