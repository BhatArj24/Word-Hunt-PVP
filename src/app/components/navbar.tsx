import { Lightbulb, BarChart, HelpCircle, Settings } from "lucide-react";
import React from "react";
import Link from "next/link"

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-black text-white border-b border-gray-700">
      <div className="text-lg font-bold">
        <Link href="/">
          <button>WordHunt</button>
        </Link>
      </div>
      <div className="flex-grow"></div>

      <div className="flex items-center gap-6">
        <BarChart className="w-6 h-6 cursor-pointer hover:text-gray-400" />
        <HelpCircle className="w-6 h-6 cursor-pointer hover:text-gray-400" />
        <Settings className="w-6 h-6 cursor-pointer hover:text-gray-400" />
      </div>
    </div>
  );
};

export default Navbar;