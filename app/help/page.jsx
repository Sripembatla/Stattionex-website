"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Private from "../layout/Private";

export default function HelpSection() {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const handleRatingClick = (index) => {
        setRating(index);
    };

    const router = useRouter();

    const handleBack = () => {
        router.back();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ rating, review });
        // Handle submit logic here (e.g., API call)
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
                      
                                      <h1 className='text-2xl font-bold ml-20 mt-4'>Help</h1>
                      
                      
                                  </div>
            <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white border rounded-md mb-2 ">
                {/* <div className="w-full flex justify-start mb-6">
                    <button className="text-gray-500 font-semibold flex items-center md:hidden" onClick={handleBack}>
                        <Icon icon="carbon:chevron-left" width="20" height="20" />
                        Back
                    </button>
                </div> */}
                
                <div className="flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0 md:space-x-6 border-b pb-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-semibold">Call Us</h2>
                        <p>Call us during business hours for immediate assistance.</p>
                    </div>
                    <Image src="/assets/images/emailus.png" alt="Email Us" className="w-32 h-32" width={100} height={100}/>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0 md:space-x-6 border-b pb-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-semibold">Email Us</h2>
                        <p>We&apos;ll get back to you as soon as possible, usually within a few hours.</p>
                    </div>
                    <Image src="/assets/images/emailus.png" alt="Email Us" className="w-32 h-32" width={100} height={100}/>
                </div>

                <div className="flex flex-col  space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-semibold">Feedback Us</h2>
                        <p>We&apos;ll get back to you as soon as possible, usually within a few hours.</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star, index) => (
                            <button key={index} onClick={() => handleRatingClick(star)} className={`text-4xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                ★
                            </button>
                        ))}
                    </div>
                    </div>

                    <form onSubmit={handleSubmit} className="m-0">
                    <div className="my-4 w-full">
                      <label
                        htmlFor="review"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Your Review:
                      </label>
                      <textarea
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Write your review here..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-200"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
            </div>
        </Private>
    );
}