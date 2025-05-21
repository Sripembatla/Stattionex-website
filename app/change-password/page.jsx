"use client";
import Image from "next/image";
import "./style.scss";
import TextInput from "../component/TextInput";
import { IMAGE_BASE_URL } from "../utils/constant";
import { useForm } from "react-hook-form";
import Button from "../component/Button";
import { useChangePasswordMutation } from "../redux-tookit/services/authApi";
import Private from "../layout/Private";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ChangePassword() {
    const { register, formState: { errors }, handleSubmit, reset, watch } = useForm();
    const [ChangePassword, { isLoading }] = useChangePasswordMutation();

    // Watch newPassword and confirmPassword for validation
    const newPassword = watch("password");
    const confirmPassword = watch("confirmPassword");
    const router = useRouter();

    const onChangePassword = async (value) => {
        const lastOldPassword = localStorage.getItem("lastOldPassword");
        if (value.password !== value.confirmPassword) {
            // toast.error("New Password and Confirm New Password do not match.");
            alert("New Password and Confirm New Password do not match.");
            return;
        }
        if (value.oldPassword === value.password) {
            // toast.error("Old Password and New Password cannot be same.");
            alert("Old Password and New Password cannot be same.");
            return;
        }
        if(value.oldPassword === lastOldPassword){
            alert("You cannot reuse your old password. Use Updated Password to change your password.");
            return;
        }
        
        

        try {
            console.log("Payload to be sent:", value); // Verify payload
            const result = await ChangePassword(value).unwrap();
            console.log("API Response:", result);
            if (result?.success) {
                // toast.success(result?.message || "Password changed successfully!");
                alert( result?.message || "Password changed successfully!");
                reset(); // Reset the form on success
                localStorage.setItem("lastOldPassword", value.oldPassword);
            }
        } catch (error) {
            const errorMessage = error?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
            console.error("API Error:", error);
        }
    };

    return (
        <Private>
            <div className='relative flex gap-4'>
                <button
                    className="absolute top-8 -left-0 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 rounded-full pr-6 p-4  text-white flex group transition-all duration-300 ease-in-out"
                    onClick={() => {
                        const prevPath = localStorage.getItem("prevPath");
                        if (prevPath === "/auth") {
                            router.push("/");
                        } else {
                            router.back();
                        }
                    }}
                >
                    <Icon
                        icon="material-symbols:arrow-back"
                        width={20}
                        className="ml-8 transform transition-transform duration-300 group-hover:-translate-x-2"
                    />
                </button>

                <h1 className='text-2xl font-bold ml-20 mt-4'>Change Password</h1>


            </div>
            <div className="ChangePassword">
                <Image
                    src={`${IMAGE_BASE_URL}change-pass.png`}
                    width={400}
                    height={400}
                    alt="Login Banner"
                    className="rounded-l-2xl"
                />
                <div className="formBx">
                    <form onSubmit={handleSubmit(onChangePassword)}>
                        <TextInput
                            name="oldPassword"
                            type="password"
                            label="Current Password"
                            placeholder="Current Password"
                            register={register}
                            errors={errors}
                            rules={{
                                required: "Current Password is required.",
                                maxLength: {
                                    value: 30,
                                    message: "Current Password must not exceed 30 characters.",
                                },
                            }}
                            className="input-gray"
                        />
                        <TextInput
                            name="password"
                            type="password"
                            label="New Password"
                            placeholder="New Password"
                            register={register}
                            errors={errors}
                            rules={{
                                required: "Password is required.",
                                minLength: {
                                  value: 8,
                                  message: "Password must be at least 8 characters long.",
                                },
                                maxLength: {
                                  value: 30,
                                  message: "Password must not exceed 30 characters.",
                                },
                                pattern: {
                                  value: /^(?!.*\s)(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/,
                                  message: "Password must include at least one uppercase letter, one letter, one number, and one special character, and no spaces.",
                                },
                              }}
                        />
                        <TextInput
                            name="confirmPassword"
                            type="password"
                            label="Confirm New Password"
                            placeholder="Confirm New Password"
                            register={register}
                            errors={errors}
                            rules={{
                                required: "Confirm new Password is required.",
                                minLength: {
                                  value: 8,
                                  message: "Password must be at least 8 characters long.",
                                },
                                maxLength: {
                                  value: 30,
                                  message: "Password must not exceed 30 characters.",
                                },
                                pattern: {
                                  value: /^(?!.*\s)(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/,
                                  message: "Confirm new password must include at least one uppercase letter, one letter, one number, and one special character, and no spaces.",
                                },
                              }}
                        />
                        
                        <Button
                            type="submit"
                            className="w-full mt-6 py-2"
                            variant="secondary"
                            disabled={isLoading} // Disable while loading
                        >
                            {isLoading ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </div>
            </div>
        </Private>
    );
}
