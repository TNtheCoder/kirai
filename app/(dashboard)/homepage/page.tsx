import Hero from "@/components/homepage/Hero";
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';


export default function Home() {
    const queryClient = new QueryClient();
  return(
    <HydrationBoundary state={dehydrate(queryClient)}>
  <main className="bg-black">
    <div className="flex flex-col items-center justify-center min-h-screen">
       <Hero />
        </div>
   </main>
    </HydrationBoundary>
  );
}