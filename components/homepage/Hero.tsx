import React from 'react'
import { roboto_mono, roboto, leckerli } from '@/app/fonts'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-36">
        <h1 className={`font-leckerli text-7xl text-white `}>Kirai</h1>
        <h2 className={`font-roboto_mono lg:text-2xl text-xl text-center justify-center text-white leading-10`}>Tree Monitoring for Cisadane</h2>
        
        <div className="relative w-full max-w-screen-lg">
          <Image
            src="https://res.cloudinary.com/ddm5wmrje/image/upload/v1731295473/testTree-unscreen_rdcgi8.gif"
            alt="Tree"
            width={800}
            height={300}
            className="object-cover w-full h-[400px] sm:h-[400px] md:h-[700px] lg:h-[450px]"
          />
        </div>
    </div>
  );
};
