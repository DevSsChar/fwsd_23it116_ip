import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/db/connectDB';
import Resume from '@/models/resume';

export async function POST(request) {
    try {
        const formData = await request.formData();

        // Extract file and form data
        const file = formData.get('resume');
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const education = formData.get('education');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to base64 string for Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64String}`;

        // Upload directly to Cloudinary without creating a temp file
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            folder: 'resumes',
            public_id: `${fullName.replace(/\s+/g, '_')}_${Date.now()}`,
            format: 'pdf',
            type: 'upload',
            access_mode: 'public'
        });

        // Connect to database and store submission
        await connectDB();
        
        // Create database entry
        const newResume = await Resume.create({
            full_name: fullName,
            email: email,
            phone: phone,
            hel: education,
            cloudinary_link: result.secure_url + "?content-disposition=inline",
            cloudinary_id: result.public_id
        });

        return NextResponse.json({
            success: true,
            data: {
                _id: newResume._id.toString(),
                fullName: newResume.full_name,
                email: newResume.email,
                phone: newResume.phone,
                education: newResume.hel,
                resumeUrl: newResume.cloudinary_link,
                createdAt: newResume.createdAt
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Error uploading file' },
            { status: 500 }
        );
    }
}