'use client';

import { useState } from 'react';
import Image from 'next/image';

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

    let interestsToSend = [...formData.interests];

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
          name: '',
          whatsapp: '',
          college: '',
          degree: '',
          classSemester: '',
          course: '',
          locality: '',
          pincode: '',
          birthYear: '',
          interests: [],
          comments: '',
        });
        setOtherInterests({
          'Engineering Courses': '',
          'Medical Courses': '',
          'Arts Courses': '',
          'Other Professional Courses': '',
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
      options: ['AI/ML & Data Science', 'Electronics', 'Instrumentation', 'Others']
    },
    {
      title: 'Medical Courses',
      options: ['Allopathy', 'AYUSH', 'Therapeutic disciplines (Physiotherapy, Psychology, etc.)', 'Others']
    },
    {
      title: 'Arts Courses',
      options: [
        'Fine Arts (painting, sculpture, etc.)',
        'Visual Arts (animation, graphic design, etc.)',
        'Performing Arts (dance, music, theatre)',
        'Humanities and Social Sciences (history, economics, etc.)',
        'Others'
      ]
    },
    {
      title: 'Other Professional Courses',
      options: [
        'Legal', 
        'Defense', 
        'Space Research', 
        'Agricultural Science',
        'Indian Knowledge Systems (IKS)',
        'Others'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-full shadow-lg">
              <Image
                src="/rss.webp"
                width={120}
                height={120}
                alt="RSS flag logo"
                className="rounded-full object-cover"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              RSS Yuva Karya
            </h1>
          </div>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto font-light">
            Join the movement for youth development and nation building.
          </p>
        </div>

        {submitStatus === 'success' ? (
          // Beautiful Success Message
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-10 px-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white animate-bounce-in" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">Registration Successful!</h2>
              <p className="text-green-100 text-lg">Thank afor registering with RSS Yuva Karya. We'll be in touch!</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 shadow-xl rounded-2xl">
            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Registration Form</h2>
              <p className="text-gray-500 mt-2">Please fill out all the required fields to join our community.</p>
            </div>

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start animate-shake">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">There was an error submitting the form.</p>
                  <p className="text-sm mt-1">Please try again or contact support if the problem persists.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Left column for fields */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                    College <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    required
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                    placeholder="Enter your college name"
                  />
                </div>
                <div>
                  <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                    Degree <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    required
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                    placeholder="Example: B.E., M.B.B.S, B.A."
                  />
                </div>
                <div>
                  <label htmlFor="classSemester" className="block text-sm font-medium text-gray-700 mb-1">
                    Class/Semester <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="classSemester"
                    name="classSemester"
                    required
                    value={formData.classSemester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                    placeholder="Example: Final Year, 6th Semester"
                  />
                </div>
              </div>

              {/* Right column for fields */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                    placeholder="Enter your WhatsApp number"
                  />
                </div>
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                    Course <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    required
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                    placeholder="Enter your course of study"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">
                      Residential Locality <span className="text-orange-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="locality"
                      name="locality"
                      required
                      value={formData.locality}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                      placeholder="Example: Girinagar 2nd Phase"
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode <span className="text-orange-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                      placeholder="Enter your area pincode"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Birth Year <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="birthYear"
                    name="birthYear"
                    required
                    value={formData.birthYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                    placeholder="Example: 2005"
                    min="1900" 
                    max="2025" 
                  />
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM9 13a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                </svg>
                Area of Interest <span className="text-orange-600 ml-1">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {interestCategories.map((category, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-2.5 h-2.5 bg-orange-500 rounded-full mr-2"></span>
                      {category.title}
                    </h4>
                    <div className="space-y-2">
                      {category.options.map((option, optIndex) => (
                        <div key={optIndex}>
                          <label className="flex items-center cursor-pointer text-gray-700">
                            <input
                              type="checkbox"
                              name={category.title} // Use category.title for grouping
                              value={option}
                              // Updated `checked` logic
                              checked={
                                option !== 'Others' 
                                  ? formData.interests.includes(option)
                                  : formData.interests.includes(`Others (${category.title})`)
                              }
                              onChange={(e) => handleCheckboxChange(e, category.title)}
                              className="hidden"
                            />
                            <div className="w-5 h-5 flex items-center justify-center border-2 border-gray-300 rounded-md transition-all duration-200">
                              {/* Updated checkmark logic */}
                              {(
                                option !== 'Others' 
                                  ? formData.interests.includes(option)
                                  : formData.interests.includes(`Others (${category.title})`)
                              ) && (
                                <svg className="w-4 h-4 text-white bg-orange-500 rounded-sm p-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="ml-3 text-sm font-medium">{option}</span>
                          </label>
                          {option === 'Others' && formData.interests.includes(`Others (${category.title})`) && (
                            <div className="mt-2">
                              <input
                                type="text"
                                name={category.title}
                                value={otherInterests[category.title as keyof typeof otherInterests]}
                                onChange={handleOtherChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 text-gray-900 shadow-sm"
                                placeholder="Please specify your other interest"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                Comments (Optional)
              </label>
              <textarea
                id="comments"
                name="comments"
                rows={4}
                value={formData.comments}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
                placeholder="Any additional comments or questions?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Submit Registration
                </span>
              )}
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Your information is secure and will only be used for RSS Yuva Karya initiatives.</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }

        .animate-fade-in-up {
          animation: fadeIn-up 0.7s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
      `}</style>
    </div>
  );
}