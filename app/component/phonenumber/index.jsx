import React from "react";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.css";

const PhoneNumberInput = ({
  name = "phone",
  label = "Phone Number",
  control,
  errors,
  country = "in",
  validationRules = {},
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: "Phone number is required.",
          validate: (value) => {
            const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
            const countryCodeLength = country === "in" ? 2 : 0; // Adjust based on country
            const phoneNumberLength = numericValue.length - countryCodeLength;

            if (phoneNumberLength < 10) {
              return "Enter a valid phone number with at least 10 digits.";
            }
            return true;
          },
          ...validationRules,
        }}
        
        render={({ field }) => (
          <>
            <PhoneInput
              {...field}
              country={country}
              inputProps={{
                name: name,
                required: true,
              }}
              className="react-phone-input mt-1 rounded-sm"
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default PhoneNumberInput;
