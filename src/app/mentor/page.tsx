import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";
import TextRotator from "@/components/landing-page/text-rotator";
import MentorCarousel,{TeamMember} from "@/components/landing-page/mentor-carousel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Champions by Chaakra - Mentor ",
  description: "Online course website",
};

const team: TeamMember[] = [
    { name: "Olivia Martinez", role: "Mentor", img: "https://i.pravatar.cc/400?img=47" },
    { name: "Richard Mills", role: "Mentor", img: "https://i.pravatar.cc/400?img=11" },
    { name: "Layla Evans", role: "Mentor", img: "https://i.pravatar.cc/400?img=5" },
    { name: "Viola Bassett", role: "Mentor", img: "https://i.pravatar.cc/400?img=44" },
    { name: "Erik Anders", role: "Mentor", img: "https://i.pravatar.cc/400?img=60" },
    { name: "Thomas Wayne", role: "Mentor", img: "https://i.pravatar.cc/400?img=68" },
    { name: "Sarah Jenkins", role: "Mentor", img: "https://i.pravatar.cc/400?img=49" },
    { name: "Marcus Cole", role: "Mentor", img: "https://i.pravatar.cc/400?img=59" }
];
export default function Mentor() {
    return (
        <>
        <Navbar />
        <section className="flex flex-col justify-center items-center  pt-36 md:px-16 px-6 mb-20 w-full">
        <TextRotator />

        <p className="max-w-2xl text-lg md:text-xl text-gray-500 leading-relaxed text-center mt-6">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat provident eum minima fugiat, aspernatur
            earum labore sed ab est ipsa suscipit officiis
        </p>
        <div className="flex flex-row gap-4 pt-6">
            <button
                className="px-5 py-2.5 bg-white hover:bg-[#01014d] border-[#000068] border-[0.5px] hover:text-white text-[#000068] font-medium rounded-3xl transition-colors shadow-md w-max">
                Apply as Mentor
            </button>
            <button
                className="px-5 py-2.5 bg-[#000068] hover:bg-[#01014d] text-white font-medium rounded-3xl transition-colors shadow-md w-max">
                Get Started
            </button>

        </div>
       <MentorCarousel teamData={team} />

    </section>
        <Footer />
        </>
    );
}