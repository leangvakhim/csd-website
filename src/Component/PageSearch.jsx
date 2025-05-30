import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdSearch } from "react-icons/io";

const PageSearch = ({ onToggle, data }) => {
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef(null);
    const currentLang = location.pathname.startsWith('/km') ? 2 : 1;
    const [isLoading, setIsLoading] = useState(false);

    const toggleSearch = () => {
        onToggle(); // Toggle search state in Header component
        if (!inputRef.current) return;
        if (!inputRef.current.value) {
        setQuery(""); // Clear input when closing
        }
        setTimeout(() => inputRef.current?.focus(), 10); // Focus the input when opened
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setQuery(""); // Clear the search input
        }
        };

        const handleEscape = (e) => {
        if (e.key === "Escape") {
            setQuery(""); // Clear the search input
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const [filteredData, setFilteredData] = useState([]);

    // Helper to normalize data from all content types
    const normalizeData = (data) => {
        if (!Array.isArray(data)) return [];

        return data
            .filter(item => item.display === 1 && item.active === 1)
            .map(item => {
                let type = "";
                let title = "";
                let subtitle = "";
                let id = item.ref_id;
                let lang = item.lang || 1;
                let link = "";

                if (item.f_name) {
                    type = "faculty";
                    title = item.f_name;
                    subtitle = item.f_position || "Faculty";
                    link = `/faculty/${id}`;
                } else if (item.e_title) {
                    type = "event";
                    title = item.e_title;
                    subtitle = "Event";
                    link = `/event/${id}`;
                } else if (item.rsdl_title) {
                    type = "researchlab";
                    title = item.rsdl_title;
                    subtitle = "Research Lab";
                    link = `/researchlab/${id}`;
                } else if (item.rsd_title) {
                    type = "research";
                    title = item.rsd_title;
                    subtitle = "Research";
                    link = `/research/${id}`;
                } else if (item.n_title) {
                    type = "news";
                    title = item.n_title;
                    subtitle = "News";
                    link = `/news/${id}`;
                } else if (item.am_title) {
                    type = "announcement";
                    title = item.am_title;
                    subtitle = "Announcement";
                    link = `/announcement/${id}`;
                } else if (item.sc_title) {
                    type = "scholarship";
                    title = item.sc_title;
                    subtitle = item.sc_sponsor || "Scholarship";
                    link = `/scholarship/${id}`;
                } else if (item.c_title) {
                    type = "career";
                    title = item.c_title;
                    subtitle = item.c_shorttitle || "Career";
                    link = `/career/${id}`;
                }

                return { type, title, subtitle, id, lang, link };
            });
    };

    // Update filtered data when searchTerm changes
    useEffect(() => {
        if (!data || !Array.isArray(data)) {
            setFilteredData([]);
            return;
        }

        const allData = normalizeData(data);
        const filtered = allData.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setIsLoading(true);
        setTimeout(() => {
            setFilteredData(filtered);
            setIsLoading(false);
        }, 300); // simulate loading delay
    }, [searchTerm, data]);


    return (
        <div className="relative flex flex-col justify-center items-center w-full" ref={containerRef}>
        <motion.div
            className="relative flex items-center w-full min-w-[300px] max-w-6xl"
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Input Field */}
            <motion.div className="relative flex items-center w-full">
            <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchTerm(e.target.value);
                }}
                className="w-full px-6 py-4 rounded-lg border bg-white border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            <div className="text-2xl absolute right-6 text-gray-500">
                <IoMdSearch />
            </div>
            </motion.div>
        </motion.div>

        {/* Search Results (Same width as input field) */}
        {query && (
            <div className="absolute top-14 w-full min-w-[300px] max-w-6xl bg-gray-50 border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto z-50">

                {isLoading && (
                    <div className=" w-full max-w-6xl flex z-50 justify-center">
                        <div className=" p-4 rounded-lg">
                            <svg aria-hidden="true" class="w-5 h-5 text-gray-300 animate-spin fill-red-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                        </div>
                    </div>
                )}

                <div className="w-full">
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <div
                                key={index}
                                className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                                onClick={() => (window.location.href = item.link)}
                            >
                                <h1 className={`!font-semibold !text-[15px] ${currentLang === 2 ? 'fonts-khmer' : 'font-semibold'}`}>
                                {(() => {
                                    const index = item.title.toLowerCase().indexOf(searchTerm.toLowerCase());
                                    if (index === -1) return item.title;
                                    const before = item.title.substring(0, index);
                                    const match = item.title.substring(index, index + searchTerm.length);
                                    const after = item.title.substring(index + searchTerm.length);
                                    return (
                                    <>
                                        {before}
                                        <span className={`bg-red-200 `}>{match}</span>
                                        {after}
                                    </>
                                    );
                                })()}
                                </h1>
                                <div className={`text-sm text-gray-500 mt-2 ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}>{item.subtitle}</div>
                            </div>
                        ))
                    ) : (
                        <div className={`px-4 py-2 text-gray-500`}>No results found</div>
                    )}
                </div>
                </div>
            )}
            </div>
        );
    };

export default PageSearch