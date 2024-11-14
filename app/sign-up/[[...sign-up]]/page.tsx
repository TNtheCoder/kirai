import { SignUp } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return (
    <div className='min-h-screen flex justify-center items-center bg-black'>
    <SignUp />
    </div>
  )
}

export default SignUpPage