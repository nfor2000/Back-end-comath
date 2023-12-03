const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3')
const {S3Client} = require('@aws-sdk/client-s3')
const {v4:uuid} = require('uuid');
const { teacherProtected } = require('../middleware/authMiddleware')
const router = express.Router();
const User = require('../models/userModel');
const path = require("path")
const { registerTeacher, getTeacher, loginTeacher, getAllTeachers, getTeacherById, updateTeacher } = require('../controllers/teacherController');

const s3 = new S3Client({
     credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
     },
     region: "af-south-1"
})

const s3Storage = multerS3({
     s3: s3,
     bucket: "myawsbucketgroup23",
     acl: "public-read",
     metadata: (req, file, cb) => {
          cb(null, {fieldname: file.fieldname})
     },
     key: (req, file, cb) => {
          const fileName = uuid() + "_" + file.fieldname + "_" + file.originalname
          cb(null, fileName)
     }
})

// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
     // Define the allowed extension
     const fileExts = [".png", ".jpg", ".jpeg",".pdf"];
 
     // Check allowed extensions
     const isAllowedExt = fileExts.includes(
         path.extname(file.originalname.toLowerCase())
     );
 
     // Mime type must be an image
     const isAllowedMimeType = file.mimetype.startsWith("image/") ||  file.mimetype.startsWith("application/");
 
     if (isAllowedExt && isAllowedMimeType) {
         return cb(null, true); // no errors
     } else {
         // pass error msg to callback, which can be displaye in frontend
         cb("Error: File type not allowed!");
     }
 }
 
 // our middleware
 const uploadFiles = multer({
     storage: s3Storage,
     fileFilter: (req, file, callback) => {
         sanitizeFile(file, callback)
     },
     limits: {
         fileSize: 1024 * 1024 * 8 // 2mb file size
     }
 })
 

// const storage = multer.diskStorage({
//      destination: (req, file, cb) => {
//           cb(null, './public')
//      },
//      filename: (req, file, cb) => {
//           const fileName = file.originalname.toLowerCase().split(' ').join('-');
//           cb(null, uuid() + '-' + fileName)
//      },
// })

// var upload = multer({
//      storage: storage,
//      fileFilter: (req, file, cb) => {
//          if (
//           file.mimetype == "image/png" || 
//           file.mimetype == "image/jpg" || 
//           file.mimetype == "image/jpeg"  
//           ) {
//              cb(null, true);
//          } else {
//              cb(null, false);
//              return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//          }
//      }
//  });

 router.post('/register',uploadFiles.fields([{name:"cv", maxCount: 1},{name:"profileImg", maxCount : 1}]), registerTeacher)
 
 router.get("/",teacherProtected, getTeacher);

 router.get("/profile/:id", getTeacherById);

 router.post("/login",loginTeacher);

 router.get('/allteachers', getAllTeachers)
 router.post("/update/",teacherProtected, uploadFiles.fields([{name:"cv", maxCount: 1},{name:"profileImg", maxCount : 1}]), updateTeacher)



 module.exports = router;