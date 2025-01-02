'use client';

import { UserProfile, useAuth } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { signOut } = useAuth();  // Access Clerk's signOut function
  const router = useRouter();     // Router to navigate after sign out

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle opening the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle sign out
  const handleSignOut = () => {
    signOut();
    router.push('/home');
  };

  return (
    <div className="bg-black min-h-screen flex flex-col  mt-20 p-4">
      <div className=' flex items-center justify-center'>

        {/* User Profile */}
        <UserProfile appearance={{ baseTheme: dark }} />
        </div>

        {/* Custom Sign-Out Button */}
        <div className='flex justify-center w-1/2 mt-4 '>
        <button
          onClick={openModal}
          className="py-2 px-6 bg-red-600 text-white rounded-md hover:bg-red-500 transition duration-300"
        >
          Sign Out
        </button>
        </div>
        
      

      {/* Modal Popup */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-neutral-900 text-white border-b border-neutral-800 shadow-md p-6 rounded-md w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/3 xl:w-1/4">
      <h2 className="text-lg text-center font-roboto_mono font-bold mb-4">
        Are you sure you want to sign out?
      </h2>
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
        <button
          onClick={closeModal}
          className="py-2 px-6 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300 font-roboto_mono"
        >
          Cancel
        </button>
        <button
          onClick={handleSignOut}
          className="py-2 px-6 bg-red-600 text-white rounded-md hover:bg-red-500 transition duration-300 font-roboto_mono"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
