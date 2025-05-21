"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { bootstrapCameraKit } from "@snap/camera-kit";
import Image from "next/image";
import Icons from "./CustomIcons/Icons";
import { set } from "js-cookie";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { Icon } from "@iconify/react";
import Share from "./Share";
import { WEBSITE_BASE_URL_2 } from "../utils/constant";

const Camera = ({ p }) => {
  const canvasRef = useRef(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [productName, setProductName] = useState(null);
  const [selectedLensData, setSelectedLensData] = useState(undefined);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch background images from Pexels
  const fetchBackgroundImages = async (query, pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&per_page=10&page=${pageNum}`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY,
          },
        }
      );
      const fetchedImages = response.data.photos.map((photo) => ({
        id: photo.id,
        src: photo.src.medium,
        alt: photo.alt,
      }));
      setBackgroundImages((prevImages) =>
        pageNum === 1 ? fetchedImages : [...prevImages, ...fetchedImages]
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images from Pexels:", error);
      setLoading(false);
    }
  };

  const handleBackgroundChange = async (image) => {
    if (!capturedImage) {
      console.error("No captured image found to edit.");
      toast.error("Please capture an image first.");
      return;
    }

    try {
      const response = await fetch(capturedImage);
      const capturedImageBlob = await response.blob();
      const formData = new FormData();
      formData.append("image_file", capturedImageBlob, "captured_image.png");

      const removeBgResponse = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": "mnADKJqpab8h42D9NhzikumN",
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const transparentImageBlob = removeBgResponse.data;

      const bgResponse = await fetch(image);
      const bgBlob = await bgResponse.blob();

      const finalCanvas = document.createElement("canvas");
      const context = finalCanvas.getContext("2d");

      const bgImage = new window.Image();
      const fgImage = new window.Image();

      bgImage.src = URL.createObjectURL(bgBlob);
      fgImage.src = URL.createObjectURL(transparentImageBlob);
      await Promise.all([
        new Promise((resolve) => (bgImage.onload = resolve)),
        new Promise((resolve) => (fgImage.onload = resolve)),
      ]);

      finalCanvas.width = Math.max(bgImage.width, fgImage.width);
      finalCanvas.height = Math.max(bgImage.height, fgImage.height)

      context.drawImage(bgImage, 0, 0, finalCanvas.width, finalCanvas.height);
      context.drawImage(fgImage, 0, 0, finalCanvas.width, finalCanvas.height);

      const finalImageUrl = finalCanvas.toDataURL("image/png");
      setCapturedImage(finalImageUrl);
      toast.success("Background changed successfully!");
    } catch (error) {
      console.error("Error changing background:", error);
      toast.error(
        error.response?.data?.error || "Failed to change the background."
      );
    }
  };

  // Fetch more images when the user scrolls to the bottom of the dropdown
  const handleScroll = () => {
    if (!dropdownRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
      setPage((prevPage) => prevPage + 1); // Increase the page number to load more images
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
    setPage(1); // Reset to the first page
  };

  // Fetch images when the dropdown is toggled open, the page number changes, or the search query changes
  useEffect(() => {
    if (showDropdown) {
      fetchBackgroundImages(searchQuery, page); // Fetch images for the current page and query
    }
  }, [showDropdown, page, searchQuery]);

  useEffect(() => {
    if (p !== undefined) {
      setProductName(p?.name);
  
      const selectedLens = {
        lensId: p?.variants[0]?.lensId,
        lensGroupId: "1b9751e8-f7ed-425b-bb75-678787b0ff2c", // Static Group ID
      };
  
      if (selectedLens.lensId) {
        setIsWindowOpen(true);
        setSelectedLensData(selectedLens);
        setIsLoading(false);
      } else {
        toast.error(`No lens data available for the product: ${p?.name}`);
        console.error(`No lens data found for product: ${p?.name}`);
      }
    }
  }, [p]);
  

  const captureImage = () => {
    if (!canvasRef.current) {
      console.error("Canvas is not available for capturing the image.");
      toast.error("Canvas is not available for capturing the image.");
      return;
    }

    const dataUrl = canvasRef.current.toDataURL("image/png");
    setCapturedImage(dataUrl);
    toast.success("Image captured successfully!");
  };

  const retakeImage = async () => {
    setCapturedImage(null); 
    if (window.currentSession) {
      console.log("Destroying existing session before retake...");
      await window.currentSession.destroy();
      window.currentSession = null;
    }
    if (canvasRef.current) {
      console.log("Removing old canvas...");
      canvasRef.current.remove();
      canvasRef.current = null;
    }
    initializeCameraKit();
  };

  const downloadImage = () => {
    if (!capturedImage) {
      console.error("No image captured to download.");
      toast.error("No image captured to download.");
      return;
    }

    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = "captured_image.png";
    link.click();
    console.log("Image downloaded successfully.");
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedImage, setSharedImage] = useState(null);
  const [chatShare, setChatShare] = useState(false);

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const openChatShareModal = () => {
    setChatShare(true);
  };

  const closeChatShareModal = () => {
    setChatShare(false);
  };

  // console.log('pp', p)

  const shareImage = async () => {
    if (!capturedImage) {
      console.error("No image captured to share.");
      toast.error("No image captured to share.");
      return;
    }

    try {
      console.log("Preparing to share the image...");
      const blob = await (await fetch(capturedImage)).blob();
      const file = new File([blob], "captured_image.png", {
        type: "image/png",
      });
      setSharedImage(capturedImage);
      setIsShareModalOpen(true);


      // if (navigator.share) {
      //   await navigator.share({
      //     title: "Captured Image",
      //     files: [file],
      //   });
      //   toast.success("Image shared successfully!");
      //   console.log("Image shared successfully.");
      // } else {
      //   console.error("Web Share API is not supported in this browser.");
      //   toast.error("Web Share API is not supported in this browser.");
      // }
    } catch (error) {
      console.error("Error sharing the image:", error);
      toast.error("Failed to share the image.");
    }
  };

  const initializeCameraKit = useCallback(async () => {
    if (!selectedLensData) {
      toast.error("Lens data is missing. Please select a valid product.");
      console.error("Lens data is undefined for the selected product.");
      return;
    }
    setIsLoading(true);
    try {
      const parent = document.getElementById("canvasContainer");
      if (!parent) {
        throw new Error(
          "Canvas container not found. Ensure the DOM element exists with id='canvasContainer'."
        );
      }
      if (window.currentSession) {
        console.log("Destroying existing session...");
        await window.currentSession.destroy();
        window.currentSession = null;
      }
      if (canvasRef.current) {
        console.log("Cleaning up existing canvas...");
        canvasRef.current.remove();
        canvasRef.current = null;
      }
      setCapturedImage(null);
      const newCanvas = document.createElement("canvas");
      newCanvas.id = "canvas";
      newCanvas.className = "border border-gray-300 rounded-lg w-full";
      newCanvas.width = 320;
      newCanvas.height = "100%";

      parent.appendChild(newCanvas);
      canvasRef.current = newCanvas;

      const cameraKit = await bootstrapCameraKit({
        apiToken:
          "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzM0NzYyMDI3LCJzdWIiOiI5NTZkZDNiNS0wMzBjLTQ4ZTgtYWVmOC00Yzg4ODE0ZTczMDJ-U1RBR0lOR345ZDg1MzFkNC0yODllLTRlZTAtOTJlNS05MTc4ODkxOGI1MzMifQ.aUqxzCN9QaYP3d0z8_gUnIGBziAQMDicAg6GBIA4LSU",
      });

      setIsSessionReady(true);

      const session = await cameraKit.createSession({
        liveRenderTarget: canvasRef.current,
      });
      window.currentSession = session;
      setIsLoading(false);

      if (typeof window !== "undefined") {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        await session.setSource(mediaStream);
        await session.play();
        const lens = await cameraKit.lensRepository.loadLens(
          selectedLensData.lensId,
          selectedLensData.lensGroupId
        );
        await session.applyLens(lens);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing CameraKit:", error);
      toast.error(
        error.message || "Failed to initialize the camera. Please try again."
      );
      setIsLoading(false);
    }
  }, [selectedLensData]);

  useEffect(() => {
    if (typeof window !== "undefined" && selectedLensData) {
      console.log("selectedLensData", selectedLensData);
      setCapturedImage(null); 
      initializeCameraKit();
    }
  }, [selectedLensData, initializeCameraKit]);

  if (!isWindowOpen) return null;

  return (
    <div className="">
      <div className=" p-4 rounded-lg  w-full h-full mx-auto  relative">
        {/* <div className="handle cursor-move bg-gray-300 p-2 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Virtual Trail Room</h2>
        </div> */}

        <div>
          {capturedImage === null ? (
            <div>
              {isLoading ? (
                <div className=" w-full h-[500px] text-center">
                  <img src="/assets/images/loading.gif" alt="Loading" />
                </div>
              ) : (
                <div id="canvasContainer" className="camera-container">
                </div>
              )}
              <button
                className="bg-secondary w-1/2 text-white px-4 py-2 rounded-lg mt-4 mx-auto block absolute bottom-8 left-1/2 transform -translate-x-1/2"
                onClick={captureImage}
              >
                Capture
              </button>
            </div>
          ) : (
            <div className="mt-4 relative">
              <img
                src={capturedImage}
                alt="Captured"
                className="border rounded-lg w-full"
              />
              <div>
                <div id="canvasContainer" className="camera-container">
                </div>

                <button
                  className="bg-secondary w-1/2 text-white px-4 py-2 rounded-lg mt-4 mx-auto block"
                  onClick={retakeImage}
                >
                  Retake
                </button>
              </div>

              <div className="mt-2">
                <button
                  className="bg-green-500 w-1/2 text-white px-4 py-2 rounded-lg mt-2 mx-auto block"
                  onClick={downloadImage}
                >
                  Download
                </button>
                <button
                  className="bg-blue-500 w-1/2 text-white px-4 py-2 rounded-lg mt-2 mx-auto block"
                  onClick={shareImage}
                >
                  Share
                </button>

                {/* {isShareModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md mx-4">
                      <button
                        onClick={closeShareModal}
                        className="absolute top-2 right-2 text-xl"
                      >
                        ✕
                      </button>
                      <h2 className="text-lg sm:text-xl font-semibold mb-4">Share This Image</h2>

                      {sharedImage && (
                        <div className="w-full flex justify-center mb-4">
                          <img src={sharedImage} alt="Captured" className="max-w-full rounded-lg" />
                        </div>
                      )}

                      <p>Share this captured image with your friends.</p>

                      <div className="grid grid-cols-3 gap-4 mt-4 sm:flex sm:justify-between">
                        <button className="flex flex-col items-center" onClick={openChatShareModal}>
                          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                            <Icon
                              icon="basil:chat-solid"
                              color="orange"
                              width="20"
                            />
                          </div>
                          <span className="mt-1 text-xs sm:text-sm">
                            Chat Buddies
                          </span>
                        </button>
                        <TwitterShareButton url={sharedImage} title="Check out this image!">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <Icon icon="devicon:twitter" color="black" width="25" />
                          </div>
                          <span className="mt-1 text-xs sm:text-sm">X</span>
                        </TwitterShareButton>

                        <FacebookShareButton url={sharedImage} title="Check this out!">
                          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                            <Icon icon="ri:facebook-fill" color="blue" width="25" />
                          </div>
                          <span className="mt-1 text-xs sm:text-sm">Facebook</span>
                        </FacebookShareButton>

                        <WhatsappShareButton url={sharedImage} title="Check this image!">
                          <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                            <Icon icon="logos:whatsapp-icon" width="25" />
                          </div>
                          <span className="mt-1 text-xs sm:text-sm">WhatsApp</span>
                        </WhatsappShareButton>
                      </div>
                    </div>
                  </div>
                )} */}

                {chatShare && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-[50%] max-w-sm mx-4">
                      <button
                        onClick={closeChatShareModal}
                        className="absolute top-2 right-2 text-xl"
                      >
                        ✕
                      </button>
                      <h2 className="text-lg sm:text-xl font-semibold mb-4">
                        Send to Friends
                      </h2>
                      <input type="text" placeholder="Add any message" className="p-2 border w-full 4" />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4 lg:mt-4">
                  <div className=" absolute top-1 right-1">
                    <button
                      className="change-background p-2 bg-secondary text-white rounded-md flex items-center gap-2"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="lg:inline">
                        <Icons iconName="changebackground" width={30} height={30} />
                      </span>
                    </button>

                    {showDropdown && (
                      <div
                        ref={dropdownRef}
                        className="w-max absolute right-2 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto custom-scrollbar"
                      >
                        <div className="p-2">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search backgrounds..."
                            className="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <ul className="grid grid-cols-2 sm:grid-cols-2 gap-2 p-2">
                          {backgroundImages.map((image) => (
                            <li
                              key={image.id}
                              className="cursor-pointer hover:bg-gray-100 p-2"
                              onClick={() =>
                                handleBackgroundChange(image.src)
                              }
                            >
                              <Image
                                src={image.src}
                                alt={image.alt}
                                width={100}
                                height={100}
                                className="rounded-md"
                              />
                            </li>
                          ))}
                        </ul>

                        {loading && (
                          <p className="text-center p-2">
                            Loading more images...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Share isOpen={isShareModalOpen} closeShareModal={closeShareModal} url={`${WEBSITE_BASE_URL_2}/products/${p._id}`}
      message={'i have tried this'} image={capturedImage}
      />
    </div>
  );
};

export default Camera;
