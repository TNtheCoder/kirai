
import { inter } from "@/app/fonts";
import NavBar from "@/components/ui/Nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    
    
      <div
        className={inter.className}
      >
        <div className="flex flex-col min-h-screen bg-black">
        <NavBar />
        {children}
        {/* <Footer /> */}
        </div>
      </div>
    
    
  );
};