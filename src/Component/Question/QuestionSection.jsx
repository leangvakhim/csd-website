import React, {useState, useEffect, useRef} from "react";
import { motion } from "framer-motion";
import contactImage from "../../assets/web-sample-1(3).jpg";
import { API_ENDPOINTS, axiosInstance } from "../../Service/APIconfig";
import Swal from 'sweetalert2';

const QuestionSection = () => {
  const captchaCanvasRef = useRef(null);
  const [formData, setFormData] = useState({
    m_firstname: '',
    m_lastname: '',
    m_email: '',
    m_description: ''
  });

  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);

    const canvas = captchaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},0.8)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw captcha text
    ctx.font = ' 24px sans-serif';
    for (let i = 0; i < result.length; i++) {
      const angle = (Math.random() - 0.5) * 0.5;
      ctx.save();
      ctx.translate(20 * i + 5, 25);
      ctx.rotate(angle);
      ctx.fillStyle = `rgba(${Math.floor(Math.random()*150)},${Math.floor(Math.random()*150)},${Math.floor(Math.random()*150)},1)`;
      ctx.fillText(result[i], 0, 0);
      ctx.restore();
    }

    // Optional noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},0.6)`;
      ctx.beginPath();
      ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userCaptcha !== captcha) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid CAPTCHA',
        text: 'Please enter the correct CAPTCHA.'
      });

      setUserCaptcha('');
      generateCaptcha();

      return;
    }
    Swal.fire({
      title: 'Sending...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    try {
      await axiosInstance.post(API_ENDPOINTS.createEmail, {
        ...formData,
        captcha: userCaptcha
      });
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your message has been sent!',
      });

      setFormData({
        m_firstname: "",
        m_lastname: "",
        m_email: "",
        m_description: ""
      });
      setUserCaptcha('');
      generateCaptcha();
    } catch (err) {
      Swal.close();
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to send your message. Please try again!',
      });
    }
  };

  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;
  return (
    <div className="my-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4"
      >
        <div className="">
          <div className="relative flex flex-col xl:flex-row sm:gap-0 gap-6 items-center justify-center">
            {/* Image Section (Top on Small Screens, Right Side on Large Screens) */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="xl:max-w-[611px] xl:h-[663px] w-full h-auto flex justify-center items-center order-1 xl:order-2"
            >
              <img
                src={contactImage}
                alt="Contact Us"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </motion.div>

            {/* Contact Form (Bottom on Small Screens, Left Side on Large Screens) */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="xl:w-[836px] xl:h-[618px] w-full xl:p-6 p-4 bg-white shadow-md rounded-2xl xl:mr-[-100px] z-0 order-2 xl:order-1"
            >
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`${currentLang === 2 ? "font-khmer" : "font-sans"
                      } text-3xl text-center mb-4 font-semibold`}
                >
                  {currentLang === 1 ? "Contact Us If You Have Any Questions" : "សូមទាក់ទងមកយើង ប្រសិនបើអ្នកមានចម្ងល់"}
                </motion.h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
                      viewport={{ once: true }}
                    >
                      <label className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      } block text-sm font-medium text-gray-700`}>
                        {currentLang === 1 ? "First Name*" : "នាមខ្លួន*"}
                      </label>
                      <input
                        type="text"
                        required
                        name="m_firstname"
                        value={formData.m_firstname}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                      viewport={{ once: true }}
                    >
                      <label className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      } block text-sm font-medium text-gray-700`}>
                        {currentLang === 1 ? "Last Name*" : "នាមត្រកូល*"}
                      </label>
                      <input
                        type="text"
                        name="m_lastname"
                        required
                        value={formData.m_lastname}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border bg-gray-300 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }}
                    viewport={{ once: true }}
                  >
                    <label className={`block text-sm font-medium text-gray-700 ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      }`}>
                      {currentLang === 1 ? "Email*" : "អ៊ីមែល*"}
                    </label>
                    <input
                      type="email"
                      name="m_email"
                      required
                      value={formData.m_email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border bg-gray-300 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
                    viewport={{ once: true }}
                  >
                    <label className={`block text-sm font-medium text-gray-700 ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      }`}>
                      {currentLang === 1 ? "Description" : "ពិពណ៌នា"}
                    </label>
                    <textarea
                      name="m_description"
                      rows="4"
                      value={formData.m_description}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border bg-gray-300 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
                    viewport={{ once: true }}
                  >
                    <label className={`block text-sm font-medium text-gray-700 mb-1 ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                        }`}>
                      {currentLang === 1 ? "Verification code*" : "កូដសុវត្ថិភាព*"}
                    </label>
                    <div className="flex items-center gap-2 w-full mb-2">
                      <canvas ref={captchaCanvasRef} width="120" height="40" className="border rounded-md bg-white" />
                      <button type="button" onClick={generateCaptcha} className="text-sm text-red-800 underline">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        name="captcha_input"
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        required
                        className="flex-1 px-3 py-2 border bg-gray-300 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    className="flex"
                  >
                    <button
                      type="submit"
                      className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      } py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      {currentLang === 1 ? "Submit" : "បញ្ជូន"}
                    </button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionSection;
