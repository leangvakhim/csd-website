import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { BsViewStacked } from "react-icons/bs";

const FacultyDetail = ({ facultyId }) => {
    const [faculty, setFaculty] = useState(null);
    const [socials, setSocials] = useState([]);
    const [facultyInfo, setFacultyInfo] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [researchProjects, setResearchProjects] = useState([]);

    useEffect(() => {
        const fetchFacultyDetail = async () => {
            try {
                const facultyRes = await axios.get(API_ENDPOINTS.getFaculty);
                const allFaculty = facultyRes.data?.data || [];
                const selectedFaculty = allFaculty.find(item => item.f_id === parseInt(facultyId));

                if (selectedFaculty) {
                    setFaculty({
                        name: selectedFaculty.f_name,
                        position: selectedFaculty.f_position,
                        image: selectedFaculty.img?.img
                            ? `${API}/storage/uploads/${selectedFaculty.img.img}`
                            : "/placeholder-icon.png",
                    });
                }

                // Fetch social icons
                const socialRes = await axios.get(API_ENDPOINTS.getSocial);
                const allSocials = socialRes.data?.data || [];
                const filteredSocials = allSocials.filter(social =>
                    social.social_faculty === parseInt(facultyId) &&
                    social.display === 1 &&
                    social.active === 1
                );
                setSocials(filteredSocials);
            } catch (error) {
                console.error("Error fetching faculty detail or socials:", error);
            }
        };
        const fetchFacultyInfo = async () => {
            try {
                const infoRes = await axios.get(API_ENDPOINTS.getFacultyInfo);
                const allInfo = infoRes.data?.data || [];
                const selectedInfo = allInfo.find(info =>
                    info.finfo_f === parseInt(facultyId) &&
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
                const contactRes = await axios.get(API_ENDPOINTS.getFacultyContact);
                const allContacts = contactRes.data?.data || [];
                const filteredContacts = allContacts.filter(contact =>
                    contact.fc_f === parseInt(facultyId) &&
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
                const bgRes = await axios.get(API_ENDPOINTS.getFacultyBG);
                const allBackgrounds = bgRes.data?.data || [];
                const filteredBackgrounds = allBackgrounds.filter(bg =>
                    bg.fbg_f === parseInt(facultyId) &&
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
                const projectRes = await axios.get(API_ENDPOINTS.getFacultyInfo);
                const allProjects = projectRes.data?.data || [];
                const filteredProjects = allProjects.filter(project =>
                    project.finfo_f === parseInt(facultyId) &&
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
        fetchFacultyDetail();
        fetchFacultyContact();
        fetchFacultyBackground();
        fetchFacultyResearchProjects();
    }, [facultyId]);

    console.log("researchProjects is: ",researchProjects);

    return (
        <>
            {/* Faculty Profile */}
            <section className="!bg-gray-50 h-full md:h-[400px]">
                {/* Cover Photo Area */}
                <div className='bg-red-900 lg:h-[300px] h-64 sm:h-80 relative'>
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex sm:hidden">
                        <div className=" flex justify-center -my-10 ">
                            <div className="mt-6">
                                <div className="flex gap-4  ">
                                    {socials.map(social => (
                                        <a
                                            key={social.social_id}
                                            href={social.social_link || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center bg-white rounded-full shadow-md"
                                        >
                                            <img
                                                src={social.img?.img ? `${API}/storage/uploads/${social.img.img}` : "/placeholder-icon.png"}
                                                alt="Social Icon"
                                                className="size-10"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        </div>
                        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pt-16">
                            <div className="flex flex-1 items-end gap-0 md:gap-6 w-full">
                                <div className="absolute md:relative -bottom-20 left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0">
                                    <div className="w-42 h-42 md:w-56 md:h-56 lg:w-72 lg:h-72 border-4 border-white rounded-full overflow-hidden shadow-xl">
                                        <img
                                            src={faculty?.image}
                                            alt={faculty?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="hidden md:flex flex-col ml-4 md:ml-6 flex-1 text-white pb-4">
                                    <h1 className="text-2xl lg:text-4xl font-bold mb-2">
                                        {faculty?.name}
                                    </h1>
                                    <h2 className="text-lg lg:text-xl text-gray-200">
                                        {faculty?.position}
                                    </h2>
                                    <div className="mt-6 hidden sm:block">
                                        <div className="flex gap-4">
                                            {socials.map(social => (
                                                <a
                                                    key={social.social_id}
                                                    href={social.social_link || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center mb-10 bg-white rounded-full shadow-md"
                                                >
                                                    <img
                                                        src={social.img?.img ? `${API}/storage/uploads/${social.img.img}` : "/placeholder-icon.png"}
                                                        alt="Social Icon"
                                                        className="size-10"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button - Desktop */}
                            <div className="hidden md:flex items-center gap-4">
                                <button className="bg-white hover:bg-gray-100 text-red-900 px-6 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-md">
                                    <BsViewStacked className="text-lg" />
                                    <span>View Portfolio</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Profile Info */}
                <div className="md:hidden pt-24 px-4 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {faculty?.name}
                    </h1>
                    <h2 className="text-lg text-gray-600 mb-4">
                        {faculty?.position}
                    </h2>
                    <div className="flex justify-center -my-10 ">
                        <div className="flex gap-4">
                            {socials.map(social => (
                                <a
                                    key={social.social_id}
                                    href={social.social_link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md"
                                >
                                    <img
                                        src={social.img?.img ? `${API}/storage/uploads/${social.img.img}` : "/placeholder-icon.png"}
                                        alt="Social Icon"
                                        className="w-6 h-6"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                    <button className="w-full max-w-xs mx-auto bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow-md">
                        <BsViewStacked className="text-lg" />
                        <span>View Portfolio</span>
                    </button>
                </div>
            </section>

            <div className='container mx-auto flex flex-col md:flex-row justify-between px-4 '>
                <div className=''>
                    <section className=" my-16">
                        <div className="max-w-4xl mx-auto space-y-8 p-4">
                            {/* About Section */}
                            {facultyInfo && (
                            <section className="space-y-6">
                                <h2 className="text-3xl font-bold text-gray-900">{facultyInfo.finfo_title}</h2>
                                    <div
                                    className="space-y-4 text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: facultyInfo.finfo_detail }}
                                    ></div>
                            </section>
                            )}

                            <div className="border-t border-gray-200 my-8"></div>

                                {/* Contact Section */}
                                {contacts.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Info</h3>
                                        <div className="space-y-2 flex flex-col sm:flex-row items-center gap-6">
                                            {contacts.map(contact => (
                                                <p
                                                    key={contact.fc_id}
                                                    className="text-red-700 hover:text-red-600 p-2 px-6 bg-pink-100 rounded-full transition-colors my-auto"
                                                >
                                                    <span className="font-normal">{contact.fc_name}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                </div>
                            </section>

                            {/* ResearchProjectsSection */}
                            <section>
                                <div className='my-16 bg-white rounded-xl shadow-md'>
                                    <div className='max-w-4xl mx-auto'>
                                        {researchProjects && researchProjects.map((project) =>(
                                            <div className="p-4">
                                                <section className="space-y-6">
                                                    <h2 className="text-3xl font-bold text-gray-900">{project.finfo_title}</h2>
                                                    <div
                                                    className="space-y-4 text-gray-700 leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: project.finfo_detail }}
                                                    ></div>
                                            </section>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                    {/* <ResearchProjectsSection /> */}
                    {/* <SelectedPublicationsSection /> */}
                </div>
                <div className=''>
                    <div className="my-16">
                        <div className="bg-white rounded-xl shadow-md p-6 m-5">
                            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                                Background
                            </h2>

                            {backgrounds.length > 0 && backgrounds.map((bg) => (
                                <div key={bg.fbg_id} className="flex items-center mb-4">
                                    <img
                                        src={bg.img?.img ? `${API}/storage/uploads/${bg.img.img}` : "/placeholder-icon.png"}
                                        alt={bg.fbg_name}
                                        className="w-12 h-12 mr-4 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-gray-700">{bg.fbg_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <BackgroundSection />
                    <CourseProjectsSection /> */}
                </div>
            </div>
            {/* Faculty About */}

        </>
    );
}

export default FacultyDetail