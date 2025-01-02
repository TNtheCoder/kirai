'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import ClerkFirebaseProvider from '@/components/ClerkFirebaseProvider'; // Import ClerkFirebaseProvider

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Set default stale time
          },
        },
      })
  );

  return (
    <>
      <ClerkFirebaseProvider /> {/* Ensure Firebase-Clerk auth sync */}
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" /> {/* Toast notifications */}
        {children}
        <ReactQueryDevtools initialIsOpen={false} /> {/* Dev tools for React Query */}
      </QueryClientProvider>
    </>
  );
};

export default Providers;
