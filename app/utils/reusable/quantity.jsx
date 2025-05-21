// components/QuantityController.jsx
"use client";
import { Icon } from "@iconify/react";

const QuantityController = ({
  quantity,
  onIncrease,
  onDecrease,
  onRemove
}) => {
  return (
    <div className="flex items-center my-2 overflow-hidden rounded-lg w-full">
      <button
        onClick={onDecrease}
        className="bg-[#849b1f] p-2 flex items-center justify-center w-[20%]"
      >
        <Icon
          icon={quantity === 1 ? "mdi:trash-can-outline" : "octicon:diff-removed-24"}
          color="white"
          width={18}
        />
      </button>

      <div className="bg-white text-[#1d2e36] h-full  flex items-center justify-center font-medium  w-[20%]">
        {quantity}
      </div>

      <button
        onClick={onIncrease}
        className="bg-[#849b1f] p-2 flex items-center justify-center w-[20%] "
      >
        <Icon icon="material-symbols:add-box-outline" color="white" width={18} />
      </button>

      <button
        onClick={onRemove}
        className="bg-[#849b1f] border-l p-2 flex items-center justify-center w-[40%]"
      >
        <Icon icon="ic:round-close" color="white" width={18} />
      </button>
    </div>
  );
};

export default QuantityController;
