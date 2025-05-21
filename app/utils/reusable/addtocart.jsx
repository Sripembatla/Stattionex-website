"use client";
import { Icon } from "@iconify/react";

const AddToCartButton = ({ onAdd }) => {
  return (
    <button
      onClick={onAdd}
      className="bg-[#1d2e36] text-white  px-4 p-2 flex items-center justify-center gap-2 rounded-lg w-full my-2"
    >
      <Icon icon="material-symbols:shopping-cart" width={20} height={20} />
      Add to Cart
    </button>
  );
};

export default AddToCartButton;