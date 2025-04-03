import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import Resume from '@/models/resume';

export async function GET() {
  try {
    // Connect to database
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
    
    return NextResponse.json({
      success: true,
      data: formattedResumes
    });
    
  } catch (error) {
    console.error('Get resumes error:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching resume submissions' },
      { status: 500 }
    );
  }
}