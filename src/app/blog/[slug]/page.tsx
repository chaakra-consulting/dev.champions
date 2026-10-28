import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";

export default function Blog() {
    return (
        <>
        <Navbar />
<section id="heroSection"
        className="relative w-full px-6 md:px-10 pt-[120px] md:pt-[10%] justify-between flex flex-col">

    </section>
         <section className=" w-full justify-between flex flex-col">
        <div className="flex flex-col  px-6 md:px-10 py-8 md:py-12 justify-center items-center mx-auto">
            <h1 className="text-4xl md:text-[2.5rem] text-center leading-tight font-bold text-gray-900 mb-8 tracking-tight">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
            </h1>
            <p className="text-md text-gray-600">By Admin | 20 Oct 2026</p>
        </div>
        <div className="relative w-full max-w-7xl mx-auto">
            <div 
                className="relative rounded-[1.5rem] overflow-hidden bg-[#000068] shadow-2xl h-[420px] flex items-center justify-center">
            </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <article className=" w-full">
                <div className="prose prose-lg prose-gray max-w-none">
                    <div
                        className="max-w-5xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row gap-8 md:gap-16 font-sans text-gray-800">


                        <article className="flex-1 max-w-4xl">



                            <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-justify">
                                Text
                            </div>



                        </article>
                    </div>
                </div>
            </article>
        </div>
    </section>
        <Footer />
        </>
    );
}