import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ResumeSchema = new Schema({
    full_name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    hel: {
        type: String,
    },
    cloudinary_link:{
        type: String,
    },
});

// Check if the model already exists before defining it
const Resume = mongoose.models.Resume || model("Resume", ResumeSchema);

export default Resume;