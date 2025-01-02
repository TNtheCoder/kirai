import Image from "next/image";
import { roboto_mono, leckerli } from "./fonts";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (

    <div className="bg-black">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className={`font-leckerli text-7xl text-white`}>Kirai</h1>
        <h2 className={`font-roboto_mono lg:text-2xl text-xl text-center justify-center text-white leading-10`}>
          Tree Monitoring for Cisadane
        </h2>
        <div className="flex flex-row gap-4 mt-7">
          <Button variant="default">
            <Link href="/home" className="block py-2 px-3 relative transition duration-300 underline-effect">
              Get Started
            </Link>
          </Button>
        </div>

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
    </div>
  );
};
