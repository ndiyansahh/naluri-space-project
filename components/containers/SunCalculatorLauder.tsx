"use client";

import dynamic from "next/dynamic";

// This small component only exists to do the dynamic import
export default dynamic(
  () => import("./SunCalculator"),
  { ssr: false }
);
