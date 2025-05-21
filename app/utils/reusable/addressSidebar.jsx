"use client";

import SelectInput from "@/app/component/SelectInput";

const AddressSidebar = ({
    mode,
    title,
    onClose,
    onSubmit,
    register,
    errors,
    postalData,
    fetchPostalDetails,
    countries,
    addressType,
  }) => (
    <div className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-white shadow-lg p-4 z-50 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#1d2e36]">{title}</h2>
        <div className="w-5 h-5 text-[#1d2e36] cursor-pointer" onClick={onClose}>
          ✕
        </div>
      </div>
      <form onSubmit={onSubmit}>
        {/* Contact Info */}
        <div className="flex flex-col p-2 mb-4">
          <h2 className="text-[#1d2e36] text-[14px] capitalize mb-4">Contact info</h2>
          <div className="flex flex-col items-center gap-2 w-full">
            <input type="text" required {...register("name")} className="w-full px-4 py-4 rounded-xl border text-[#1d2e36] text-[12px]" placeholder="Full Name" maxLength={30} />
            <input type="text" required {...register("phone")} className="w-full px-4 py-4 rounded-xl border text-[#1d2e36] text-[12px]" placeholder="Phone" maxLength={10} pattern="[0-9]*" />
          </div>
        </div>
  
        {/* Shipping Address */}
        <div className="flex flex-col p-2 mb-4">
          <h2 className="text-[#1d2e36] text-[14px] capitalize mb-4">Shipping address</h2>
          <div className="flex flex-col items-center gap-3">
            <input type="text" required {...register("address")} className="w-full px-4 py-4 rounded-xl border text-[#1d2e36] text-[12px]" placeholder="Address" />
            <input type="text" required {...register("landmark")} className="w-full px-4 py-4 rounded-xl border text-[#1d2e36] text-[12px]" placeholder="Landmark" />
  
            <div className="flex justify-between w-full">
              <SelectInput
                label="Select an Option"
                name="addressType"
                options={addressType}
                register={register}
                errors={errors}
                rules={{ required: "This field is required" }}
              />
              <SelectInput
                label="Country"
                name="country"
                options={[{ value: "", label: "Select a Country", disabled: true }, ...countries.map(c => ({ label: c.name }))]}
                register={register}
                errors={errors}
                rules={{ required: "This Country is required." }}
              />
            </div>
  
            <input type="text" required value={postalData.state} {...register("state")} className="w-full px-4 py-4 rounded-xl border text-[#1d2e36] text-[12px]" placeholder="State / Region" />
            <div className="flex gap-2 w-full mb-2">
              <input type="text" required value={postalData.city} {...register("city")} className="w-full px-4 py-4 rounded-xl border text-[#1d2e36] text-[12px]" placeholder="City" />
              <input
                type="text"
                {...register("postalCode", { required: true })}
                maxLength={6}
                pattern="\d{6}"
                onChange={(e) => fetchPostalDetails(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border text-[#1d2e36] text-[12px]"
                placeholder="PinCode"
              />
            </div>
          </div>
          <button type="submit" className="bg-[#7b9220] text-white px-4 py-2 rounded-xl w-full my-4">
            {mode === "edit" ? "Continue and Edit Address" : "Add New Address"}
          </button>
        </div>
      </form>
    </div>
  );
  
  export default AddressSidebar;  