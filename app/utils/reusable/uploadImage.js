import React, { memo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import AWS from "aws-sdk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import UploadFile from "@/app/component/uploadFile";

const UploadImage = ({
  label,
  name,
  onImageUpload,
  multiple = false,
  icon,
  color,
}) => {
  const {
    register,
    formState: { errors },
  } = useForm({ criteriaMode: "all" });
  const [selectedImgs, setSelectedImgs] = useState([]);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];

    const maxFileSize = 2 * 1024 * 1024; // 2MB (1024 bytes * 1024 = 1MB)

    const validFiles = files.filter((file) => {
      // Check if file type is valid
      const isValidType = allowedTypes.includes(file.type);
      // Check if file size is within the limit
      const isValidSize = file.size <= maxFileSize;
  
      if (!isValidType) {
        toast.error(`Invalid file type: ${file.name}. Only PNG, JPG, JPEG, or PDF files are allowed.`);
      }
      if (!isValidSize) {
        toast.error(`File ${file.name} is too large. Max size is 1MB.`);
      }
  
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.error("Please upload only PNG, JPG, JPEG, or PDF files.");
      e.target.value = "";
      return;
    }

    const uploadedImages = [];
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    });
    const s3 = new AWS.S3();

    try {
      for (const file of validFiles) {
        const params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: `assets/${file.name}`,
          Body: file,
          // ACL: 'public-read',
        };

        const uploadResult = await s3.upload(params).promise();
        uploadedImages.push(uploadResult.Location);
      }

      // console.log("uploadedImagesuploadedImages", uploadedImages);
      // alert("Files uploaded successfully");
      // window.location.reload();
      toast.success("Files uploaded successfully");
      onImageUpload(uploadedImages, name);
      setSelectedImgs(uploadedImages);
    } catch (error) {
      // console.error("Error uploading files:", error);
      // alert("Error uploading files. Please try again later.");
      toast.error("Error uploading files. Please try again later.");
    }
  };

  const handleProfilePic = () => {
    fileInputRef.current.click();
  };

  console.log("selectedImgsselectedImgsselectedImgs", selectedImgs);
  return (
    <>
      {icon ? (
        <>
          <Icon
            icon="carbon:camera"
            color={color}
            width={22}
            height={22}
            onClick={handleProfilePic}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </>
      ) : (
        <UploadFile
          label={label}
          name={name}
          onChange={handleUpload}
          register={register}
          errors={errors}
          rules={{
            required: "This input is required.",
          }}
          selected={selectedImgs}
          multiple={multiple}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default memo(UploadImage);
