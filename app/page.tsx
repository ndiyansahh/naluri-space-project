"use client";

import { Navbar } from "@/components/Layout/Navbar";
import { Section } from "@/components/Layout/Section";
import { Footer } from "@/components/Layout/Footer";

import SunCalculator from "@/components/containers/SunCalculator";

import { useState } from "react";

const radius = 695700;

export default function Home() {
  const [pi, setPi] = useState<number>(generatePi());
  const circumference = 2 * pi * radius;

  function generatePi() {
    const basePi = 3.14159;
    const randomExtra = Math.random() * 0.00001;
    return basePi + randomExtra;
  }

  function handleRecalculate() {
    setPi(generatePi());
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
      <Navbar />
      <Section />
      <SunCalculator />
      <div className="w-full max-w-md px-4 -mt-8 mb-16"></div>

      <Footer />
    </main>
  );
}
