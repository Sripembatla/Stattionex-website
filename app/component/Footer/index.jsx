import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

const Footer = () => {
  return (
    <footer className="Footer bg-[#f7f7f7] flex flex-col items-center justify-center px-4 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/">
          <img
            src="/assets/images/logo.png"
            alt="Logo"
            className="w-16 h-16"
          />
        </Link>
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-xl font-bold text-[#7B9220] uppercase">Vriddhee</h2>
          <p className="text-sm font-medium text-gray-400 uppercase">SuperStore</p>
        </div>
      </div>
      <ul className="flex flex-wrap justify-center gap-6 text-center">
        <li>
          <Link href="/">
            <p className="text-sm font-medium text-[#1D2E36]">Home</p>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <p className="text-sm font-medium text-[#1D2E36]">About</p>
          </Link>
        </li>
        <li>
          <Link href="/terms">
            <p className="text-sm font-medium text-[#1D2E36]">Terms & Conditions</p>
          </Link>
        </li>
        <li>
          <Link href="/contact">
            <p className="text-sm font-medium text-[#1D2E36]">Contact</p>
          </Link>
        </li>
      </ul>
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { icon: 'uil:instagram', href: '/' },
          { icon: 'pajamas:twitter', href: '/' },
          { icon: 'ic:round-facebook', href: '/' },
          { icon: 'ic:round-whatsapp', href: '/' },
        ].map((item, i) => (
          <Link href={item.href} key={i}>
            <button className="p-4 bg-[#7B9220] text-white rounded-full">
              <Icon icon={item.icon} width={25} height={25} />
            </button>
          </Link>
        ))}
      </div>
      <div className="w-full max-w-7xl ">
        <div className="border-b border-[#616161]"></div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#1D2E36]">
          © 2025 Vriddhee SuperStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
