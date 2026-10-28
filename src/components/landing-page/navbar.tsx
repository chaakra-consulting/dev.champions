'use client';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';

// 1. Rename your original Navbar to an internal component (e.g., NavbarContent)
function NavbarContent() {
  const pathname = usePathname();

  // --- STATE ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // --- REFS ---
  const navRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    // 1. requestAnimationFrame Scroll Listener (for sticky nav)
    let ticking = false;
    let frameId: number | null = null;

    const handleScroll = () => {
      if (!ticking) {
        frameId = window.requestAnimationFrame(() => {
          setIsSticky(window.scrollY > 10);
          ticking = false; // Reset the lock after the frame renders
        });
        ticking = true; // Lock future frames until this one finishes
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial check on mount

    // 2. Click Outside Listener
    const handleClickOutside = (event: { target: any; }) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // 3. Escape Key Listener
    const handleKeyDown = (event: { key: string; }) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Cancel any pending animation frame to prevent state updates on unmount
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  // --- HANDLERS ---
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) setActiveDropdown(null); 
  };

  const toggleDropdown = useCallback((dropdownName: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  }, []);

  // --- JSX ---
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500 ease-in-out"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav 
        ref={navRef}
        id="mainNav"
        className={`bg-[#fafafa] absolute z-50 group w-full h-26 md:h-auto px-6 py-4 transition-all duration-500 ease-in-out overflow-hidden md:overflow-visible [&.open]:h-[500px] md:[&.open]:h-auto [&.nav-sticky]:fixed [&.nav-sticky]:top-0 [&.nav-sticky]:left-0 [&.nav-sticky]:shadow-[0_4px_20px_rgba(0,0,0,0.08)] [&.nav-sticky]:backdrop-blur-md ${isMenuOpen ? 'open' : ''} ${isSticky ? 'nav-sticky' : ''}`}
      >
        <div className="max-w-screen mx-auto flex flex-col md:flex-row md:items-center gap-6 justify-between">
          
          {/* Logo & Mobile Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="shrink-0 flex items-center h-full flex-col">
              <h3 className="text-3xl font-extrabold text-[#000068]">
                Champions.
              </h3>
              <p className="text-sm text-gray-600"> Private Academic Advisory</p>
            </div>

            <button 
              id="menuToggleBtn"
              onClick={toggleMenu}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMenuOpen}
              className="cursor-pointer flex md:hidden relative w-12 h-12 justify-center items-center rounded-md focus:outline-none"
            >
              <div className="relative w-7 h-4">
                <span className="absolute top-0 left-0 w-full h-0.5 bg-slate-800 transition-all duration-300 ease-in-out group-[.open]:top-2 group-[.open]:rotate-45"></span>
                <span className="absolute top-2 left-0 w-full h-0.5 bg-slate-800 transition-all duration-300 ease-in-out group-[.open]:opacity-0 group-[.open]:w-0"></span>
                <span className="absolute top-4 left-0 w-full h-0.5 bg-slate-800 transition-all duration-300 ease-in-out group-[.open]:top-2 group-[.open]:-rotate-45"></span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden group-[.open]:flex md:flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
              <a href="/" className={`nav-link text-md ${pathname == '/' ? 'text-[#000068]' : 'text-gray-700'} font-bold hover:text-[#000068]`}>Beranda</a>

              {/* Program Dropdown */}
              <div className="relative w-full md:w-auto">
                <button 
                  onClick={(e) => toggleDropdown('program', e)}
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === 'program'}
                  className="cursor-pointer nav-link text-gray-700 w-full md:w-auto text-md font-bold hover:text-[#000068] flex items-center justify-between md:justify-start gap-1 focus:outline-none"
                >
                  Program
                  <svg 
                    className={`h-4 w-4 transform transition-transform duration-200 ${activeDropdown === 'program' ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`nav-dropdown relative md:absolute top-full left-0 mt-2 md:mt-4 w-full md:w-56 md:bg-white bg-transparent rounded-xl shadow-sm md:shadow-xl border border-gray-100 overflow-hidden z-50 flex-col transition-all ${activeDropdown === 'program' ? 'flex' : 'hidden'}`}>
                  <a href="#" className="block px-5 py-3 hover:bg-[#f4f4f9] hover:text-[#000068] text-sm text-gray-700 font-medium transition-colors border-b border-gray-50 last:border-none">Cambridge IGCSE</a>
                  <a href="#" className="block px-5 py-3 hover:bg-[#f4f4f9] hover:text-[#000068] text-sm text-gray-700 font-medium transition-colors border-b border-gray-50 last:border-none">SA Curriculum</a>
                  <a href="#" className="block px-5 py-3 hover:bg-[#f4f4f9] hover:text-[#000068] text-sm text-gray-700 font-medium transition-colors border-b border-gray-50 last:border-none">Merdeka Belajar</a>
                </div>
              </div>

              {/* Mentors Dropdown */}
              <div className="relative w-full md:w-auto">
                <button 
                  onClick={(e) => toggleDropdown('mentors', e)}
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === 'mentors'}
                  className={`cursor-pointer nav-link ${pathname.includes('mentor') ? 'text-[#000068]' : 'text-gray-700'}  w-full md:w-auto text-md font-bold hover:text-[#000068] flex items-center justify-between md:justify-start gap-1 focus:outline-none`}
                >
                  Mentor
                  <svg 
                    className={`h-4 w-4 transform transition-transform duration-200 ${activeDropdown === 'mentors' ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`nav-dropdown relative md:absolute top-full left-0 mt-2 md:mt-4 w-full md:w-56 md:bg-white bg-transparent rounded-xl shadow-sm md:shadow-xl border border-gray-100 overflow-hidden z-50 flex-col transition-all ${activeDropdown === 'mentors' ? 'flex' : 'hidden'}`}>
                  <a href="/mentor" className={`block px-5 py-3 ${pathname.includes('mentor') ? 'text-[#000068] bg-[#f4f4f9]' : 'text-gray-700'}  hover:bg-[#f4f4f9] hover:text-[#000068] text-sm font-medium transition-colors border-b border-gray-50 last:border-none`}>Temukan Mentor</a>
                  <a href="#" className="block px-5 py-3 text-gray-700 hover:bg-[#f4f4f9] hover:text-[#000068] text-sm font-medium transition-colors border-b border-gray-50 last:border-none">Daftar sebagai Mentor</a>
                </div>
              </div>

              <a href="/blog" className={`nav-link text-md ${pathname.includes('blog') ? 'text-[#000068]' : 'text-gray-700'} font-bold hover:text-[#000068]`}>Blog</a>
              <a href="/mentor/login" className="nav-link text-md text-gray-700 font-bold hover:text-[#000068]">Portal Mentor</a>
              <a href="/student/login" className="nav-link text-md text-gray-700 font-bold hover:text-[#000068]">Portal Siswa</a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden group-[.open]:flex md:block">
            <button className="px-5 py-2.5 bg-[#000068] hover:bg-[#01014d] text-white font-medium rounded-2xl transition-colors shadow-md">
              Konsultasi Gratis
            </button>
          </div>
          
        </div>
      </nav>
    </>
  );
}

// 2. Export the default component wrapped in Suspense
export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}