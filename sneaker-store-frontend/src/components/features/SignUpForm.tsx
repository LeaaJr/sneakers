// components/featured/SignUpForm.tsx
import React from 'react';

const SignUpForm: React.FC = () => (
  <form className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
    <h1 className="font-bold text-2xl mb-2">Create Account</h1>
    <div className="flex gap-2 my-4">
      <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center">
        <i className="fab fa-facebook-f" />
      </a>
      <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center">
        <i className="fab fa-google-plus-g" />
      </a>
      <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center">
        <i className="fab fa-linkedin-in" />
      </a>
    </div>
    <span className="text-xs">or use your email for registration</span>
    <input type="text" placeholder="Name" className="bg-gray-200 p-3 my-2 w-full" />
    <input type="email" placeholder="Email" className="bg-gray-200 p-3 my-2 w-full" />
    <input type="password" placeholder="Password" className="bg-gray-200 p-3 my-2 w-full" />
    <button type="submit" className="rounded-full border border-[#FF4B2B] bg-[#FF4B2B] text-white text-xs font-bold px-10 py-3 uppercase mt-4">
      Sign Up
    </button>
  </form>
);

export default SignUpForm;