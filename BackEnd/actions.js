"use server"

import connectDB from "../db/connectDB";
import Resume from "../models/resume";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

// Create a new resume submission
export async function createResume(formData) {
  try {
    // Connect to the database
    await connectDB();
    
    // Extract data from formData (this would be done in the API route, 
    // including cloudinary upload)
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const education = formData.get('education');
    const resumeUrl = formData.get('resumeUrl');
    const cloudinaryId = formData.get('cloudinaryId');
    
    // Create a new resume record
    const newResume = await Resume.create({
      full_name: fullName,
      email: email,
      phone: phone,
      hel: education,
      cloudinary_link: resumeUrl,
      cloudinary_id: cloudinaryId
    });
    
    // Format the response
    const formattedResume = {
      _id: newResume._id.toString(),
      fullName: newResume.full_name,
      email: newResume.email,
      phone: newResume.phone,
      education: newResume.hel,
      resumeUrl: newResume.cloudinary_link,
      createdAt: newResume.createdAt
    };
    
    // Revalidate the cache for the home page
    revalidatePath('/');
    
    return { success: true, data: formattedResume };
    
  } catch (error) {
    console.error("Create resume error:", error);
    return { success: false, error: "Error creating resume submission" };
  }
}

// Get all resume submissions
export async function getResumes() {
  try {
    // Connect to the database
    await connectDB();
    
    // Get all resumes, sorted by newest first
    const resumes = await Resume.find({}).sort({ createdAt: -1 });
    
    // Format the response
    const formattedResumes = resumes.map(resume => ({
      _id: resume._id.toString(),
      fullName: resume.full_name,
      email: resume.email,
      phone: resume.phone,
      education: resume.hel,
      resumeUrl: resume.cloudinary_link,
      createdAt: resume.createdAt
    }));
    
    return { success: true, data: formattedResumes };
    
  } catch (error) {
    console.error("Get resumes error:", error);
    return { success: false, error: "Error fetching resume submissions" };
  }
}