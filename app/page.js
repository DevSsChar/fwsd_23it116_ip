"use client"

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "bachelor",
    resume: null
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0]
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData for the API request
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('education', formData.education);
      formDataToSend.append('resume', formData.resume);
      
      // Upload to server which will use Cloudinary
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload resume');
      }
      
      const result = await response.json();
      
      // Add new submission with Cloudinary URL
      setSubmissions([result.data, ...submissions]);
      setMessage({ text: "Resume submitted successfully!", type: "success" });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        education: "bachelor",
        resume: null
      });
      
      // Reset file input
      document.getElementById("resumeFile").value = "";
      
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ text: error.message || "Error submitting resume. Please try again.", type: "error" });
    } finally {
      setLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    }
  };

  // Fetch existing submissions from the backend API
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      
      try {
        // Make API request to fetch all resumes
        const response = await fetch('/api/resumes');
        
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        
        const result = await response.json();
        
        if (result.success) {
          setSubmissions(result.data || []);
        } else {
          throw new Error(result.error || 'Error fetching submissions');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setMessage({ text: "Error loading submissions", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Map education values to display text
  const educationLabels = {
    highschool: "High School",
    bachelor: "Bachelor's Degree",
    master: "Master's Degree",
    phd: "PhD"
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="mb-8 pt-4 pb-6 border-b border-gray-200">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-blue-600">Resume Submission Portal</h1>
          <p className="mt-2 text-gray-600">Upload your resume and information for consideration</p>
        </div>
      </header>

      <main className="container mx-auto grid gap-10 md:grid-cols-[1fr_1.2fr] lg:grid-cols-[1fr_1.5fr]">
        {/* Form Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Submit Your Resume</h2>
          
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                Highest Education Level
              </label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="highschool" className="text-gray-700">High School</option>
                <option value="bachelor"  className="text-gray-700">Bachelor's Degree</option>
                <option value="master" className="text-gray-700">Master's Degree</option>
                <option value="phd" className="text-gray-700">PhD</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700 mb-1">
                Resume (PDF only)
              </label>
              <input
                type="file"
                id="resumeFile"
                name="resumeFile"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Maximum file size: 5MB</p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : "Submit Resume"}
            </button>
          </form>
        </section>
        
        {/* Table Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Recent Submissions</h2>
          
          {loading && submissions.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.fullName}</div>
                        <div className="text-sm text-gray-500">{item.email}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {educationLabels[item.education]}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        {item.resumeUrl && item.resumeUrl !== "#" ? (
                          <a 
                            href={item.resumeUrl} 
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            View PDF
                          </a>
                        ) : (
                          <span className="text-gray-400">Not available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {submissions.length === 0 && !loading && (
                <div className="text-center py-10 text-gray-500">
                  No submissions yet.
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      
      <footer className="mt-12 pt-6 pb-8 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Resume Submission Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
