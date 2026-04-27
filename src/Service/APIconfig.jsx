import axios from "axios";

// const API = "https://aimostore.shop";
// const API = "https://www.aimostore.shop";
const API = ""; 
// const API = "https://cs.fs.rupp.edu.kh/laravelapi";

const API_BASEURL = "";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');

//     if (token) {
//       const isValidToken = token.startsWith('ey'); // Basic format check
//       if (isValidToken) {
//         config.headers.Authorization = `Bearer ${token}`;
//       } else {
//         localStorage.removeItem('token');
//         // Optionally, force a page reload if token is bad
//         window.location.reload();
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Response interceptor to catch 401 errors and handle token expiration
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('token');
      // window.location.reload();
      console.warn("🔒 Unauthorized request detected (401).");
    }
    return Promise.reject(error);
  }
);

const API_ENDPOINTS = {

    //guest-token
    getGuestToken: `/guest-token`,

    // images
    getImages: `/images`,

    // event
    getEvent: `/event`,

    // menu
    getMenu: `/menu`,

    // page
    getPage: `/page`,

    // news
    getNews: `/news`,

    // banner
    getBanner: `/banner`,

    // academic
    getAcademic: `/academic`,

    // headersection
    getHeaderSection: `/headersection`,

    // intro (introduction)
    getIntroduction: `/intro`,

    // idd (important)
    getImportant: `/idd`,

    // department
    getDepartment: `/department`,

    // faq
    getFAQ: `/faq`,

    // apd (available)
    getAvailable: `/apd`,

    // ha (apply)
    getApply: `/ha`,

    // ufcsd (future)
    getFuture: `/ufcsd`,

    // umd (unlock)
    getUnlock: `/umd`,

    // fee
    getFee: `/fee`,

    // study-degree (study)
    getStudy: `/study-degree`,

    // gc(criteria)
    getCriteria: `/gc`,

    // rason(Add On of CSD)
    getAddOnCSD: `/rason`,

    // information
    getText: `/text`,

    // testimonial
    getTestimonial: `/testimonial`,

    // gallery
    getGallery: `/gallery`,

    // gcaddon (subrequirement)
    getSubRequirement: `/gcaddon`,

    // acad-facilities(facilities)
    getAcadFacilities: `/acad-facilities`,

    // ras(specialization)
    getSpecialization: `/ras`,

     // faculty
     getFaculty: `/faculty`,

    // tse(type)
    getType: `/tse`,

    // subtse(subtype)
    getSubType: `/subtse`,

    // subidd(subimportant)
    getSubImportant: `/subidd`,

    // subha(subapply)
    getSubApply: `/subha`,

    // faqaddon(subFAQ)
    getSubFAQ: `/faqaddon`,

    // ufaddon(subfuture)
    getSubFuture: `/ufaddon`,

    // subapd(subavailable)
    getSubAvailable: `/subapd`,

    // year(sub studydegree)
    getSubStudyDegree: `/year`,

    // setting
    getSetting: `/setting2`,

    // socialsetting
    getSocialSetting: `/settingsocial`,

    // contact
    getContact: `/contact`,
    getContactByLang: `/contact/lang`,

    // subservice
    getSubserviceAF: `/subservice`,

    // slideshow
    getSlideshow: `/slideshow`,

    // service
    getService: `/service`,

    // btnss
    getBtnss: `/btnss`,

    // section
    getSection: `/section`,
    getSectionByPage: `/section/by-page`,

    // faculty

    // faculty-contact
    getFacultyContact: `/faculty-contact`,
    getFacultyContactByFaculty: `/faculty-contact/by-faculty`,

    // faculty-bg
    getFacultyBG: `/faculty-bg`,
    getFacultyBGByFaculty: `/faculty-bg/by-faculty`,

    // faculty-info
    getFacultyInfo: `/faculty-info`,

    // social
    getSocial: `/social`,

    // career
    getCareer: `/career`,

    // feedback
    getScholarship: `/scholarship`,

    // research
    getResearch: `/rsd`,

    // researchlab
    getResearchlab: `/rsdl`,

    //rsdltag
    getResearchlabTag: `/rsdltag`,

    // feedback
    getFeedback: `/feedback`,

    // partnership
    getPartnership: `/partnership`,

    // developer
    getDevelopers: `/developer`,

    // developersocial
    getSocialDeveloper: `/developersocial`,

    // researchtitle
    getResearchTitle: `/rsd-title`,

    // subcontact
    getSubContact: `/subcontact`,

    // rsd-desc (Research Description)
    getRsdDescription: `/rsd-desc`,

    // rsd-project (Research Project)
    getRsdProject: `/rsd-project`,

    // rsd-meet (Research Project)
    getRsdMeeting: `/rsd-meet`,

    // import announcement
    getAnnouncementStudent: `/announcement/student`,
    getAnnouncement: `/announcements`,

    // submit email
    createEmail: `/emails/create`
};

export { API_BASEURL, API_ENDPOINTS, API, axiosInstance };