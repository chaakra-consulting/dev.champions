export default function Footer() {
    return (
         <footer className="bg-[#f5f5f5] w-full py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">

            <div className="flex flex-col max-w-xs">
                <div className="flex flex-col text-[#0d3c36]">
                    <h3 className="text-3xl font-extrabold text-[#000068]">
                        Champions.
                    </h3>
                    <p className="text-sm text-gray-500"> Private Academic Advisory</p>
                </div>

                <p className="mt-4 text-[13px] text-gray-500 leading-relaxed font-medium">
                    Lorem ipsum dolor sit amet consectetur. Semper sit in viverra maecenas nisi nullam egestas. Ultrices
                    purus odio aliquet ut.
                </p>
            </div>

            <div className="flex flex-row flex-wrap md:flex-nowrap gap-12 md:gap-20 lg:gap-32 w-full md:w-auto">

                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-800 text-md mb-4">Features</h3>
                    <ul className="flex flex-col gap-3">
                        <li><a href="#"
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Link</a>
                        </li>
                        <li><a href="#"
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Link</a>
                        </li>
                        <li><a href="#"
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Link</a>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-800 text-md mb-4">Support</h3>
                    <ul className="flex flex-col gap-3">
                        <li><a href="#"
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Link</a>
                        </li>
                        <li><a href="#"
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Link</a>
                        </li>
                        <li><a href="#"
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Link</a>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-800 text-md mb-4">Legal</h3>
                    <ul className="flex flex-col gap-3">
                        <li><a href="#"
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Link</a>
                        </li>
                        <li><a href="#"
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Link</a>
                        </li>
                        <li><a href="#"
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium">Link</a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </footer>
    );
}