import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Champions by Chaakra",
  description: "Online course website",
};
export default function Home() {
  return (
    <>
      <Navbar />
      <section
        id="home"
        className="flex md:flex-row flex-col justify-between  pt-28 md:px-16 px-6"
      >
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between gap-6  mx-auto">
          <div className="flex flex-col w-full gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#181524]  leading-tight">
                A new <span className="text-[#000068]">way</span> to learn & Get{" "}
                <span className="text-[#000068]">Knowledge</span>
              </h1>
            </div>
            <p className="text-gray-700 text-lg md:text-xl  md:max-w-[40vw] max-w-max">
              Champions is here for you with various subject to offer, and
              multiple curriculums such as Cambridge, SA, etc. Offfers trusted
              mentors and private sessions to create mindfull learning sessions
            </p>
            <div className="flex flex-row gap-4">
              <button className="px-5 py-2.5 bg-[#000068] hover:bg-[#01014d] text-white font-medium rounded-2xl transition-colors shadow-md w-max">
                Learn More
              </button>
            </div>
          </div>
        </div>

        <div className="md:w-[37vw] w-full h-full md:mt-0 mt-8">
          <img
            src="img/home-section.webp"
            alt="Home Section Image"
            className="w-full object-cover"
          />
        </div>
      </section>
      <section
        id="feature"
        className="md:px-16 px-6 flex flex-col mt-20 max-w-[100vw]"
      >
        <h1 className="text-5xl font-extrabold text-[#181524] leading-tight mx-auto">
          Learn. Grow. <span className="text-[#000068]">Achieve</span>
        </h1>
        <p className="text-gray-700 text-lg md:text-xl md:max-w-[50vw] max-w-max md:mx-auto  md:text-center text-start">
          Champions offer private session with trusted mentor to help student
          learn and grow
        </p>
        <div className="flex flex-col md:flex-row mx-auto mt-10">
          <div className="flex flex-col">
            <div className=" w-full h-full -mt-20 hidden md:block">
              <img src="img/arrow-1.webp" alt="" srcSet="" />
            </div>
            <div className="md:-mt-20 pb-10 mt-0 flex flex-col justify-center items-center mx-auto">
              <h1 className="text-[70px] font-light text-[#181524] leading-tight">
                100+
              </h1>
              <h1 className=" text-xl font-light text-[#181524] leading-tight">
                Siswa Aktif
              </h1>
            </div>
          </div>
          <div className="md:w-[60vw] w-full h-full">
            <img
              src="img/feature.webp"
              alt="Feature Image"
              className="w-full object-cover rounded-4xl"
            />
          </div>
          <div className="flex flex-col">
            <div className=" w-full h-full -mt-20 hidden md:block">
              <img src="img/arrow-2.webp" alt="" srcSet="" />
            </div>
            <div className="md:-mt-20 pb-10 mt-0 flex flex-col justify-center items-center mx-auto">
              <h1 className="text-[70px] font-light text-[#181524] leading-tight">
                50+
              </h1>
              <h1 className=" text-xl font-light text-[#181524] leading-tight">
                Mentor Terpercaya
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section
        id="strength"
        className="md:px-16 px-6 flex flex-col max-w-[100vw] mt-20"
      >
        <h1 className="text-5xl font-extrabold text-[#181524] leading-tight mb-10">
          How it <span className="text-[#000068]">Works</span>?
        </h1>

        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8 lg:p-12 flex flex-col lg:flex-row gap-10 justify-between items-start w-full">
          <div className="flex flex-col items-center text-center flex-1 w-full">
            <div className="bg-[#000068] w-20 h-20 rounded-[1.25rem] flex items-center justify-center text-white mb-6">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-[1.15rem] font-bold text-[#181524] mb-3 leading-snug">
              1-on-1 Mentorship
            </h3>
            <p className="text-[#6B7280] text-sm leading-relaxed px-2">
              Kurikulum dan kecepatan belajar disesuaikan 100% dengan kebutuhan
              siswa.
            </p>
          </div>

          <div className="flex flex-col items-center text-center flex-1 w-full">
            <div className="bg-[#000068] w-20 h-20 rounded-[1.25rem] flex items-center justify-center text-white mb-6">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-[1.15rem] font-bold text-[#181524] mb-3 leading-snug">
              Special Project
            </h3>
            <p className="text-[#6B7280] text-sm leading-relaxed px-2">
              Program Pendampingan khusus Pembuatan Projek, Lomba akademik.
            </p>
          </div>

          <div className="flex flex-col items-center text-center flex-1 w-full">
            <div className="bg-[#000068] w-20 h-20 rounded-[1.25rem] flex items-center justify-center text-white mb-6">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
            </div>
            <h3 className="text-[1.15rem] font-bold text-[#181524] mb-3 leading-snug">
              Critical Thinking &<br />
              Concept Deep-Dive
            </h3>
            <p className="text-[#6B7280] text-sm leading-relaxed px-2">
              Fokus pada pemahaman konsep mendalam dan kemampuan analisis.
            </p>
          </div>

          <div className="flex flex-col items-center text-center flex-1 w-full">
            <div className="bg-[#000068] w-20 h-20 rounded-[1.25rem] flex items-center justify-center text-white mb-6">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-[1.15rem] font-bold text-[#181524] mb-3 leading-snug">
              4-Way Parent-Mentor-
              <br />
              Student-Psikolog Synergy
            </h3>
            <p className="text-[#6B7280] text-sm leading-relaxed px-2">
              Ekosistem komunikasi aktif antara orang tua, psikolog, mentor, dan
              siswa.
            </p>
          </div>
        </div>
      </section>
      <section
        id="testimonial"
        className="md:px-16 px-6 flex md:flex-row flex-col justify-between mt-20"
      >
        <div className="flex flex-col gap-5 md:mt-[30vh] mt-0">
          <p className="text-xl font-light text-[#181524] leading-tight">
            Testimonial
          </p>
          <div className="md:w-[45vw] w-full flex flex-col gap-4">
            <h1 className="text-5xl font-extrabold text-[#181524] ">
              What Parents <span className="text-[#000068]">Says</span> About{" "}
              <span className="text-[#000068]">Us</span>
            </h1>
            <p className="text-md font-light text-[#181524] leading-tight">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est
              debitis voluptate a veniam architecto, suscipit nisi cum iste,
              sunt sint, dolorem ea aliquid placeat dolor inventore repellendus
              corporis sit minus.
            </p>
          </div>
          <button className="group relative flex h-14 w-48 items-center justify-between border-2 border-[#000068] rounded-4xl pl-6 pr-0 overflow-hidden">
            <span className="absolute inset-y-0 right-0 w-0 rounded-4xl bg-[#000068] transition-all duration-300 ease-in-out group-hover:w-full"></span>

            <span className="relative z-10 text-md font-semibold text-[#000068] transition-colors duration-300 ease-in-out group-hover:text-white">
              View All
            </span>

            <span className="relative z-10 rounded-4xl flex h-full w-14 items-center justify-center bg-[#000068] text-white">
              <svg
                className="h-5 w-5 -rotate-[40deg] transition-transform duration-300 ease-in-out group-hover:-rotate-[0deg]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
          </button>
        </div>
        <div className="grid grid-flow-row gap-6 p-8 bg-gray-50 overflow-x-auto">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 w-full max-w-lg flex flex-col justify-between">
            <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
              “Sapien eget at cras vitae risus curabitur ac interdum. Eget neque
              a id amet blandit lectus. Aliquam velit fermentum nulla egestas in
              duis.”
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-slate-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-base leading-tight">
                    Windah Putri
                  </h4>
                  <span className="text-gray-400 text-sm">Parents</span>
                </div>
              </div>
              <svg
                className="w-10 h-10 text-gray-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 w-full max-w-lg flex flex-col justify-between">
            <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
              “Sapien eget at cras vitae risus curabitur ac interdum. Eget neque
              a id amet blandit lectus. Aliquam velit fermentum nulla egestas in
              duis.”
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-slate-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-base leading-tight">
                    Windah Putri
                  </h4>
                  <span className="text-gray-400 text-sm">Parents</span>
                </div>
              </div>
              <svg
                className="w-10 h-10 text-gray-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 w-full max-w-lg flex flex-col justify-between">
            <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
              “Sapien eget at cras vitae risus curabitur ac interdum. Eget neque
              a id amet blandit lectus. Aliquam velit fermentum nulla egestas in
              duis.”
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-slate-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-base leading-tight">
                    Windah Putri
                  </h4>
                  <span className="text-gray-400 text-sm">Parents</span>
                </div>
              </div>
              <svg
                className="w-10 h-10 text-gray-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          </div>
        </div>
      </section>
      <section
        id="pricing"
        className="flex flex-col md:px-16 px-6 gap-12 mt-20"
      >
        <div className="flex flex-col gap-5 mx-auto">
          <p className="text-xl font-light text-[#181524] leading-tight text-center">
            Pricing
          </p>
          <div className="md:w-[30vw] w-full flex flex-col gap-4">
            <h1 className="text-6xl font-extrabold text-[#181524] text-center">
              {" "}
              <span className="text-[#000068]">Ready</span> to Accelerate?
            </h1>
            <p className="text-md font-light text-[#181524] leading-tight text-center">
              Lorem ipsum laoreet aenean massa nec donec leo netus semper.
            </p>
          </div>
        </div>
        <div className="grid md:grid-flow-col grid-flow-row gap-8 justify-center items-start">
          <div className="bg-white rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-10 max-w-[400px] w-full">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-[72px] h-[72px] bg-[#E3E3E3] rounded-[20px] flex items-center justify-center shrink-0">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2.5 7L12 12L21.5 7L12 2Z" fill="#04015D" />
                  <path
                    d="M2.5 8.5V17.5L12 22.5V13.5L2.5 8.5Z"
                    fill="#0D0984"
                  />
                  <path
                    d="M21.5 8.5V17.5L12 22.5V13.5L21.5 8.5Z"
                    fill="#04015D"
                  />
                </svg>
              </div>
              <h1 className="text-[32px] font-extrabold text-[#11101E] tracking-tight">
                Exam Prep
              </h1>
            </div>

            <h2 className="text-[22px] font-bold text-[#11101E] mb-3">
              10-Hour Credit Bundle
            </h2>

            <p className="text-[#A1A1A5] text-[15px] leading-relaxed mb-8 pr-4">
              Lorem ipsum laoreet aenean massa nec donec leo netus semper.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[#04015D] flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-[#11101E] font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[#04015D] flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-[#11101E] font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[#04015D] flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-[#11101E] font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[#04015D] flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-[#11101E] font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
            </ul>

            <button className="bg-[#04015D] hover:bg-[#07028A] text-white font-semibold text-[15px] py-3.5 px-6 rounded-full flex items-center gap-3 transition-colors duration-200">
              Get Started
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </button>
          </div>
          <div className="bg-[#04015D] rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-10 max-w-[400px] w-full">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center shrink-0">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2.5 7L12 12L21.5 7L12 2Z" fill="#04015D" />
                  <path
                    d="M2.5 8.5V17.5L12 22.5V13.5L2.5 8.5Z"
                    fill="#0D0984"
                  />
                  <path
                    d="M21.5 8.5V17.5L12 22.5V13.5L21.5 8.5Z"
                    fill="#04015D"
                  />
                </svg>
              </div>
              <h1 className="text-[32px] font-extrabold text-white tracking-tight">
                Exam Prep
              </h1>
            </div>

            <h2 className="text-[22px] font-bold text-white mb-3">
              10-Hour Credit Bundle
            </h2>

            <p className="text-[#A1A1A5] text-[15px] leading-relaxed mb-8 pr-4">
              Lorem ipsum laoreet aenean massa nec donec leo netus semper.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-[#04015D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-white font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-[#04015D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-white font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-[#04015D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-white font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-[#04015D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-white font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
            </ul>

            <button className="bg-white hover:bg-[#F0F0F0] text-[#04015D] font-semibold text-[15px] py-3.5 px-6 rounded-full flex items-center gap-3 transition-colors duration-200">
              Get Started
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </button>
          </div>
          <div className="bg-white rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-10 max-w-[400px] w-full">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-[72px] h-[72px] bg-[#E3E3E3] rounded-[20px] flex items-center justify-center shrink-0">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2.5 7L12 12L21.5 7L12 2Z" fill="#04015D" />
                  <path
                    d="M2.5 8.5V17.5L12 22.5V13.5L2.5 8.5Z"
                    fill="#0D0984"
                  />
                  <path
                    d="M21.5 8.5V17.5L12 22.5V13.5L21.5 8.5Z"
                    fill="#04015D"
                  />
                </svg>
              </div>
              <h1 className="text-[32px] font-extrabold text-[#11101E] tracking-tight">
                Exam Prep
              </h1>
            </div>

            <h2 className="text-[22px] font-bold text-[#11101E] mb-3">
              10-Hour Credit Bundle
            </h2>

            <p className="text-[#A1A1A5] text-[15px] leading-relaxed mb-8 pr-4">
              Lorem ipsum laoreet aenean massa nec donec leo netus semper.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[#04015D] flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-[#11101E] font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[#04015D] flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-[#11101E] font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[#04015D] flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-[#11101E] font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[#04015D] flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-[#11101E] font-semibold text-[15px]">
                  Lorem ipsum laoreet
                </span>
              </li>
            </ul>

            <button className="bg-[#04015D] hover:bg-[#07028A] text-white font-semibold text-[15px] py-3.5 px-6 rounded-full flex items-center gap-3 transition-colors duration-200">
              Get Started
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </section>
      <section className="mt-20 md:px-16 px-6">
        <div className="bg-[#04015D] flex flex-col p-8 gap-4 rounded-[20px] w-full md:h-[15rem] h-[18rem] mb-20">
          <h1 className="md:text-4xl text-2xl font-extrabold text-white text-center">
            Raih Keunggulan Akademik Berstandar Global Hari Ini{" "}
          </h1>
          <div className="md:w-[45vw] w-full  mx-auto">
            <p className="md:text-xl text-md font-light text-white leading-tight text-center">
              Lorem ipsum dolor sit amet consectetur. Pharetra dolor eget at
              sollicitudin tortor vitae. Nunc velit non.
            </p>
          </div>
          <button className="bg-white hover:bg-[#F0F0F0] text-[#04015D] font-semibold text-[15px] py-3.5 px-6 rounded-full flex items-center gap-3 transition-colors duration-200 w-50 mx-auto">
            Hubungi Kami
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </button>
        </div>
      </section>
      <Footer/>
    </>
  );
}
