import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  subjects: [{
    subjectCode: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      default: 0, 
    },
   
  }],
  assignment: [{
    filename: String,
    path: String,
  }],
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
