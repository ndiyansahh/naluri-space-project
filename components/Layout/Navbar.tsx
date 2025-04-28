import Image from "next/image";

export function Navbar() {
  return (
    <header className="w-full bg-white py-4 px-6 flex justify-between items-center border-b border-gray-100">
      <div className="flex items-center">
        <Image
          src="/images/naluri-logo.png"
          alt="Naluri Logo"
          width={120}
          height={34}
          className="h-8 w-auto"
          priority
        />
      </div>
    </header>
  );
}
