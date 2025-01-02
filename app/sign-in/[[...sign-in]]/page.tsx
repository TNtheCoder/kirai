'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const SignInPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <SignIn 
      path="/sign-in" 
      routing="path" 
      signUpUrl="/sign-up" 
      appearance = {{
        baseTheme: dark,
      }}
      />
      
    </div>
  );
};

export default SignInPage;
