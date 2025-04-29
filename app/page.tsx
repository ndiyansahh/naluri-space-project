import { Navbar } from "@/components/Layout/Navbar";
import { Section } from "@/components/Layout/Section";
import { Footer } from "@/components/Layout/Footer";
import SunCalculatorLoader from "@/components/containers/SunCalculatorLauder";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <Section />
      <div className="flex justify-center -mt-12 px-4 relative z-10">
        <SunCalculatorLoader />
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </main>
  );
}
