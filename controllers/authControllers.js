import studentModel from "../models/studentModel.js"
import multer from "multer";
import path from "path";
export const registerController = async (req, res) => {
  try {
    const { name, batch, registrationNumber, semester, subjects } = req.body;

    if(!name)
    {return res.status(400).send({msg:"Name is required!"})}
    if(!batch){
        return  res.status(400).send({msg:'batch is required!'})
    }
    if(!registrationNumber){
        return  res.status(400).send({msg:'regisno. is required!'})
    }
    if(!semester){
        return  res.status(400).send({msg:'semester is required!'})
    }
    if(!subjects){
        return  res.status(400).send({msg:'subjects is required!'})
    }
    const user = await studentModel.findOne({ registrationNumber: registrationNumber.toUpperCase() });

    if (user) {
      return res.status(200).send({
        success: false,
        msg: `User with the registrationNumber ${registrationNumber} already exists`,
      });
    }

    
    const newUser = await new studentModel({
      name,
      batch,
      registrationNumber:registrationNumber.toUpperCase(),
      semester,
      subjects,
    }).save();

    res.status(201).send({
      success: true,
      msg: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};



export const result=  async (req, res) => {
    try {
      const registrationNumber = req.params.registrationNumber.toUpperCase();
      const student = await studentModel.findOne({ registrationNumber:registrationNumber.toUpperCase() });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
     
      const totalMarks = student.subjects.reduce((total, subject) => total + subject.marks, 0);
  
     
      const result = {
        name: student.name,
        registrationNumber: student.registrationNumber.toUpperCase(),
        totalMarks,
        subjects: student.subjects,
      };
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }






export const addsubjects = async (req, res) => {
    try {
        const { subjectCode, subjectName ,registrationNumber} = req.body;
        
    
       
        if(!subjectCode)
    {return res.status(400).send({msg:"subjectcode is required!"})}
    if(!subjectName){
        return  res.status(400).send({msg:'subjectName is required!'})
    }
    if(!registrationNumber){
        return  res.status(400).send({msg:'registration no. is required!'})
    }
  
    
        const user = await studentModel.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    
        if (!user) {
          return res.status(404).send({
            success: false,
            msg: `User with the registrationNumber ${registrationNumber} not found`,
          });
        }
    
        
        const subjectIndex = user.subjects.findIndex(subject => subject.subjectCode === subjectCode.toUpperCase());
    
        if (subjectIndex != -1) {
          return res.status(404).send({
            success: false,
            msg: `Subject with code ${subjectCode} already exists for the user`,
          });
        }
    
        user.subjects.push ({
           subjectCode: subjectCode.toUpperCase(),subjectName
        });
        
        await user.save();
    
        res.status(200).send({
          success: true,
          msg: `subject added successfully `,
          updatedUser: user,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Internal server error' });
      }
      
    };
  
  export const dashboard= async (req, res) => {
    try {
      const students = await studentModel.find();
      console.log(students)
      const studentsWithResults = students.map((student) => {
        const totalMarks = student.subjects.reduce((acc, subject) => acc + subject.marks, 0);
        const percentage = ((totalMarks / (student.subjects.length * 100)) * 100).toFixed(2);
        return {
          _id: student._id,
          name: student.name,
          registrationNumber: student.registrationNumber,
          totalMarks,
          percentage,
        };
      });
  
      res.status(200).json(studentsWithResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  export const studentdetails = async(req,res)=>{
    try {
      const student = await studentModel.findOne({
        registrationNumber: req.params.registrationNumber.toUpperCase(),
      });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.status(200).json({
        _id: student._id,
        name: student.name,
        registrationNumber: student.registrationNumber,
        batch: student.batch,
        semester: student.semester,
        subjects: student.subjects,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  export const searchstudent = async(req,res)=>{
    
  const query = req.query.query;

  try {
    const students = await studentModel.find({
      $or: [
        { registrationNumber: { $regex: query, $options: 'i' } }, 
        { name: { $regex: query, $options: 'i' } }, 
      ],
    });

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  }
 
export const addmarks = async (req, res) => {
  try {
    const { marksData, registrationNumber } = req.body;

    if (!registrationNumber) {
      return res.status(400).send({ msg: 'Registration number is required!' });
    }

    const user = await studentModel.findOne({ registrationNumber: registrationNumber.toUpperCase() });

    if (!user) {
      return res.status(404).send({
        success: false,
        msg: `User with the registrationNumber ${registrationNumber} not found`,
      });
    }

    marksData.forEach((item) => {
      const subjectIndex = user.subjects.findIndex((subject) => subject.subjectCode === item.subjectCode.toUpperCase());

      if (subjectIndex !== -1) {
        user.subjects[subjectIndex].marks = item.marks;
      }
    });

    await user.save();

    res.status(200).send({
      success: true,
      msg: 'Marks added successfully',
      updatedUser: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: 'Internal server error' });
  }
};


export const getStudentSubjects = async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    if (!registrationNumber) {
      return res.status(400).send({ msg: 'Registration number is required!' });
    }

    const user = await studentModel.findOne({ registrationNumber: registrationNumber.toUpperCase() });

    if (!user) {
      return res.status(404).send({
        success: false,
        msg: `User with the registrationNumber ${registrationNumber} not found`,
      });
    }

    res.status(200).send({
      success: true,
      subjects: user.subjects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: 'Internal server error' });
  }
};





export const updatestudent = async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    if (!registrationNumber) {
      return res.status(400).send({ msg: 'Registration number is required!' });
    }

    const user = await studentModel.findOne({ registrationNumber: registrationNumber.toUpperCase() });

    if (!user) {
      return res.status(404).send({
        success: false,
        msg: `User with the registrationNumber ${registrationNumber} not found`,
      });
    }

    // Update name, batch, and semester if provided in the request body
    const { name, batch, semester } = req.body;

    if (name) user.name = name;
    if (batch) user.batch = batch;
    if (semester) user.semester = semester;

    // Save the updated user document
    await user.save();

    return res.status(200).send({
      success: true,
      msg: 'Student information updated successfully',
      user: {
        name: user.name,
        batch: user.batch,
        semester: user.semester,
        subjects: user.subjects, 
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'Internal server error' });
  }
};
