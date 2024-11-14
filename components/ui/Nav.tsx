"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { leckerli, roboto } from "@/app/fonts";
import { Button } from "./button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { HiBars3 } from "react-icons/hi2";
import { FaCircleUser } from "react-icons/fa6";
import { navLinks } from "@/utils/links";
import { SignOutButton } from "@clerk/nextjs";

function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initialize the scroll state on mount.

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`fixed w-full pb-2 transition-all duration-300 z-50 ${
                isScrolled ? "bg-neutral-900 text-white border-b border-neutral-800 shadow-md" : "bg-transparent"
            }`}
        >
            <nav className="font-roboto_mono mx-auto flex items-center justify-between p-4 max-w-7xl text-white">
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <Link href="/homepage" className="flex items-center">
                        <Image
                            src="https://res.cloudinary.com/ddm5wmrje/image/upload/v1731296372/pixel_tree_dn4722.png"
                            alt="logo"
                            width={40}
                            height={50}
                        />
                        <h1 className="font-leckerli text-lg font-bold ml-2">Kirai</h1>
                    </Link>
                </div>

                {/* Navigation Links */}
                <ul className="lg:flex space-x-4 md:space-x-8 hidden ml-10">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="block py-2 px-3 underline-effect">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Profile Dropdown - Desktop */}
                <div className="lg:flex items-center ml-auto hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                aria-label="User Profile"
                                className="bg-transparent p-1"
                                role="button"
                            >
                                <FaCircleUser className="h-8 w-8 text-white" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black rounded border text-white shadow-lg">
                            <DropdownMenuItem className="">
                                <Link href="/Profile">
                                        Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="w-full text-center">
                                <SignOutButton />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden flex items-center ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button aria-label="Navigation Menu" className="bg-transparent mt-3" role="button">
                                <HiBars3 className="h-8 w-8 text-white" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black border-b text-white shadow-lg w-svw">
                            <DropdownMenuLabel>
                                {navLinks.map((link) => (
                                    <DropdownMenuItem key={link.href}>
                                        <Link href={link.href} className="text-sm  py-2 font-roboto_mono">
                                            {link.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-center justify-center">
                                <Link href="/Profile">
                                    
                                        Profile
                                    
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-center bg-red-900 justify-center hover:bg-red-400">
                                    <SignOutButton />
                                
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;

