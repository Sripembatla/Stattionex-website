"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function Url() {
  const pathname = usePathname();

  useEffect(() => {
    storePathValues(pathname);
  }, [pathname]);

  function storePathValues(currentPath) {
    const prevPath = localStorage.getItem("currentPath");
    localStorage.setItem("prevPath", prevPath);
    localStorage.setItem("currentPath", currentPath);
  }

  return null;
}
