import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../../Service/APIconfig';
import { BsViewStacked } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const FacultyDetail = ({ facultyId, section }) => {

    const location = useLocation();
    const [faculty, setFaculty] = useState(null);
    const [socials, setSocials] = useState([]);
    const [facultyInfo, setFacultyInfo] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [researchProjects, setResearchProjects] = useState([]);
    const [currentLang, setCurrentLang] = useState(window.location.pathname.startsWith('/km') ? 2 : 1);

    useEffect(() => {
        const newLang = location.pathname.startsWith('/km') ? 2 : 1;
        if (newLang !== currentLang) {
            setCurrentLang(newLang);
        }
    }, [location.pathname]);

    useEffect(() => {
        const fetchFacultyDetail = async () => {
            try {
                const facultyRes = await axiosInstance.get(API_ENDPOINTS.getFaculty);
                const allFaculty = facultyRes.data?.data || [];
                const selectedFaculty = allFaculty.find(item => item.ref_id === Number(facultyId) && item.lang === currentLang);

                if (selectedFaculty) {
                    setFaculty({
                        name: selectedFaculty.f_name,
                        f_id: selectedFaculty.f_id,
                        ref_id: selectedFaculty.ref_id,
                        position: selectedFaculty.f_position,
                        image: selectedFaculty.img?.img
                            ? `${API}/storage/uploads/${selectedFaculty.img.img}`
                            : "/placeholder-icon.png",
                    });
                }

                // Fetch social icons
                // Note: faculty may not be set yet, so we use selectedFaculty
                const socialRes = await axiosInstance.get(API_ENDPOINTS.getSocial);
                const allSocials = socialRes.data?.data || [];
                const filteredSocials = allSocials.filter(social =>
                    social.social_faculty === parseInt(selectedFaculty?.f_id) &&
                    social.display === 1 &&
                    social.active === 1
                );
                setSocials(filteredSocials);
            } catch (error) {
                console.error("Error fetching faculty detail or socials:", error);
            }
        };
        fetchFacultyDetail();
    }, [facultyId, currentLang]);

    useEffect(() => {
        if (!faculty) return;

        const fetchFacultyInfo = async () => {
            try {
                const infoRes = await axiosInstance.get(API_ENDPOINTS.getFacultyInfo);
                const allInfo = infoRes.data?.data || [];
                const selectedInfo = allInfo.find(info =>
                    info.finfo_f === parseInt(faculty.f_id) &&
                    info.display === 1 &&
                    info.active === 1 &&
                    info.finfo_order === 1
                );

                if (selectedInfo) {
                    setFacultyInfo(selectedInfo);
                }
            } catch (error) {
                console.error("Error fetching faculty info:", error);
            }
        };

        const fetchFacultyContact = async () => {
            try {
                const contactRes = await axiosInstance.get(API_ENDPOINTS.getFacultyContact);
                const allContacts = contactRes.data?.data || [];
                const filteredContacts = allContacts.filter(contact =>
                    contact.fc_f === parseInt(faculty.f_id) &&
                    contact.display === 1 &&
                    contact.active === 1
                );
                setContacts(filteredContacts);
            } catch (error) {
                console.error("Error fetching faculty contacts:", error);
            }
        };

        const fetchFacultyBackground = async () => {
            try {
                const bgRes = await axiosInstance.get(API_ENDPOINTS.getFacultyBG);
                const allBackgrounds = bgRes.data?.data || [];
                const filteredBackgrounds = allBackgrounds.filter(bg =>
                    bg.fbg_f === parseInt(faculty.f_id) &&
                    bg.display === 1 &&
                    bg.active === 1
                );
                setBackgrounds(filteredBackgrounds);
            } catch (error) {
                console.error("Error fetching faculty backgrounds:", error);
            }
        };

        const fetchFacultyResearchProjects = async () => {
            try {
                const projectRes = await axiosInstance.get(API_ENDPOINTS.getFacultyInfo);
                const allProjects = projectRes.data?.data || [];
                const filteredProjects = allProjects.filter(project =>
                    project.finfo_f === parseInt(faculty.f_id) &&
                    Number(project.finfo_order) >= 2 &&
                    project.display === 1 &&
                    project.active === 1 &&
                    typeof project.finfo_detail === 'string' &&
                    project.finfo_detail.includes('<svg')
                );
                setResearchProjects(filteredProjects);
            } catch (error) {
                console.error("Error fetching faculty research projects:", error);
            }
        };

        fetchFacultyInfo();
        fetchFacultyContact();
        fetchFacultyBackground();
        fetchFacultyResearchProjects();
    }, [faculty]);

    return (
        <>
            {/* Faculty Profile */}
            <section className="bg-gray-50" >
                {/* <div style={{ display: 'none' }}>FacultyDetail component mounted</div> */}
                {/* Cover Photo Area */}
                <div className="bg-red-900 h-48 sm:h-64 md:h-72 lg:h-80 relative">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Social Icons for Mobile */}
                        {/* <div className="flex justify-center sm:hidden pt-4 ">
                            <div className="flex gap-3">
                                {socials.map(social => (
                                    <a
                                        key={social.social_id}
                                        href={social.social_link || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center bg-white rounded-full shadow-md p-2 border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <img
                                            src={social.img?.img ? `${API}/storage/uploads/${social.img.img}` : "/placeholder-icon.png"}
                                            alt="Social Icon"
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div> */}

                        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 pt-8 md:pt-12">
                            <div className="flex flex-1 items-end gap-4 w-full">
                                <div className="absolute md:static left-1/2 -bottom-16 md:bottom-auto transform -translate-x-1/2 md:translate-x-0">
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-white rounded-full overflow-hidden shadow-xl">
                                        <img
                                            src={faculty?.image}
                                            alt={faculty?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Profile Info */}
                                <div className="hidden md:flex flex-col ml-0 md:ml-6 flex-1 text-white pb-4">
                                    <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                                        {faculty?.name}
                                    </h1>
                                    <h2 className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"} text-base sm:text-lg lg:text-xl text-gray-200`}>
                                        {faculty?.position}
                                    </h2>
                                    <div className="mt-4">
                                        <div className="flex gap-3">
                                            {socials.map(social => (
                                                <a
                                                    key={social.social_id}
                                                    href={social.social_link || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center bg-white rounded-full shadow-md p-2.5 border border-gray-200 hover:bg-gray-100 transition-colors"
                                                >
                                                    <img
                                                        src={social.img?.img ? `${API}/storage/uploads/${social.img.img}` : "/placeholder-icon.png"}
                                                        alt="Social Icon"
                                                        className="w-6 h-6 object-contain items-center "
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button - Desktop */}
                            <div className="hidden md:flex items-center">
                                <button className="bg-white hover:bg-gray-100 text-red-900 px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-md text-sm sm:text-base">
                                    <BsViewStacked className={`text-base sm:text-lg`} />
                                    <span className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"}`} >{currentLang === 1 ? "View Portfolio" : "ប្រវត្តិរូបការងារ"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Profile Info */}
                <div className="md:hidden pt-20 sm:pt-24 px-4 text-center">
                    <h1 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                        {faculty?.name}
                    </h1>
                    <h2 className={`text-base sm:text-lg text-gray-600 my-4 ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>
                        {faculty?.position}
                    </h2>
                    <div className="flex justify-center mb-4">
                        <div className="flex gap-3">
                            {socials.map(social => (
                                <a
                                    key={social.social_id}
                                    href={social.social_link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center bg-white rounded-full shadow-md p-2 border border-gray-200 hover:bg-gray-100 transition-colors"
                                >
                                    <img
                                        src={social.img?.img ? `${API}/storage/uploads/${social.img.img}` : "/placeholder-icon.png"}
                                        alt="Social Icon"
                                        className="w-6 h-6 rounded-full object-contain p-0.5"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                    <button className="w-full max-w-xs mx-auto bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base">
                        <BsViewStacked className="text-base sm:text-lg" />
                            <span className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"}`} >{currentLang === 1 ? "View Portfolio" : "ប្រវត្តិរូបការងារ"}</span>
                    </button>
                </div>
            </section>

            {/* Main Content */}
            <div className=" container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 py-8">
                {/* Main Section */}
                <div className="max-w-4xl w-full flex-1">
                    <section className="my-8 sm:my-12 ">
                        <div className=" mx-auto space-y-6 px-4 sm:px-0">
                            {/* About Section */}
                            {facultyInfo && (
                                <section className="space-y-4 px-6">
                                    <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                                        {facultyInfo.finfo_title}
                                    </h2>
                                    <div
                                        className={`space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base ${currentLang === 2 ? "fonts-khmer" : "font-sans"} `}
                                        dangerouslySetInnerHTML={{ __html: facultyInfo.finfo_detail }}
                                    ></div>
                                </section>
                            )}

                            <div className="border-t border-gray-200 my-6"></div>

                            {/* Contact Section */}
                            {contacts.length > 0 && (
                                <div className="space-y-4 px-6">
                                    <h3 className={`text-2xl sm:text-3xl font-bold text-gray-900 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                                        {currentLang === 1 ? "Contact Info" : "ព័ត៌មានទំនាក់ទំនង"}
                                    </h3>
                                    <div className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>
                                        {contacts.map(contact => (
                                            <p
                                                key={contact.fc_id}
                                                className="text-red-700 hover:text-red-600 px-4 py-2 bg-pink-100 rounded-full transition-colors text-sm sm:text-base"
                                            >
                                                <span className={`font-normal ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>{contact.fc_name}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Research Projects Section in left side */}
                            {researchProjects.length >= 1 && researchProjects.some((project, index) => {
                                return project.finfo_side === 1;
                            }) && (
                                <div>
                                    {researchProjects.filter(project => project.finfo_side === 1).map((project) => (
                                        <section key={project.finfo_id || `${project.finfo_f}-${project.finfo_order}`} className="my-8 sm:my-12 ">
                                            <div className="bg-white rounded-xl shadow-md ">
                                                <div className=" mx-auto p-4 sm:p-6">
                                                    <div className="py-4">
                                                        <section className="space-y-4">
                                                            <h2 className={`${currentLang === 2 ? 'font-khmer' : 'font-semibold'} text-2xl sm:text-3xl font-bold text-gray-900`}>
                                                                {project.finfo_title}
                                                            </h2>
                                                            <div
                                                                className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"} space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base`}
                                                                dangerouslySetInnerHTML={{ __html: project.finfo_detail }}
                                                            ></div>
                                                        </section>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="max-w-xl w-full px-4">
                    <div className="my-8 sm:my-12">
                        <div className=" bg-white rounded-xl shadow-md p-4 sm:p-6">
                            <h2 className={`text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-800 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                                {currentLang === 1 ? "Background" : "ប្រវត្តិនៃការសិក្សា"}
                            </h2>
                            {backgrounds.length > 0 && backgrounds.map((bg) => (
                                <div key={bg.fbg_id} className=" flex items-center mb-4">
                                    <img
                                        src={bg.img?.img ? `${API}/storage/uploads/${bg.img.img}` : "/placeholder-icon.png"}
                                        alt={bg.fbg_name}
                                        className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className={` ${currentLang === 2 ? "fonts-khmer" : "font-sans"} text-gray-700 text-sm sm:text-base`}>{bg.fbg_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {researchProjects.length >= 1 && researchProjects.some((project, index) => {
                        return project.finfo_side === 2;
                    }) && (
                        <div>
                            {researchProjects.filter(project => project.finfo_side === 2).map((project) => (
                                <div key={project.finfo_id || `${project.finfo_f}-${project.finfo_order}`} className=" my-8 sm:my-12">
                                    <div className="bg-red-800 rounded-xl p-6  text-white">
                                        <div className="py-4">
                                        <section className="space-y-4">
                                            <h2 className={`${currentLang === 2 ? 'font-khmer' : 'font-semibold'} text-2xl sm:text-3xl font-semibold `}>
                                            {project.finfo_title}
                                            </h2>
                                            <div
                                            className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"} space-y-4 text-gray-50 leading-relaxed text-sm sm:text-base`}
                                            dangerouslySetInnerHTML={{ __html: project.finfo_detail }}
                                            ></div>
                                        </section>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default FacultyDetail;