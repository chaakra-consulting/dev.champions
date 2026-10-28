"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";

// Export this interface so the parent page can use it for the data array
export interface TeamMember {
    name: string;
    role: string;
    img: string;
}

interface TeamCardProps {
    member: TeamMember;
}

function TeamCard({ member }: TeamCardProps) {
    return (
        <li className="splide__slide group relative transition-all duration-500 ease-out cursor-pointer 
            grayscale opacity-80 translate-y-0 scale-[0.96] 
            [&.is-prev]:-translate-y-5 [&.is-next]:-translate-y-5 
            [&.is-prev]:scale-[0.98] [&.is-next]:scale-[0.98] 
            [&.is-active]:grayscale-0 [&.is-active]:opacity-100
            [&:-has(~_.is-prev)]:-translate-y-2
            [.is-next_~_&]:-translate-y-2
            [&.is-active]:-translate-y-8 [&.is-active]:scale-[1.04] [&.is-active]:z-10">
            
            <div className="glow absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-amber-100 blur-2xl opacity-0 transition-opacity duration-500 ease-out -z-10 rounded-xl group-[.is-active]:opacity-70 pointer-events-none"></div>
            
           
            <div className="relative w-full aspect-[0.83/1] rounded-xl overflow-hidden border border-neutral-200 shadow-sm transition-all duration-500 group-[.is-active]:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.35)] bg-neutral-300">
                
                {member.img ? (
                    <Image 
                        src={member.img} 
                        alt={`Portrait of ${member.name}`} 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover z-10" 
                       
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200 z-10 relative">
                        <span className="text-neutral-400 font-medium text-sm">No Image</span>
                    </div>
                )}
                
                <div className="absolute bottom-3 inset-x-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 px-3 py-2 flex flex-col justify-center z-20">
                    <p className="text-xs font-semibold text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_80%)] leading-tight mb-0.5">{member.name}</p>
                    <p className="text-xs text-white/70 [text-shadow:_0_1px_2px_rgb(0_0_0_/_80%)] leading-tight">{member.role}</p>
                </div>
            </div>
        </li>
    );
}

interface TeamCarouselProps {
    teamData: TeamMember[];
}

export default function MentorCarousel({ teamData }: TeamCarouselProps) {
    const [isMounted, setIsMounted] = useState(false);
    const splideRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !splideRef.current || !teamData || teamData.length === 0) return;

        const splide = new Splide(splideRef.current, {
            type: 'loop',
            perPage: 5,
            focus: 'center',
            gap: '1rem',
            arrows: false,
            pagination: false,
            drag: true,
            speed: 600,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            autoplay: true,
            interval: 2000,
            pauseOnHover: true,
            start: 2,
            breakpoints: {
                1024: { perPage: 3 },
                640: { perPage: 1, padding: '2.5rem' }
            }
        });

        splide.mount();

        splide.on('click', function (slide) {
            splide.go(slide.index);
        });

        return () => {
            splide.destroy();
        };
    }, [isMounted, teamData]);

    if (!isMounted) {
        return <div className="w-full max-w-6xl mx-auto px-12 sm:px-16 mt-14 mb-10 min-h-[300px]" />;
    }

    return (
        <div ref={splideRef} className="splide w-full max-w-6xl mx-auto px-12 sm:px-16 mt-14 mb-10">
            <div className="splide__track pt-12 pb-12 overflow-visible">
                <ul className="splide__list">
                    {teamData.map((member, index) => (
                        <TeamCard key={index} member={member} />
                    ))}
                </ul>
            </div>
        </div>
    );
}