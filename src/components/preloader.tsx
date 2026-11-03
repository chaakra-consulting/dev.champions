'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. Detect default Next.js 404 page by title
    const isDefault404 = document.title.includes('404');
    
    // 2. Detect a custom 404 page by looking for a specific element ID
    // (If you have a custom not-found.tsx, add id="not-found-page" to its main wrapper)
    const isCustom404 = document.getElementById('not-found-page') !== null;

    // Immediately hide the preloader if it's a 404 route
    if (isDefault404 || isCustom404) {
      setIsLoading(false);
      return;
    }

    const handleLoad = () => {
      setIsFading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    if (document.readyState === 'complete') {
      setTimeout(handleLoad, 1500); 
    } else {
      window.addEventListener('load', () => setTimeout(handleLoad, 4000));
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      id="page-loader"
      className={`fixed inset-0 z-[99999] bg-white flex items-center justify-center transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="[scale:3] h-[50px] w-[40px]">
        {/* Block 1 */}
        <div className="relative opacity-0 left-[10px] animate-from-left">
          <div className="absolute bg-[#000033] w-[19px] h-[5px] skew-y-[-25deg] top-[14px] left-[10px]"></div>
          <div className="absolute bg-[#000068] w-[19px] h-[5px] skew-y-[25deg] top-[14px] left-[-9px]"></div>
          <div className="absolute bg-[#000099] w-[20px] h-[20px] [rotate:45deg] [transform:skew(-20deg,-20deg)]"></div>
        </div>

        {/* Block 2 */}
        <div className="relative opacity-0 left-[10px] animate-from-right [animation-delay:1s]">
          <div className="absolute bg-[#000033] w-[19px] h-[5px] skew-y-[-25deg] top-[14px] left-[10px]"></div>
          <div className="absolute bg-[#000068] w-[19px] h-[5px] skew-y-[25deg] top-[14px] left-[-9px]"></div>
          <div className="absolute bg-[#000099] w-[20px] h-[20px] [rotate:45deg] [transform:skew(-20deg,-20deg)]"></div>
        </div>

        {/* Block 3 */}
        <div className="relative opacity-0 left-[10px] animate-from-left [animation-delay:2s]">
          <div className="absolute bg-[#000033] w-[19px] h-[5px] skew-y-[-25deg] top-[14px] left-[10px]"></div>
          <div className="absolute bg-[#000068] w-[19px] h-[5px] skew-y-[25deg] top-[14px] left-[-9px]"></div>
          <div className="absolute bg-[#000099] w-[20px] h-[20px] [rotate:45deg] [transform:skew(-20deg,-20deg)]"></div>
        </div>

        {/* Block 4 */}
        <div className="relative opacity-0 left-[10px] animate-from-right [animation-delay:3s]">
          <div className="absolute bg-[#000033] w-[19px] h-[5px] skew-y-[-25deg] top-[14px] left-[10px]"></div>
          <div className="absolute bg-[#000068] w-[19px] h-[5px] skew-y-[25deg] top-[14px] left-[-9px]"></div>
          <div className="absolute bg-[#000099] w-[20px] h-[20px] [rotate:45deg] [transform:skew(-20deg,-20deg)]"></div>
        </div>
      </div>
    </div>
  );
}