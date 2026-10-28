'use client';

import { useState, useEffect } from 'react';

const words = ["beautiful", "creative", "passionate", "innovative"];

export default function TextRotator() {
  const [index, setIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("translate-y-0 opacity-100 transition-all duration-500");

  useEffect(() => {
    const intervalId = setInterval(() => {
      // 1. Slide up and fade out
      setAnimationClass("-translate-y-full opacity-0 transition-all duration-500");

      setTimeout(() => {
        // 2. Change word
        setIndex((prevIndex) => (prevIndex + 1) % words.length);
        
        // 3. Snap to the bottom instantly (remove transition classes)
        setAnimationClass("translate-y-full opacity-0");

        // 4. Wait a tiny tick for the DOM to apply the snap, then slide up and fade in
        setTimeout(() => {
          setAnimationClass("translate-y-0 opacity-100 transition-all duration-500");
        }, 50); 
        
      }, 500); // Wait for the fade-out duration to complete

    }, 2500);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-gray-900 tracking-tight leading-tight">
      Meet our{" "}
      <span className="inline-flex overflow-hidden pb-1 -mb-1">
        <span 
          className={`text-[#000068] inline-block min-w-[200px] ${animationClass}`}
        >
          {words[index]}
        </span>
      </span>{" "}
      team
    </h1>
  );
}