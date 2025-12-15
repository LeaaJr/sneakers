import React from 'react'

interface FooterProps {
  id: string;
}

export const Footer: React.FC<FooterProps> = ({ }) => {
  return (
    <footer className="bg-white text-black py-16 px-8 w-full">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-semibold mb-4">NEW YORK</h3>
            <p>Huntersville,</p>
            <p>957 Hill Hills Suite 491, United States</p>
            <p>Office: +1 (646) 36 2982 743</p>
            <p>Support: Lmcompany@Outlook.com</p>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <p>Sign up to our newsletter</p>
          <div className="flex justify-center max-w-lg mx-auto gap-2 mt-4">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 p-3 border border-gray-300 rounded-md"
            />
            <button className="bg-gray-800 text-white p-3 rounded-md hover:bg-gray-700">
              Subscribe
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <div className="font-semibold text-xl flex items-center justify-center">
            <img src={""} alt="Logo" className="max-w-full h-auto max-h-12" />
          </div>
          <div className="text-gray-600">© 2021-2025 LM™. All Rights Reserved.</div>
          <div className="text-gray-600">🇺🇸 English (US)</div>
        </div>
      </div>
    </footer>
  )
}
