'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  FaUser, 
  FaPhone, 
  FaUniversity, 
  FaGraduationCap, 
  FaBook, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaBirthdayCake,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaChevronRight,
  FaStar
} from 'react-icons/fa';
import { 
  HiAcademicCap, 
  HiBriefcase, 
  HiChartBar, 
  HiClipboardList,
  HiLocationMarker
} from 'react-icons/hi';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    college: '',
    degree: '',
    classSemester: '',
    course: '',
    locality: '',
    pincode: '',
    birthYear: '',
    interests: [] as string[],
    comments: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | ''>('');
  const [otherInterests, setOtherInterests] = useState({
    'Engineering Courses': '',
    'Medical Courses': '',
    'Arts Courses': '',
    'Commerce Courses': '',
    'Other Professional Courses': '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, categoryTitle: string) => {
    const { value, checked } = e.target;

    setFormData(prev => {
      let updatedInterests = [...prev.interests];

      if (value === 'Others') {
        const othersTag = `Others (${categoryTitle})`;
        if (checked) {
          updatedInterests.push(othersTag);
        } else {
          updatedInterests = updatedInterests.filter(item => item !== othersTag);
          setOtherInterests(prevOthers => ({ ...prevOthers, [categoryTitle]: '' }));
        }
      } else {
        if (checked) {
          updatedInterests.push(value);
        } else {
          updatedInterests = updatedInterests.filter(item => item !== value);
        }
      }

      return { ...prev, interests: updatedInterests };
    });
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtherInterests(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    const interestsToSend = [
      ...formData.interests.filter(interest => !interest.startsWith('Others (')),
    ];

    for (const category in otherInterests) {
      const otherInterestValue = otherInterests[category as keyof typeof otherInterests];
      if (otherInterestValue) {
        interestsToSend.push(`Others (${category}): ${otherInterestValue}`);
      }
    }
    
    const dataToSend = { ...formData, interests: interestsToSend };

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '', whatsapp: '', college: '', degree: '',
          classSemester: '', course: '', locality: '', pincode: '',
          birthYear: '', interests: [], comments: '',
        });
        setOtherInterests({
          'Engineering Courses': '', 'Medical Courses': '', 'Arts Courses': '',
          'Commerce Courses': '', 'Other Professional Courses': '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const interestCategories = [
    {
      title: 'Engineering Courses',
      icon: HiAcademicCap,
      options: ['AI/ML & Data Science', 'Electronics', 'Instrumentation', 'Others']
    },
    {
      title: 'Medical Courses',
      icon: FaStar,
      options: ['Allopathy', 'AYUSH', 'Therapeutic disciplines (Physiotherapy, Psychology, etc.)', 'Others']
    },
    {
      title: 'Arts Courses',
      icon: HiChartBar,
      options: [
        'Fine Arts (painting, sculpture, etc.)',
        'Visual Arts (animation, graphic design, etc.)',
        'Performing Arts (dance, music, theatre)',
        'Humanities and Social Sciences (history, economics, etc.)',
        'Others'
      ]
    },
    {
      title: 'Commerce Courses',
      icon: HiBriefcase,
      options: [
        'Accounting & Auditing',
        'Investment Banking & Wealth Management Programs',
        'FinTech & Data-Driven Finance Courses',
        'Business & Management',
        'Taxation & Corporate Laws',
        'International Trade & Supply Chain Management',
        'Business Analytics & Financial Modelling',
        'Others'
      ]
    },
    {
      title: 'Other Professional Courses',
      icon: HiClipboardList,
      options: [
        'Legal', 'Defense', 'Space Research', 'Agricultural Science',
        'Indian Knowledge Systems (IKS)', 'Others'
      ]
    }
  ];

  // Input Icon Component with better alignment
  const InputIcon = ({ icon: Icon, className = "" }: { icon: React.ElementType, className?: string }) => (
    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
      <Icon className={`h-5 w-5 ${className}`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full shadow-2xl bg-white border-4 border-orange-100">
              <Image
                src="/rss.webp"
                width={120}
                height={120}
                alt="RSS flag logo"
                className="rounded-full object-cover p-2"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                RSS Yuva Karya
              </h1>
              <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto sm:mx-0 flex items-center justify-center sm:justify-start">
                Join the movement for youth development and nation building
              </p>
            </div>
          </div>
        </div>

        {submitStatus === 'success' ? (
          // Enhanced Success Message
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up border border-emerald-200">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-16 px-6 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center animate-bounce-in">
                  <FaCheck className="h-14 w-14 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Registration Successful!</h2>
              <p className="text-green-100 text-lg mb-6">Thank you for registering with RSS Yuva Karya. We'll be in touch soon!</p>
              <div className="flex items-center justify-center text-green-200">
                <FaStar className="mr-2" />
                <span>Your journey with us begins now</span>
                <FaStar className="ml-2" />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 shadow-2xl rounded-2xl border border-gray-100">
            <div className="mb-10 text-center border-b border-gray-100 pb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
                <HiAcademicCap className="text-orange-500 mr-3" />
                Registration Form
              </h2>
              <p className="text-gray-500 mt-3 flex items-center justify-center">
                <FaChevronRight className="text-orange-400 mr-2 text-sm" />
                Please fill out all required fields to join our community
              </p>
            </div>

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start animate-shake">
                <FaExclamationTriangle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">There was an error submitting the form.</p>
                  <p className="text-sm mt-1">Please try again or contact support if the problem persists.</p>
                </div>
              </div>
            )}

            {/* Form Grid with Better Spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Name */}
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaUser className="text-orange-500 mr-2 text-sm" />
                  Name <span className="text-orange-600 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                  placeholder="Your full name" 
                />
              </div>
              
              {/* WhatsApp Number */}
              <div className="relative">
                <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaPhone className="text-orange-500 mr-2 text-sm" />
                  WhatsApp Number <span className="text-orange-600 ml-1">*</span>
                </label>
                <input 
                  type="tel" 
                  id="whatsapp" 
                  name="whatsapp" 
                  required 
                  value={formData.whatsapp} 
                  onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                  placeholder="Your WhatsApp number" 
                />
              </div>
              
              {/* College */}
              <div className="relative">
                <label htmlFor="college" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaUniversity className="text-orange-500 mr-2 text-sm" />
                  College <span className="text-orange-600 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="college" 
                  name="college" 
                  required 
                  value={formData.college} 
                  onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                  placeholder="Your college name" 
                />
              </div>
              
              {/* Degree */}
              <div className="relative">
                <label htmlFor="degree" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaGraduationCap className="text-orange-500 mr-2 text-sm" />
                  Degree <span className="text-orange-600 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="degree" 
                  name="degree" 
                  required 
                  value={formData.degree} 
                  onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                  placeholder="e.g., B.E., M.B.B.S" 
                />
              </div>

              {/* Course */}
              <div className="relative">
                <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  Course <span className="text-orange-600 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="course" 
                  name="course" 
                  required 
                  value={formData.course} 
                  onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                  placeholder="Your course of study" 
                />
              </div>
              
              {/* Class/Semester */}
              <div className="relative">
                <label htmlFor="classSemester" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaCalendarAlt className="text-orange-500 mr-2 text-sm" />
                  Class/Semester <span className="text-orange-600 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="classSemester" 
                  name="classSemester" 
                  required 
                  value={formData.classSemester} 
                  onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                  placeholder="e.g., Final Year" 
                />
              </div>

              {/* Residential Locality */}
              <div className="relative">
                <label htmlFor="locality" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <HiLocationMarker className="text-orange-500 mr-2 text-sm" />
                  Residential Locality <span className="text-orange-600 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="locality" 
                  name="locality" 
                  required 
                  value={formData.locality} 
                  onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                  placeholder="e.g., Girinagar 2nd Phase" 
                />
              </div>
              
              {/* Pincode */}
              <div className="relative">
                <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaMapMarkerAlt className="text-orange-500 mr-2 text-sm" />
                  Pincode <span className="text-orange-600 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  id="pincode" 
                  name="pincode" 
                  required 
                  value={formData.pincode} 
                  onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                  placeholder="Your area pincode" 
                />
              </div>
              
              {/* Birth Year */}
              <div className="relative md:col-span-2">
                <label htmlFor="birthYear" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaBirthdayCake className="text-orange-500 mr-2 text-sm" />
                  Birth Year <span className="text-orange-600 ml-1">*</span>
                </label>
                <input 
                  type="number" 
                  id="birthYear" 
                  name="birthYear" 
                  required 
                  value={formData.birthYear} 
                  onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                  placeholder="e.g., 2005" 
                  min="1900" 
                  max="2025" 
                />
              </div>
            </div>

            {/* Enhanced Interests Section */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center border-b border-gray-100 pb-4">
                <HiAcademicCap className="text-orange-500 mr-3" />
                Area of Interest <span className="text-orange-600 ml-1">*</span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {interestCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div key={category.title} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300 group">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center group-hover:text-orange-600 transition-colors">
                        <CategoryIcon className="text-orange-500 mr-3 group-hover:scale-110 transition-transform" />
                        {category.title}
                      </h4>
                      <div className="space-y-3">
                        {category.options.map((option, optIndex) => (
                          <div key={optIndex}>
                            <label className="flex items-start cursor-pointer text-gray-700 hover:text-gray-900 group/option">
                              <input
                                type="checkbox"
                                name={category.title}
                                value={option}
                                checked={
                                  option !== 'Others' 
                                    ? formData.interests.includes(option)
                                    : formData.interests.includes(`Others (${category.title})`)
                                }
                                onChange={(e) => handleCheckboxChange(e, category.title)}
                                className="peer hidden"
                              />
                              <div className="w-5 h-5 flex items-center justify-center border-2 border-gray-300 rounded-md transition-all duration-200 peer-checked:bg-orange-500 peer-checked:border-orange-500 mt-0.5 group-hover/option:border-orange-300">
                                <FaCheck className="w-3 h-3 text-white hidden peer-checked:block" />
                              </div>
                              <span className="ml-3 text-sm font-medium leading-relaxed">{option}</span>
                            </label>
                            {option === 'Indian Knowledge Systems (IKS)' && (
                              <p className="text-xs text-gray-500 ml-8 mt-1">(e.g., Indian Mathematics, Astronomy, etc.)</p>
                            )}
                            {option === 'Others' && formData.interests.includes(`Others (${category.title})`) && (
                              <div className="mt-2 ml-8">
                                <input 
                                  type="text" 
                                  name={category.title} 
                                  value={otherInterests[category.title as keyof typeof otherInterests]} 
                                  onChange={handleOtherChange} 
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 text-sm"
                                  placeholder="Please specify your interest" 
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-8">
              <label htmlFor="comments" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <HiClipboardList className="text-orange-500 mr-2" />
                Comments (Optional)
              </label>
              <textarea 
                id="comments" 
                name="comments" 
                rows={4} 
                value={formData.comments} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm placeholder-gray-400"
                placeholder="Any additional comments or questions?"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-lg py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] group"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-3 h-5 w-5" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FaCheck className="mr-3 h-5 w-5" />
                  Submit Registration
                </span>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p className="flex items-center justify-center">
            <FaStar className="text-amber-400 mr-2 text-xs" />
            Your information is secure and will only be used for RSS Yuva Karya initiatives
            <FaStar className="text-amber-400 ml-2 text-xs" />
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        @keyframes bounce-in { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }
        .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
      `}</style>
    </div>
  );
}