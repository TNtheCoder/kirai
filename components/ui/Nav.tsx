"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useAuth, useUser } from "@clerk/nextjs"; // Import useUser to fetch user data
import { usePathname } from "next/navigation";
import { leckerli, roboto } from "@/app/fonts";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { HiBars3 } from "react-icons/hi2";
import { navLinks } from "@/utils/links";
import { HiXMark } from "react-icons/hi2";
import { useRouter } from "next/navigation"; 
import { dark } from "@clerk/themes";
import userprofilemode from "@clerk/themes";

function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { isSignedIn, signOut } = useAuth(); // Get signOut function from useAuth
    const { user } = useUser(); // Use useUser to get the full user details
    const router = useRouter(); // Router for redirection

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

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev); // Toggle menu state
    };

    const handleSignOut = () => {
        const confirmSignOut = window.confirm("Are you sure you want to sign out?");
        if (confirmSignOut) {
            signOut(); // Sign out the user
            router.push("/home"); // Redirect to /home after sign out
        }
    };


    return (
        <header
            className={`fixed w-full pb-2 transition-all duration-300 z-50 ${
                isScrolled ? "bg-neutral-900 text-white border-b border-neutral-800 shadow-md" : "bg-transparent"
            }`}
        >
            <nav className="font-roboto_mono mx-auto flex items-center justify-between p-4 max-w-7xl text-white">
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <Link href="/home" className="flex items-center">
                        <Image
                            src="https://res.cloudinary.com/ddm5wmrje/image/upload/v1731296372/pixel_tree_dn4722.png"
                            alt="logo"
                            width={40}
                            height={50}
                        />
                        <h1 className="font-leckerli text-lg font-bold ml-2">Kirai</h1>
                    </Link>
                </div>

                {/* Navigation Links - Desktop */}
                <ul className="lg:flex space-x-4 md:space-x-8 hidden ml-10">
                    {navLinks.map((link) => (
                        // Conditionally hide the "Trees" link if the user is signed in
                        link.label === "Trees" && isSignedIn ? null : (
                            <li key={link.href}>
                                <Link href={link.href} className="block py-2 px-3 underline-effect">
                                    {link.label}
                                </Link>
                            </li>
                        )
                    ))}
                </ul>

                {/* Profile Button - Desktop */}
                <div className="lg:flex items-center ml-auto hidden">
                    {/* User Button only */}
                    <UserButton 
                    appearance={{ baseTheme: dark }}>
                    </UserButton>
                    
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden flex items-center ml-auto">
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <button
                                aria-label="Navigation Menu"
                                className="bg-transparent mt-3"
                                role="button"
                                onClick={toggleMenu} // Toggle on click
                            >
                                {isMenuOpen ? (
                                    <HiXMark className="h-8 w-8 text-white" /> // Show X when menu is open
                                ) : (
                                    <HiBars3 className="h-8 w-8 text-white" /> // Show hamburger when menu is closed
                                )}
                            </button>
                        </DropdownMenuTrigger>

                        {/* Dropdown Menu Content */}
                        <DropdownMenuContent className="bg-black border-b text-white shadow-lg w-svw">
                        <DropdownMenuLabel asChild>
                                {isSignedIn && user ? (
                                    <div className="flex items-center py-2 space-x-5 px-4">
                                        <Link href="/profile" className="flex items-center">
                                            <UserButton 
                                            />
                                            {/* Container for name and email */}
                                            <div className="text-white flex flex-col ml-4 font-roboto">
                                                <span>{user.firstName} {user.lastName}</span>
                                                <span className="text-sm text-gray-300">({user.primaryEmailAddress?.emailAddress})</span>
                                            </div>
                                        </Link>
                                    </div>
                                ) : null}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* Navigation Links in Mobile Version */}
                            <div className="flex flex-col space-y-2 py-2 px-4">
                                {navLinks.map((link) => (
                                    // Conditionally hide the "Trees" link if the user is signed in
                                    link.label === "Trees" && isSignedIn ? null : (
                                        <DropdownMenuItem key={link.href}>
                                            <Link href={link.href} className="text-sm py-2 font-roboto_mono">
                                                {link.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    )
                                ))}
                            </div>
                            {/* <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-center justify-center border rounded mb-2 ">
                                <Link href="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-center bg-red-900 justify-center hover:bg-red-400"
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
