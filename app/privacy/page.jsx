"use client";
import React, { useState } from "react";
import Private from "../layout/Private";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";


export default function Privacy() {
    const router = useRouter();
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

                <h1 className='text-2xl font-bold ml-20 mt-4'>Privacy</h1>


            </div>
            <div className="flex justify-center items-center h-screen">
                <div className='w-16 h-16 border-4 border-t-secondary animate-spin rounded-full text-secondary' role="status">

                </div>
            </div>
            
        </Private>
    );
}