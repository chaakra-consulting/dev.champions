import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";

export default function Blogs() {
    return (
        <>
        <Navbar />
         <section id="heroSection"
        className="relative w-full px-6 md:px-10 pt-[120px] md:pt-[10%] justify-between flex flex-col">
        <div className="relative w-full max-w-7xl mx-auto pb-16">
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">

                <h1 className=" text-gray-800 text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-3xl">
                    Blog Artikel
                </h1>

                <div className="max-w-3xl">
                    <h3 className="text-gray-600 text-xl mt-4 leading-relaxed">
                        Temukan berbagai artikel menarik seputar pendidikan, tips belajar, dan wawasan akademik lainnya
                        di blog kami. Dapatkan informasi terbaru dan bermanfaat untuk mendukung perjalanan akademik
                        Anda.
                    </h3>
                </div>
            </div>
        </div>
    </section>
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-10 md:pb-16" id="article-container">

        <a href="blog/slug-slug" className="flex w-full h-full group transition-transform ease-in-out duration-300 sr-bottom">
            <div
                className="w-full h-full flex flex-col max-w-screen rounded-[15px] bg-[#f3f3f3] group-hover:bg-gray-900 ease-in-out transition overflow-hidden">

                <div className="relative shrink-0">
                    <img src="https://images.unsplash.com/photo-1758876201697-900bf5868575?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                        alt="article.slug"
                        className="aspect-4/2 w-full object-cover h-[15rem] group-hover:h-[10rem] transition-all ease-in-out duration-300" />
                    <span
                        className="absolute left-4 top-4 rounded-xl bg-[#ffdc59] px-4 py-1.5 text-[15px] font-semibold text-black">
                        Tag
                    </span>
                </div>

                <div className="px-5 pb-6 pt-6 flex flex-col flex-grow">
                    <h2
                        className="text-[26px] font-bold leading-[1.2] tracking-tight ease-in-out transition group-hover:text-white text-gray-800">
                        Test..
                    </h2>
                    <div className="w-full h-24 overflow-clip transition-all ease-in-out duration-300 group-hover:h-auto">
                        <p
                            className="mt-3 text-[17px] leading-[1.6] group-hover:text-white/90 text-[#666666] whitespace-pre-line">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum quasi velit perferendis
                            expedita. Nostrum impedit, vel, tenetur molestias nulla deleniti maxime ab amet error dicta
                            illum soluta. Consequatur, itaque illo?
                        </p>
                    </div>
                    <p className="mt-auto pt-4 text-[10px] leading-[1.6] text-[#868686]">
                        <span>Admin</span> | <span> 20 Oct 2026</span>
                    </p>
                </div>
            </div>
        </a>
    </section>
    <Footer />
        </>
    );
}